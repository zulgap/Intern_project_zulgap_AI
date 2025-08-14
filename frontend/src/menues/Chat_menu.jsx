//채팅 메뉴

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Zulgap AI 어시스턴트입니다! 무엇을 도와드릴까요?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const SendIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      content: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        content: "안녕하세요! React 기반 AI에서 응답드리고 있습니다! 상태 관리와 컴포넌트 기반으로 부드럽게 동작하고 있어요. 더 궁금한 것이 있으시면 언제든지 물어보세요!",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 공통 Sidebar 컴포넌트 사용 */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">채팅</h2>
              <p className="text-sm text-gray-600">실시간 AI와의 대화</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-xs lg:max-w-md">
                <div className={`${
                  message.isUser ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'
                } rounded-lg p-3 shadow-sm`}>
                  <p className={`text-sm ${message.isUser ? 'text-white' : 'text-gray-700'}`}>
                    {message.content}
                  </p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right pr-3' : 'pl-3'}`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="메시지를 입력하세요..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 bottom-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputMessage.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">
              React 상태 관리 기반 채팅
            </div>
            <div className="text-xs text-gray-500">
              Shift + Enter로 줄바꿈
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;