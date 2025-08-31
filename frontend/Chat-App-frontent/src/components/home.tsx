import { useState } from "react";
import { useNavigate } from "react-router";

function HomePage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("")
    const [roomId, setRoomId] = useState("")
    const [name, setName] = useState("")


    function navigateToChat(){
        navigate('/chat',{state:{roomId,name,mode}})
    }

    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white px-4 text-center">

            {/* Heading */}
            <h1 className="text-8xl font-extrabold font-merriweather">
                ChatZone
            </h1>

            {/* Description */}
            <p className="mt-6 text-gray-400 font-jetbrains text-xl ">
                A fast and minimal chat experience — create a room or join one instantly
            </p>
            {mode === "" && (
                < div className="mt-12 flex gap-6">
                    <button onClick={() => setMode("create")} className="px-8 py-4 bg-indigo-600 rounded-xl font-jetbrains text-lg shadow-lg hover:bg-indigo-500 transition duration-300">
                        Create Room
                    </button>
                    <button onClick={() => setMode("join")} className="px-8 py-4 bg-indigo-600 rounded-xl font-jetbrains text-lg shadow-lg hover:bg-indigo-500 transition duration-300">
                        Join Room
                    </button>
                </div>
            )}

            {mode === "create" && (
                <div className="flex flex-col gap-4 items-center justify-center bg-black text-white mt-8">

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
                        onClick={navigateToChat}
                        className="px-6 py-3 bg-blue-900 rounded-lg hover:bg-blue-800 transition border-1"
                    >
                        Create
                    </button>
                </div>
            )}

            {mode === "join" && (
                <div className="flex flex-col gap-4 items-center justify-center mt-8 bg-black text-white">

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
                        onClick={navigateToChat}
                        className="px-6 py-3 bg-blue-900 rounded-lg hover:bg-blue-800 transition"
                    >
                        Join
                    </button>
                </div>
            )}


        </div >
    )
}

export default HomePage;
