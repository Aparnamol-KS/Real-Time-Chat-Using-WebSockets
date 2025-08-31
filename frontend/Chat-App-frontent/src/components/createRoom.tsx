import { useState } from "react";
import { useNavigate } from "react-router";

function CreateRoom() {
    const [roomId, setRoomId] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    function createRoom() {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: "createRoom",
                    payload: {
                        roomId,
                        name,
                        userId: crypto.randomUUID()
                    },
                })
            );
            navigate("/chat", { state: { roomId, name } });
        };

        ws.onmessage = (event) => {
            console.log("Server:", JSON.parse(event.data));
        };
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen bg-black text-white">
            <h1 className="text-6xl font-extrabold font-merriweather mb-10">
                Create Room
            </h1>
            <input
                type="text"
                placeholder="Enter the roomID.."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="px-4 py-2 rounded text-black"
            />
            <input
                type="text"
                placeholder="Enter your name.."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 rounded text-black"
            />
            <button
                onClick={createRoom}
                className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
            >
                Create
            </button>
        </div>
    );
}

export default CreateRoom;
