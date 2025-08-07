import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import WorkflowPage from "./menues/Workflow";
import ChatTestPage from "./tests/ChatTestPage";
import ChatPage from "./menues/Chat";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/chat-test" element={<ChatTestPage />} />
        <Route path="/chat-react" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;