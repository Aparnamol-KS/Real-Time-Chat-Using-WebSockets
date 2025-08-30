import { useEffect, useRef, useState } from 'react';
import './App.css'

function App() {
  const [messages, setMessages] = useState<string[]>(['hi', 'hi there']);
  const wsRef = useRef<WebSocket | null>(null);
  const inpRef = useRef<HTMLInputElement | null>(null);

  function sendMessage() {
    const message = inpRef.current?.value;
    if (!message) return;

    wsRef.current?.send(JSON.stringify({
      type: "chat",
      payload: { message }
    }));

    setMessages(m => [...m, message]); // add locally
    //@ts-ignore
    inpRef.current?.value = ""; // clear input
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId: "red" }
      }))
    }

    return () => ws.close();
  }, []);

  return (
    <div className="h-screen font-mono flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="w-full max-w-2xl h-[90vh] flex flex-col bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <header className="p-4 bg-blue-900 flex items-center justify-between shadow-lg">
          <h1 className="text-lg font-bold tracking-wide">Chat Room</h1>
          <span className="text-xs">Room: red</span>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.map((message, idx) => {
            const isMine = idx === messages.length - 1; // last message = mine
            return (
              <div
                key={idx}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`px-4 py-2 rounded-2xl shadow-md max-w-[75%] break-words ${
                    isMine
                      ? "bg-blue-900 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {message}
                </span>
              </div>
            )
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-gray-800 flex items-center space-x-2 border-t border-gray-700">
          <input
            ref={inpRef}
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 rounded-full bg-blue-900 hover:bg-blue-900 active:scale-95 transition transform text-white font-medium shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App;
