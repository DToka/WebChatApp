require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors= require('cors');

const port = process.env.PORT || 3000
let connectedUsers = new Map();

io.on('connection', function (socket) {
    const {id} = socket.client;
    console.log(`User connected:${id}`)
    //Add user when user connects
    //msg is the username the user selected
    socket.on('userConnection', function (msg) {
        connectedUsers.set(id, msg);
        io.emit('addUser', msg);
        console.log(`${msg} user logged on`);

    })
    //Remove user when user disconnects
    socket.on('disconnect', function () {
        console.log(`${id} -- ${connectedUsers.get(id)} has disconnected`);
        io.emit('removeUser', connectedUsers.get(id));
        connectedUsers.delete(id);
    });
    //Update the list of all users when someone connects
    socket.on('getAllUsers', function () {
        let userList = Array.from(connectedUsers.values());
        //console.log(userList);
        socket.emit('allUsers', userList);
    })
    //Forward the chat message from the user to everyone connected to the chatroom
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        console.log(msg);
    });
    
});

//Serve React Frontend to user on /
app.use(express.static('build'));
app.use(cors());

http.listen(port, function () {
    console.log(`listening on *:${port}`);
});