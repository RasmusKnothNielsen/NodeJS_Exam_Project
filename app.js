// Requiring libraries for server
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

// Requiring sockets
var io = require('./sockets').listen(server)

// Import the fs to be able to interact with the filesystem
const fs = require('fs');

// Enable express to parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make NodeJS able to serve the files from /public and /videos.
app.use(express.static('public'));
app.use(express.static('videos'));

// Rate limiting users
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8 // limit each IP to 100 requests per windowMs
  });
  app.use('/login', limiter);
  app.use('/signup', limiter);

// Configure session
app.use(session({
    genid: (req) => {   // Generate an ID for our session, that has to be unique
        // This will only be run, if the client does not have provided a sessionID already
        // OR if the client sends a sessionID that the server does not recognize. Can happen if the server restarts/crashes.
        console.log('Inside the session middleware')
        console.log(req.sessionID);
        return uuidv4();
    },
    secret: require('./config/mysqlCredentials').sessionSecret,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
  }));

// How to import routes and use them from another file
// Import routes
const videosRoute = require('./routes/videos');
const authRoute = require('./routes/auth');
const { ConstraintViolationError } = require('objection');
// Setup routes
app.use(videosRoute);
app.use(authRoute);

// If undefined, start on 8686, else start on the provided portnumber
const PORT = process.env.PORT ? process.env.PORT : 8686;

// Load the navbar and footer
// Using readFileSync, blocks the app from going on, before the file is read
const navbarPage = fs.readFileSync(__dirname + '/public/navbar/navbar.html', 'utf-8');
const navbarPageLoggedIn = fs.readFileSync(__dirname + '/public/navbar/navbaruser.html', 'utf-8');
const footerPage = fs.readFileSync(__dirname + '/public/footer/footer.html', 'utf-8');

// Get Request for front page
app.get('/', (req, res) => {
	return res.send(renderPage('/public/frontpage/frontpage.html', req));
});

// Get Request for the player page
app.get('/player/:videoid', (req, res) => {
	return res.send(renderPage('/public/player/player.html', req));
});

// Upload page
app.get('/upload', (req, res) => {
    if (req.session.authenticated == true) {
         return res.send(renderPage('/public/upload/upload.html', req));
    }
    else {
        return res.redirect('/login?error=notloggedinupload');
    }
});

// Login page
app.get('/login', (req, res) => {
    return res.send(renderPage('/public/auth/login.html', req));
})

// Signup page
app.get('/signup', (req, res) => {
    return res.send(renderPage('/public/auth/signup.html', req));
})

// Page to initiate password reset process
app.get('/resetpassword', (req, res) => {
    return res.send(renderPage('/public/auth/sendresetmail.html', req));
})

// landing page for resetting password after getting the email with the token in it
app.get('/passwordreset', (req, res) => {
    return res.send((renderPage('/public/resetpassword.html', req)));
})

// Helperfunction to render the page using SSR (Server Side Rendering)
function renderPage(path, req) {
    let page = fs.readFileSync(__dirname + path, 'utf-8');
    let result;
    if (req.session.authenticated) {
        result = navbarPageLoggedIn + page + footerPage;
    }
    else {
        result = navbarPage + page + footerPage;
    }
    return result;
}

/* Start server */
server.listen(PORT, error => {
	if (error) {
		console.log(error.log);
	}
	console.log('The server has started on port', PORT);
});




