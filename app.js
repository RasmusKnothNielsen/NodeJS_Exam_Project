const express = require('express');
const app = express();

// Import the fs to be able to interact with the filesystem
const fs = require('fs');

// Enable express to parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make NodeJS able to serve the files from /public and /videos.
app.use(express.static('public'));
app.use(express.static('videos'));

// If undefined, start on 8686, else start on the provided portnumber
const port = process.env.PORT ? process.env.PORT : 8686;

// Load the navbar, footer and frontpage
// Using readFileSync, blocks the app from going on, before the file is read
const navbarPage = fs.readFileSync(__dirname + '/public/navbar/navbar.html', 'utf-8');
const footerPage = fs.readFileSync(__dirname + '/public/footer/footer.html', 'utf-8');

const frontpagePage = fs.readFileSync(__dirname + '/public/frontpage/frontpage.html', 'utf-8');
const playerPage = fs.readFileSync(__dirname + '/public/player/player.html', 'utf-8');
const uploadPage = fs.readFileSync(__dirname + '/public/upload/upload.html', 'utf-8');


// Get Request for front page
app.get('/', (req, res) => {
	return res.send(navbarPage + frontpagePage + footerPage);
});

// Get Request for the player page
app.get('/player/:videoid', (req, res) => {
	return res.send(navbarPage + playerPage + footerPage);
});

// Upload videos
app.get('/upload', (req, res) => {
	return res.send(navbarPage + uploadPage + footerPage);
});

app.get('/login', (req, res) => {
    return res.send(renderPage('/public/auth/login.html'));
})

app.get('/signup', (req, res) => {
    return res.send(renderPage('/public/auth/signup.html'));
})

// Page to initiate password reset process
app.get('/resetpassword', (req, res) => {
    return res.send(renderPage('/public/auth/sendresetmail.html'));
})

// landing page for resetting password after getting the email with the token in it
app.get('/passwordreset', (req, res) => {
    return res.send((renderPage('/public/resetpassword.html')));
})

// How to import routes and use them from another file
// Import routes
const videosRoute = require('./routes/videos');
const authRoute = require('./routes/auth');
// Setup routes
app.use(videosRoute);
app.use(authRoute);

// Helperfunction to render the page using SSR (Server Side Rendering)
function renderPage(path) {
    let page = fs.readFileSync(__dirname + path, 'utf-8');
    let result = navbarPage + page + footerPage;
    return result;
}

/* Start server */
app.listen(port, error => {
	if (error) {
		console.log(error.log);
	}
	console.log('The server has started on port', port);
},
);

