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



// wss.on("connection", (socket) => {
//     socket.on("message", (message) => {
//         const parsedMessage = JSON.parse(message as unknown as string);
//         if (parsedMessage.type == 'createRoom') {
//             rooms.set(parsedMessage.payload.roomId, {
//                 id: parsedMessage.payload.roomId,
//                 members: new Set([parsedMessage.payload.name])
//             })

//             users.set()
//         }

//         if (parsedMessage.type == 'joinRoom') {
            
//         }

//         if (parsedMessage.type == "chat") {
//             const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room

//             if (!currentUserRoom) return;

//             allSockets.filter((user) => user.room === currentUserRoom).forEach((user) => {
//                 user.socket.send(parsedMessage.payload.message);
//             });
//         }
//     })
// })