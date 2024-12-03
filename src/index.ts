import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket: WebSocket) => {
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string);
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
          .forEach((user) =>
            user.socket.send(
              JSON.stringify({
                type: "chat",
                payload: { message: messageToSend, room: userRoom },
              })
            )
          );
        console.log(`message sent to room ${userRoom}: ${messageToSend}`);
      }
    }
  });
});
