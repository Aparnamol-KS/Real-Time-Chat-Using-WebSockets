import { Route, Routes, BrowserRouter } from "react-router";

import './App.css'
import HomePage from "./components/home";
import ChatInterface from "./components/chat";


function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatInterface />} />
    </Routes>

  </BrowserRouter>
}

export default App;
