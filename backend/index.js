const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var socket_by_token = {};
var token_by_socket = {};

app.get('/', function(_, res){
    res.sendFile(__dirname + '/pages/index.html');
});

app.use('/static', express.static(__dirname + '/static'));

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('meta', (msg) => {
        msg = JSON.parse(msg);
        if (msg.hasOwnProperty('join')) {
            token_by_socket[socket.id] = msg.join;
            if (!socket_by_token.hasOwnProperty(msg.join))
                socket_by_token[msg.join] = []
            socket_by_token[msg.join].push(socket);
            console.log("user joined", msg.join);
        }
    });

    socket.on('data', (msg) => {
        console.log("Data: " + msg);
        for (let sok of socket_by_token[token_by_socket[socket.id]])
        {
            if (sok === socket) continue;
            sok.emit('data', msg);
        }
    });

    socket.on('disconnect', () => {
        console.log('token_by_socket: ' + token_by_socket[socket.id]);
        if (socket_by_token.hasOwnProperty(token_by_socket[socket.id])
            && socket_by_token[token_by_socket[socket.id]].length == 1) {
            delete socket_by_token[token_by_socket[socket.id]];
        }
        delete token_by_socket[socket.id];
        console.log("a user disconnected :(");
    });

    socket.on('custom_ping', (msg) => {
        console.log('ping:', msg);
        socket.emit('pong', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
