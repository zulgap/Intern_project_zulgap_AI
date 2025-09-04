//채팅 메뉴
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Zulgap 팀장 에이전트입니다. 무엇을 도와드릴까요?",
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // 1) 사용자 메시지 + 로딩 메시지 추가 (id 안전)
    let thinkingId;
    const userText = inputMessage; // fetch에 동일 문자열 사용
    setMessages(prev => {
      const nextId = (prev[prev.length - 1]?.id || 0) + 1;
      thinkingId = nextId + 1;
      return [
        ...prev,
        {
          id: nextId,
          content: userText,
          isUser: true,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: thinkingId,
          content: '팀장 에이전트가 응답을 준비 중입니다…',
          isUser: false,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });

    // 2) 입력창 비우기
    setInputMessage('');

    try {
      console.log('[Chat] POST /api/chat ...', userText);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      console.log('[Chat] /api/chat status:', res.status);
      const data = await res.json().catch(() => ({}));
      console.log('[Chat] /api/chat response:', data);

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      const aiText = data?.response || '(응답 없음)';

      // 3) 로딩 메시지 → 실제 응답으로 교체
      setMessages(prev => prev.map(m => (m.id === thinkingId ? { ...m, content: aiText } : m)));
    } catch (e) {
      setMessages(prev => prev.map(m => (m.id === thinkingId ? { ...m, content: `오류: ${e.message}` } : m)));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">채팅</h2>
              <p className="text-sm text-gray-600">팀장 에이전트와 대화</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-xs lg:max-w-md">
                <div className={`${message.isUser ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'} rounded-lg p-3 shadow-sm`}>
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

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}  // onKeyPress 대신 onKeyDown이 더 안정적
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
            <div className="text-xs text-gray-500">React 상태 관리 기반 채팅</div>
            <div className="text-xs text-gray-500">Enter 전송 · Shift+Enter 줄바꿈</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;