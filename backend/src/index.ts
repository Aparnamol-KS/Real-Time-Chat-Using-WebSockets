
import http, { IncomingMessage, ServerResponse } from "http";

import { WebSocketServer, WebSocket } from "ws";

const PORT = process.env.PORT || 8080;

// Create a simple HTTP server (Render needs something to ping)
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running\n");
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

interface User {
  id: string;
  socket: WebSocket;
  roomId?: string;
  name?: string;
}

interface Room {
  id: string;
  members: Set<string>;
}

const users: Map<string, User> = new Map();
const rooms: Map<string, Room> = new Map();

wss.on("connection", (socket: WebSocket) => {
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "createRoom") {
      if (!rooms.has(parsedMessage.payload.roomId)) {
        rooms.set(parsedMessage.payload.roomId, {
          id: parsedMessage.payload.roomId,
          members: new Set([parsedMessage.payload.userId]),
        });
      }

      users.set(parsedMessage.payload.userId, {
        id: parsedMessage.payload.userId,
        socket: socket,
        roomId: parsedMessage.payload.roomId,
        name: parsedMessage.payload.name,
      });

      socket.send(
        JSON.stringify({
          type: "system",
          payload: { message: `Room ${parsedMessage.payload.roomId} created and joined` },
        })
      );
    }

    if (parsedMessage.type === "joinRoom") {
      const room = rooms.get(parsedMessage.payload.roomId);

      if (!room) {
        socket.send(
          JSON.stringify({
            type: "error",
            payload: { message: "Room not found" },
          })
        );
        return;
      }

      room.members.add(parsedMessage.payload.userId);

      users.set(parsedMessage.payload.userId, {
        id: parsedMessage.payload.userId,
        socket: socket,
        roomId: parsedMessage.payload.roomId,
        name: parsedMessage.payload.name,
      });

      socket.send(
        JSON.stringify({
          type: "system",
          payload: { message: `You joined room ${parsedMessage.payload.roomId}` },
        })
      );
    }

    if (parsedMessage.type === "chat") {
      const sender = users.get(parsedMessage.payload.userId);
      if (!sender) return;

      const room = rooms.get(parsedMessage.payload.roomId);
      if (!room || !room.members.has(parsedMessage.payload.userId)) return;

      room.members.forEach((memberId) => {
        const member = users.get(memberId);
        if (member) {
          member.socket.send(
            JSON.stringify({
              type: "chat",
              payload: {
                roomId: parsedMessage.payload.roomId,
                userId: parsedMessage.payload.userId,
                name: sender.name,
                message: parsedMessage.payload.message,
              },
            })
          );
        }
      });
    }
  });
});

// Start HTTP + WebSocket server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
