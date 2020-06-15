/* SOCKET IO */
// Requiring SocketIO
const socketio = require('socket.io')
// Prevent XSS (Cross Site Scripting)
const escape = require('escape-html');

module.exports.listen = app => {

    io = socketio.listen(app);
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
            //socket.emit('Someone joined', 'You just joined the chat!');
            io.sockets.in(room).emit('Someone joined', `${username} just joined the chat!`);
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
    
    return io;
}
