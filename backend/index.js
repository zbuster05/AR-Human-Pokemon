const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/pages/index.html');
});

app.use('/static', express.static(__dirname + '/static'));

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log("a user disconnected :(");
    });
    socket.on('sync', (msg) => {
        console.log('data! ', msg);
        socket.emit('sync', Date().toString());
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
