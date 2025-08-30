import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets:User[] = [];

// [
//     {'socket':socket1,'room':'red' },
//     {'socket':socket2,'room':'blue' },
//     {'socket':socket3,'room':'red' }
// ]

wss.on("connection",(socket)=>{
    socket.on("message",(message)=>{
        const parsedMessage = JSON.parse(message  as unknown as string);
        if(parsedMessage.type == 'join'){
            allSockets.push({
                socket,
                room:parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type == "chat"){
            const currentUserRoom = allSockets.find((x)=>x.socket == socket)?.room

            if (!currentUserRoom) return;

            allSockets.filter((user) => user.room === currentUserRoom).forEach((user) => {
                    user.socket.send(parsedMessage.payload.message);
            });
        }
    })
})