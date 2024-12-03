"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }
        if (parsedMessage.type === "chat") {
            const currentUser = allSockets.find((user) => user.socket === socket);
            if (currentUser) {
                const userRoom = currentUser.room;
                const messageToSend = parsedMessage.payload.message;
                allSockets
                    .filter((user) => user.room === userRoom)
                    .forEach((user) => user.socket.send(JSON.stringify({
                    type: "chat",
                    payload: { message: messageToSend, room: userRoom },
                })));
                console.log(`message sent to room ${userRoom}: ${messageToSend}`);
            }
        }
    });
});
