import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

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

// let allSockets: User[] = [];

// users = {
//   "u1" → { id: "u1", socket: socket1, roomId: "red", name: "Alice" },
//   "u2" → { id: "u2", socket: socket2, roomId: "blue", name: "Bob" },
//   "u3" → { id: "u3", socket: socket3, roomId: "red", name: "Charlie" }
// }

// rooms = {
//   "red" → { id: "red", members: Set(["u1", "u3"]) },
//   "blue" → { id: "blue", members: Set(["u2"]) }
// }



wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);
        if (parsedMessage.type == 'createRoom') {

            if (!rooms.has(parsedMessage.payload.roomId)) {
                rooms.set(parsedMessage.payload.roomId, {
                    id: parsedMessage.payload.roomId,
                    members: new Set([parsedMessage.payload.userId])
                })
            }



            users.set(parsedMessage.payload.userId, {
                id: parsedMessage.payload.userId,
                socket: socket,
                roomId: parsedMessage.payload.roomId,
                name: parsedMessage.payload.name
            })
        }

        if (parsedMessage.type == 'joinRoom') {

            const room = rooms.get(parsedMessage.payload.roomId);
            // Invalid room
            if (!room) return;

            room.members.add(parsedMessage.payload.userId)

            users.set(parsedMessage.payload.userId, {
                id: parsedMessage.payload.userId,
                socket: socket,
                roomId: parsedMessage.payload.roomId,
                name: parsedMessage.payload.name
            })

            socket.send(JSON.stringify({
                type: "system",
                payload: { message: "You joined room 123" }
            }));

        }

        if (parsedMessage.type == "chat") {

            const sender = users.get(parsedMessage.payload.userId);
            if (!sender) {
                return
            }

            const room = rooms.get(parsedMessage.payload.roomId)
            if (!room || !room.members.has(parsedMessage.payload.userId)) {
                return
            }

            room.members.forEach((memberId) => {
                const member = users.get(memberId)
                if (member) {
                    member.socket.send(JSON.stringify({
                        type: "chat",
                        payload: {
                            roomId: parsedMessage.payload.roomId,
                            userId: parsedMessage.payload.userId,
                            name: sender?.name,
                            message: parsedMessage.payload.message
                        }
                    }));
                }
            })
        }
    })
})