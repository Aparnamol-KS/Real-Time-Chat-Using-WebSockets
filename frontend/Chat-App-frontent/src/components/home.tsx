import { useState } from "react";
import { useNavigate } from "react-router";

function HomePage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("");
    const [roomId, setRoomId] = useState("");
    const [name, setName] = useState("");

    function navigateToChat() {
        if (!roomId.trim() || !name.trim()) {
            alert("Room ID and Name are required!");
            return;
        }
        navigate("/chat", { state: { roomId, name, mode } });
    }


    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white px-4 text-center">

            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold font-merriweather">
                ChatZone
            </h1>

            
            <p className="mt-6 text-gray-400 font-jetbrains text-base sm:text-lg md:text-xl max-w-lg sm:max-w-xl">
                A fast and minimal chat experience — create a room or join one instantly
            </p>

            
            {mode === "" && (
                <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-xs sm:max-w-md justify-center">
                    <button
                        onClick={() => setMode("create")}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 rounded-xl font-jetbrains text-base sm:text-lg shadow-lg hover:bg-indigo-500 transition duration-300"
                    >
                        Create Room
                    </button>
                    <button
                        onClick={() => setMode("join")}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 rounded-xl font-jetbrains text-base sm:text-lg shadow-lg hover:bg-indigo-500 transition duration-300"
                    >
                        Join Room
                    </button>
                </div>
            )}

            {/* Create Mode */}
            {mode === "create" && (
                <div className="flex flex-col gap-4 items-center justify-center bg-black text-white mt-8 w-full max-w-xs sm:max-w-sm">
                    <input
                        type="text"
                        placeholder="Enter the room ID..."
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="w-full px-4 py-2 rounded-md text-black text-sm sm:text-base"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Enter your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-md text-black text-sm sm:text-base"
                        required
                    />
                    <button
                        onClick={navigateToChat}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-900 rounded-lg hover:bg-blue-800 transition text-sm sm:text-base"
                    >
                        Create
                    </button>
                </div>
            )}

            
            {mode === "join" && (
                <div className="flex flex-col gap-4 items-center justify-center mt-8 bg-black text-white w-full max-w-xs sm:max-w-sm">
                    <input
                        type="text"
                        placeholder="Enter the room ID..."
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="w-full px-4 py-2 rounded-md text-black text-sm sm:text-base"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Enter your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-md text-black text-sm sm:text-base"
                        required
                    />
                    <button
                        onClick={navigateToChat}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-900 rounded-lg hover:bg-blue-800 transition text-sm sm:text-base"
                    >
                        Join
                    </button>
                </div>
            )}
        </div>
    );
}

export default HomePage;
