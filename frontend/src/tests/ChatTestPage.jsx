//채팅 테스트 페이지 프론트
 
import React, { useState } from 'react';

const ChatTestPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '안녕하세요! 어떤 도움이 필요하신가요?',
      isBot: true
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // 사용자 메시지 추가
      const newUserMessage = {
        id: messages.length + 1,
        text: message,
        isBot: false
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      setMessage('');
      
      // 간단한 봇 응답 (나중에 API 연결로 교체)
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: '메시지를 받았습니다. 곧 더 자세한 답변을 드리겠습니다.',
          isBot: true
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleBackToMain = () => {
    window.location.href = '/';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">ZULGAP.ai 채팅 테스트</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold">AI 어시스턴트와 대화하기</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-4 rounded-lg ${
                    msg.isBot 
                      ? 'bg-blue-50 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 ml-12'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="메시지를 입력하세요..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleSendMessage}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                전송
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={handleBackToMain}
              className="text-blue-500 hover:underline"
            >
              ← 메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTestPage;
