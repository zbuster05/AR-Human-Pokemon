var socket = io();

var ping = 0;

function getTime() {
    if (ping > 0) return;
    ping = Date.now().toString();
    socket.emit("custom_ping", ping);
    console.log('ping start:', ping);
}

socket.on('pong', (msg) => {
    if (parseInt(msg, 10) != ping) getTime();
    let time = Date.now() - ping;
    console.log(msg, time);
    ping = 0;
    document.getElementById('time_disp').innerHTML = time.toString();
})

console.log("sockets initialized!");
