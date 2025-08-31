import { Route, Routes, BrowserRouter } from "react-router";

import './App.css'
import HomePage from "./components/home";
import ChatInterface from "./components/chat";
import JoinRoom from "./components/joinRoom";
import CreateRoom from "./components/createRoom";


function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/joinRoom" element={<JoinRoom />} />
      <Route path="/createRoom" element={<CreateRoom />} />
      <Route path="/chat" element={<ChatInterface />} />
    </Routes>

  </BrowserRouter>
}

export default App;
