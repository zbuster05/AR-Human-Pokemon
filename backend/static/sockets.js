var socket = io();

function getTime() {
    socket.emit("sync", "string");
}

socket.on('sync', (msg) => {
    document.getElementById('time_disp').innerHTML = msg;
})

console.log("sockets initialized!");
