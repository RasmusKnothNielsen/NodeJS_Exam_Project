// Accessing the Router from the express library
const router = require('express').Router();

const crypto = require('crypto');

const fs = require('fs');

const path = require('path');

// Used for creating tags from thumbnails
const ffmpeg = require('fluent-ffmpeg');
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
require('@tensorflow/tfjs-node');
const PNG = require('png-js');

const multer = require('multer');

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

// Video schema
const rawData = fs.readFileSync('./data.json', 'utf-8');
let videos = JSON.parse(rawData);
console.log(videos);


const videosPerPage = 10;

// Return all the videos as a list
router.get('/videos', (req, res) => {
	const page = Number(req.query.page) ? Number(req.query.page) : 1;
	const start = (page - 1) * videosPerPage;
	const end = start + videosPerPage;
	// Number of videos per page and current page number?

	// return res.send({ response: videos.slice(start, end) });
	return res.send({ response: videos });
});

// Return the specific video
router.get('/videos/:videoId', (req, res) => {
	let video = videos.find(video => video.fileName === req.params.videoId);
	video['views'] += 1;
	// Save the new view to "database"
	fs.writeFileSync('./data.json', JSON.stringify(videos), 'utf-8');

	return res.send({ response: videos.find(video => video.fileName === req.params.videoId) });
});

// Create video
router.post('/videos', upload.single('video'), (req, res) => {
	// req.file is the `avatar` file
	// req.body will hold the text fields, if there were any
	const title = req.body.title ? req.body.title : '';
	const description = req.body.description;
	const fileName = req.file.filename;
	const category = req.body.category;
	// Split the tags with whitespace or commas
	const tags = req.body.tags.split(/\s*[,\s]\s*/);
	// Get current date
	const d = new Date();
	const currentDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());

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
		ffmpeg(req.file.path).screenshots({
			timestamps: [middleOfFilm],
			filename: fileName + '.png',
			folder: path.join(__dirname + '/../' + 'public/images/thumbnails'),
			size: '640x480',
			autopad: 'black',
		}).on('end', function() {
			console.log('done');

			// Create tags via Tensorflow mobilenet image recognition
			const generated_tags = generateTags(fileName);
		});

		// Push the new video to the front of the videos array
		videos.unshift({
			title: title,
			description: description,
			fileName: fileName,
			thumbnail: fileName + '.png',
			category: category,
			tags: generated_tags,
			uploadDate: currentDate,
			views: 0,
			comments: [],
		});

		fs.writeFileSync('./data.json', JSON.stringify(videos), 'utf-8');

		console.log(videos);
		return res.redirect(`/player/${fileName}`);
	}

});

// Adding comments to videos
router.post('/comment', (req, res) => {

	let video = videos.find(video => video.fileName === req.body.hiddenVideoId);
	const length = video['comments'].length;
	video.comments.push(
		{
			id: length,
			comment: req.body.addcomment,
			time: new Date(),
		});

	// Save the new comment
	fs.writeFileSync('./data.json', JSON.stringify(videos), 'utf-8');

	return res.redirect(`/player/${req.body.hiddenVideoId}`);
});

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
	const pathToImg = path.join(__dirname + '/../' + 'public/images/thumbnails/' + fileName + '.png');
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
		// Get the newly added video and add the generated tags to it
		let video = videos.find(video => video.fileName === fileName);
		predictions.forEach(prediction => {
			video['tags'].push(prediction.className);
		});
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
