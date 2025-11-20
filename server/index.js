const express = require('express');
const app = express();
const http = require('node:http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/cliente/index.html')
});

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({ userID: id });
    }
    io.emit("users", users);

    socket.on('private message', ({ content, to }) => {
        socket.to(to).emit('private message', {
            content,
            from: socket.id
        });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
        const remainingUsers = [];
        for (let [id, socket] of io.of("/").sockets) {
            remainingUsers.push({ userID: id });
        }
        io.emit("users", remainingUsers);
    });
});

server.listen(3000, () => {
    console.log('Escuchando en el puerto 3000')
});