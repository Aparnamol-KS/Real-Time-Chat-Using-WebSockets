import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

function ChatInterface() {
    const navigate = useNavigate();
    interface ChatMessages {
        userId: string,
        name: string,
        message: string
    }
    const location = useLocation();
    const { roomId, name, mode } = location.state || {};
    const [isJoined, setIsJoined] = useState(false);


    const [messages, setMessages] = useState<ChatMessages[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const inpRef = useRef<HTMLInputElement | null>(null);

 
    const userIdRef = useRef<string>(crypto.randomUUID());
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    useEffect(() => {
        const ws = new WebSocket('wss://real-time-chat-using-websockets.onrender.com');

        wsRef.current = ws;

        ws.onopen = () => {
            if (mode === "create") {
                ws.send(JSON.stringify({
                    type: "createRoom",
                    payload: {
                        roomId,
                        name,
                        userId: userIdRef.current
                    }
                }));
            }

            if (mode === "join") {
                ws.send(JSON.stringify({
                    type: "joinRoom",
                    payload: {
                        roomId,
                        name,
                        userId: userIdRef.current
                    }
                }));
            }
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "chat") {
                setMessages(m => [...m, {
                    userId: data.payload.userId,
                    name: data.payload.name,
                    message: data.payload.message
                }]);
            }
            if (data.type === "error") {
                alert(data.payload.message);
                setIsJoined(false); 
                navigate('/');
                return;
            }

            if (data.type === "system") {
                setIsJoined(true); 
                setMessages(m => [...m, {
                    userId: "system",
                    name: "System",
                    message: data.payload.message
                }]);
            }

        };


        return () => {
            ws.onopen = null;
            ws.onmessage = null;
            ws.close();
        }

    }, [roomId, name, mode]);

    function sendMessage() {
        const message = inpRef.current?.value;
        if (!message) return;

        wsRef.current?.send(JSON.stringify({
            type: "chat",
            payload: {
                roomId,
                userId: userIdRef.current,
                name,
                message
            }
        }));

        if (inpRef.current) inpRef.current.value = "";
    }

    if (!isJoined) {
        return <div className="p-4 h-screen font-jetbrains text-4xl flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">Connecting to room...</div>;
    }

    return (
        <div className="h-screen font-jetbrains flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <div className="w-full sm:max-w-md md:max-w-xl lg:max-w-2xl h-[90vh] flex flex-col bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden">

                <header className="p-4 bg-blue-900 flex items-center justify-between shadow-lg">
                    <span className="text-sm sm:text-lg">Room ID: <span className='font-bold'>{roomId}</span></span>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 scrollbar-hide">
                    {messages.map((msg, idx) => {
                        const isMine = msg.userId === userIdRef.current;
                        const isSystem = msg.userId === "system";

                        return (
                            <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <span className={`px-3 py-2 sm:px-4 sm:py-2 rounded-2xl shadow-md max-w-[85%] sm:max-w-[75%] break-words 
                                    ${isSystem ? "bg-gray-500 text-white text-sm italic mx-auto" : isMine ? "bg-blue-900 text-white" : "bg-gray-700 text-gray-200"}`}>
                                    {isSystem ? msg.message : `${msg.name}: ${msg.message}`}
                                </span>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                
                <div className="p-2 sm:p-3 bg-gray-800 flex items-center space-x-2 border-t border-gray-700">
                    <input
                        ref={inpRef}
                        type="text"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-900"
                        required
                    />
                    <button
                        onClick={sendMessage}
                        className="px-3 py-2 sm:px-5 sm:py-2 rounded-full bg-blue-900 hover:bg-blue-900 active:scale-95 transition transform text-white font-medium shadow-md"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatInterface;
