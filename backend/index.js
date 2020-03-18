const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var socket_by_token = {};
var token_by_socket = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/pages/index.html');
});

app.use('/static', express.static(__dirname + '/static'));

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('meta', (msg) => {
        msg = JSON.parse(msg);
        if (msg.hasOwnProperty('join')) {
            token_by_socket[socket] = msg.join;
            if (!socket_by_token.hasOwnProperty(msg.join))
                socket_by_token[msg.join] = []
            socket_by_token[msg.join].push(socket);
            console.log("user joined", msg.join);
        }

        console.log(token_by_socket);
        console.log(socket_by_token);
    });

    socket.on('data', (msg) => {
        console.log("Data: " + msg);
        for (let sok of socket_by_token[token_by_socket[socket]])
        {
            if (sok === socket) continue;
            sok.emit('data', msg);
        }
    });

    socket.on('disconnect', () => {
        if (socket_by_token[token_by_socket[socket]].length == 1)
            delete socket_by_token[token_by_socket[socket]];
        delete token_by_socket[socket];
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
