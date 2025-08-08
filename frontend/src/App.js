import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import WorkflowPage from "./menues/Workflow_menu";
import ChatTestPage from "./tests/ChatTestPage";
import ChatPage from "./menues/Chat_menu";
import HomePage from "./pages/HomePage";
import BotSettingPage from "./menues/BotSetting_menu";
import ClientsPage from "./menues/Clients_menu";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/chat-test" element={<ChatTestPage />} />
        <Route path="/chat-react" element={<ChatPage />} />
        <Route path="/botsetting" element={<BotSettingPage />} />
        <Route path="/clients" element={<ClientsPage />} />
      </Routes>
    </Router>
  );
}

export default App;