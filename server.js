const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

let numUsers = 0;

const app = express();

app.get('/', (req, res) => {
    res.sendFile('chat.html', { root: __dirname });
});

const httpServer = http.createServer(app).listen(3000);

const io = socketIO(httpServer);

io.on('connection', (socket) => { 
    numUsers ++;
    updateCount();
    console.log('Client Connected');
    
    socket.emit("Welcome", "Welcome from the server!");
    io.emit('notification', "User joined chat");
    
    socket.on('message', message => {
        console.log(message)
        io.emit('message',message)
    })
    
    socket.on('disconnect', () => {
        numUsers --;
        updateCount();
        console.log('Client Disconnected');
        io.emit('notification', "User left chat");
    })
})

setInterval(() => io.emit('time', new Date().toTimeString()), 1000); //update current server time

const updateCount = () =>{ // sends number of users to the client
    io.emit('users', {
        count: numUsers
    })
}