// Requiring libraries
const router = require('express').Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Setting up objection
const Video = require('../models/Video');
const Comment = require('../models/Comment');
const Tag = require('../models/Tag');
const Knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('../knexfile');
const User = require('../models/User');
const { default: Swal } = require('sweetalert2');
const knex = Knex(knexConfig.development);
Model.knex(knex);

// Used for creating tags from thumbnails
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
require('@tensorflow/tfjs-node');
const PNG = require('png-js');

const multer = require('multer');

// Use multer to save videos to disk
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'videos');
	},
	filename: (req, file, cb) => {
		const filename = crypto.randomBytes(20).toString('hex');
		const mimeTypeArray = file.mimetype.split('/');
		if (mimeTypeArray[0] === 'video') {
			const extension = mimeTypeArray[mimeTypeArray.length - 1];
			cb(null, filename + '.' + extension);
		}
		else {
			cb('Not a video, Mimetype: ', file.mimetype);
		}
	},
});
const upload = multer({ storage: storage });

const videosPerPage = 10;

// Return all the videos as a list
router.get('/videos', (req, res) => {
	// Query the video objects and fill them with the relevant tags and comments
	Video.query().eager('[tags, comments]').then(videos => {
        return res.send({response: videos});
    })
});

// Return the specific video
router.get('/videos/:videoId', async (req, res) => {
	let video
	await Video.query()
		.then(videos => {
			video = videos.find(video => video.filename === req.params.videoId);
			video['views'] += 1;
		})
	await Video.query().patchAndFetchById(video['id'], { views: video['views']})
		.eager('[tags, comments]')
		.then(video => {
			return res.send({response: video})
		})
});

// Create video
router.post('/videos', upload.single('video'), async (req, res) => {
	// req.file is the `avatar` file
	// req.body will hold the text fields, if there were any
	const title = req.body.title ? req.body.title : '';
	const description = req.body.description;
	const fileName = req.file.filename;
	const category = req.body.category;
	// Split the tags with whitespace or commas
	const tags = req.body.tags.split(/\s*[,\s]\s*/);

	// Check if user is logged in
	const userid = req.session.userid;
	console.log("USERID:", userid);
	const validatedUser = await validateUser(req).then( message => {
		if (message == false) {
			return res.redirect('/login?error=notloggedinupload')
		}
		else {
			// Server side validation
			const errors = validateUserUpload(title, description, category);
			if (errors.length > 0) {
				return res.send({ response: errors });
			}
			else {
				let generated_tags = [];
				const middleOfFilm = req.file.size / 100 / 60 / 60;
				console.log(req.file);
				
				// Create thumbnail
				console.log("Starting to make thumbnail")
				console.log("Dir:", __dirname + '/thumbnails')

				ffmpeg(req.file.path)
				.screenshots({
					timestamps: ['50%'],
					filename: fileName + '.png',
					folder: path.join(process.cwd() + '/public/images/thumbnails'),
					size: '640x480'
				}).on('end', () => {
					console.log('done with thumbnail');

					// Create tags via Tensorflow mobilenet image recognition
					const generated_tags = generateTags(fileName);
				});

				// Insert into DB
				Video.query().insert({
					title: title,
					description: description,
					filename: fileName,
					thumbnail: fileName + '.png',
					category: category,
					tags: generated_tags,
					views: 0,
					userId: userid
				}).then( video => {
					return res.redirect(`/player/${video.filename}`);
				})
			}
				}
			});
});

// Adding comments to videos
router.post('/comment', async (req, res) => {
	const validatedUser = await validateUser(req).then( validated => {

		if (validated == false) {
			return res.redirect('/login?error=notloggedincomment');
			
		}
		else {
			Video.query()
				.then(videos => {
					let video = videos.find(video => video.filename === req.body.hiddenVideoId);
					Comment.query().insert({
						videoId: video.id,
						userId: req.session.userid,
						userName: req.session.username,
						comment: req.body.addcomment
					}).then(() => {
						res.redirect(`/player/${video.filename}`)
					})
				})
		}
	})
});

async function validateUser(req) {
	// Check if session is present:
	console.log("REQ.SESSION:", req.session)
	if (req.session.authenticated == true) {
		// Check if userid and UUID is in the DB
		console.log("AUTHENTICATED IS EQUAL TO TRUE")
		const userFound = await User.query().select().where({'uuid': req.session.uuid}).limit(1)
			.then( user => {
				console.log("QUERY DB DONE")
				if (user.length > 0) {
					return true
				}
			});
	}
	else {
		return false
	}
	
}

function validateUserUpload(title, description, category) {

	let errors = [];

	// Validate title length
	if (title == undefined || title.length < 8 || title.length > 64) {
		errors.push('Title is not between 8 and 64 characters long.');
		return false;
	}

	// Validate description
	if (description.length > 2048) {
		errors.push('Title has to be less than 2048.');
		return false;
	}

	// Validate that category is chosen
	if (!acceptedCategories.includes(category)) {
		errors.push('Providede category is not supported.');
		return false;
	}

	return errors;
}

// Helper function for generating tags with tensorflow
async function generateTags(fileName) {
	let results = [];
	// Create tags via Tensorflow mobilenet image recognition
	const pathToImg = path.join(process.cwd() + '/public/images/thumbnails/' + fileName + '.png');
	const readImage = path => {
		const imageBuffer = fs.readFileSync(path);
		const tfimage = tf.node.decodeImage(imageBuffer);
		return tfimage;
	};
	const imageClassification = async path => {
		const image = readImage(path);
		const mobilenetModel = await mobilenet.load();
		const predictions = await mobilenetModel.classify(image);
		console.log('Classification Results:', predictions);
		/*
		// Get the newly added video and add the generated tags to it
		let video = videos.find(video => video.fileName === fileName);
		predictions.forEach(prediction => {
			video['tags'].push(prediction.className);
		});
		*/
		// Get the id of the video
		Video.query()
		.then(videos => {
			let video = videos.find(video => video.filename === fileName);
			console.log("Found video:", video);
			// Add the tags to the tags table with the povided videoID
			predictions.forEach(prediction => {
				Tag.query().insert({
					videoId: video.id,
					tag: prediction.className
				}).then(tag => {
					console.log("Prediction added:", prediction);
				});
			})
		})
	};
	imageClassification(pathToImg);
}


// Array of categories that we accept
const acceptedCategories = [
	'autosvehicles',
	'comedy',
	'education',
	'entertainment',
	'filmanimation',
	'gaming',
	'howtostyle',
	'music',
	'nature',
	'newspolitics',
	'nonprofitactivism',
	'peopleblogs',
	'sciencetechnology',
	'sports',
];

// Export the route
module.exports = router;
