var socket = io();

var ping = 0;

function getTime() {
    if (ping > 0) return;
    ping = Date.now().toString();
    socket.emit("custom_ping", ping);
    console.log('ping start:', ping);
}

var joined = false;
function joinRoom()
{
    if (joined) return;
    let token = document.getElementById('token').value;
    console.log("joining room " + token);
    socket.emit("meta", JSON.stringify({join: token}));
    joined = true;
}
joinRoom();

function sendData() {
    joinRoom();
    let data = document.getElementById('input').value;

    console.log(data.length + ":user input: " + data);

    if (data.length > 0) socket.emit("data", data);
    else getTime();
}

socket.on('pong', (msg) => {
    let time = Date.now() - ping;
    ping = 0;
    document.getElementById('time_disp').innerHTML = "Ping: " + time.toString();
});

socket.on('data', (msg) => {
    console.log(msg);
});

console.log("sockets initialized!");
