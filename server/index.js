const express = require('express');
const app = express();
const http = require('node:http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(process.cwd()+'/cliente/index.html')
});

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado.')
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    })
});

server.listen(3000, () => {
    console.log('Escuchando en el puerto 3000')
});