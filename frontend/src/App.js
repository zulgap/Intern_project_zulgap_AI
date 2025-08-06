import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import WorkflowPage from "./components/WorkflowPage";
import ChatTestPage from "./components/ChatTestPage";
import ChatPageReact from "./components/ChatPageReact";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/chat-test" element={<ChatTestPage />} />
        <Route path="/chat-react" element={<ChatPageReact />} />
      </Routes>
    </Router>
  );
}

export default App;