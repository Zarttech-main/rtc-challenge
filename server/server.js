const express = require("express");
const http = require("http");
const app = express();

const server = http.createServer(app); 
const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
});
  
//chats or conversations
const chats = {};

io.on("connection", socket => {
    // new join notice
    socket.on("join room", chatID => { 
        if (chats[chatID]) {
            chats[chatID].push(socket.id);
        } else {
            chats[chatID] = [socket.id];
        }
        const otherUser = chats[chatID].find(id => id !== socket.id);
        if (otherUser) {
            // let users know if anyone joins and send offer from client side 
            socket.emit("other user", otherUser);  
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    // receives offer and send offer to pair
    socket.on("offer", payload => { 
        io.to(payload.target).emit("offer", payload);
    });
    // receives answer and send answer to pair
    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    //list to ice candate exchange between pairs
    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });
});


server.listen(8000, () => console.log('server is running on port 8000'));


