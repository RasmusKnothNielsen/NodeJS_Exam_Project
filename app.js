const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

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

/* SOCKETS IO */
/* SOCKET IO */
// Requiring SocketIO
const io = require('socket.io').listen(server);
// Prevent XSS (Cross Site Scripting)
const escape = require('escape-html');


// Handle incomming connections from clients
io.sockets.on('connection', (socket) => {
    // When a client has connected, we expect to hear what room they are joining
    socket.on('room', (room) => {
        socket.join(room);
        console.log('Room joined:', room);
    })

    // User loads a specific page and thus joining it's live chat
    socket.on('join room', (room, username) => {
        socket.join(room);
        console.log('Room wants to be join:', room);
        console.log('By socket:', socket.id)
        socket.emit('Someone joined', 'You just joined the chat!');
        socket.broadcast.emit('Someone joined', `${username} just joined the chat!`);
        //io.sockets.in(room).emit('Someone joined', `${username} just joined the chat!`);
    })

    // Handling messages to everyone in the same room
    socket.on('Send message', ({ thoughts, room, username }) => {
        // Sends out to all the clients
        const today = new Date()
        time = today.getHours() + ':' + today.getMinutes();
        // Prevent XSS (Cross Site Scripting)
        io.sockets.in(room).emit('Someone said', time, { thoughts: escape(thoughts)}, username);
    });

    // Sending out name changes to al in channel
    socket.on('Name change', ({ room, username, newUsername }) => {
        io.sockets.in(room).emit('Someone changed name', `${username} changed username to ${newUsername}`);
    });

    // Sends a disconnect message to the rest of the room and leaves it
    socket.on('disconnecting', (data) => {
        io.sockets.in(data.room).emit('Someone left', `${data.username} left the chat`);
        socket.leave(data.room)
    });
});

/*
// Creating listener for SocketIO
io.on("connection", (socket) => {
    console.log("Socket joined", socket.id);


    socket.on("I'm thinking about this", ({ thoughts }) => {
        // Sends out to all the clients
        const today = new Date()
        thoughts = today.getHours() + ":" + today.getMinutes() + " - " + thoughts

        // Prevent XSS (Cross Site Scripting)
        io.emit("Someone said", { thoughts: escape(thoughts) });

        // Sends back to the specific socket
        //socket.emit("Someone said", { thoughts });

        // Sends to all clients, except the client that sends it
        //socket.broadcast.emit("Someone said", { thoughts });


    });


    socket.on('disconnect', () => {
        console.log("Socket left", socket.id)
    });
});
*/

// If undefined, start on 8686, else start on the provided portnumber
const port = process.env.PORT ? process.env.PORT : 8686;

// Load the navbar, footer and frontpage
// Using readFileSync, blocks the app from going on, before the file is read
const navbarPage = fs.readFileSync(__dirname + '/public/navbar/navbar.html', 'utf-8');
const footerPage = fs.readFileSync(__dirname + '/public/footer/footer.html', 'utf-8');

const frontpagePage = fs.readFileSync(__dirname + '/public/frontpage/frontpage.html', 'utf-8');
const playerPage = fs.readFileSync(__dirname + '/public/player/player2.html', 'utf-8');
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
const { ConstraintViolationError } = require('objection');
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

server.listen(port, error => {
	if (error) {
		console.log(error.log);
	}
	console.log('The server has started on port', port);
});




