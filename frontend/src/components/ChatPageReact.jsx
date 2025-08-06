//채팅페이지 프론트엔드
 
import React, { useState } from 'react';

const ChatPageReact = () => {
  const [activeCategory, setActiveCategory] = useState('동료사 이름');
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Zulgap AI 어시스턴트 입니다. 무엇을 도와드릴까요?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // 아이콘 컴포넌트들
  const MessageSquareIcon = () => (
    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  const FolderIcon = () => (
    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const SendIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

  const categories = [
    { id: 'agent-chat', name: '에이전트 채팅', icon: MessageSquareIcon },
    { id: 'chat-management', name: '채팅 관리', icon: MessageSquareIcon },
    { id: 'work-flow', name: '워크 플로우', icon: FolderIcon },
    { id: 'agent-creation', name: '에이전트 생성', icon: SettingsIcon }
  ];

  const menuItems = {
    '에이전트 채팅': [
      { name: '새로운 채팅', time: '방금 전', active: true },
      { name: '이전 대화', time: '1시간 전', active: false },
      { name: '프로젝트 분석', time: '어제', active: false }
    ],
    '채팅 관리': [
      { name: '채팅 내보내기', time: '데이터 관리', active: false },
      { name: '채팅 삭제', time: '정리 도구', active: false },
      { name: '설정', time: '환경 설정', active: false }
    ],
    '워크 플로우': [
      { name: '새 워크플로우', time: '생성', active: false },
      { name: '템플릿', time: '미리 정의됨', active: false },
      { name: '자동화 규칙', time: '규칙 관리', active: false }
    ],
    '에이전트 생성': [
      { name: '새 에이전트', time: '생성', active: false },
      { name: '에이전트 관리', time: '편집 및 삭제', active: false },
      { name: '스킬 설정', time: '능력 구성', active: false }
    ]
  };

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
        content: "🤖 React 기반 AI에서 응답드립니다! 상태 관리와 컴포넌트 기반으로 더욱 스마트하게 작동해요. 더 궁금한 것이 있으시면 언제든 물어보세요!",
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
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-black">ZULGAP.ai</h1>
          <p className="text-xs text-blue-500 mt-1">🚀 워크플로우 자동화 프로젝트</p>
        </div>

        {/* Categories */}
        <div className="border-b border-gray-200">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.name)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeCategory === category.name ? 'bg-gray-100 border-r-2 border-blue-500' : ''
                }`}
              >
                <IconComponent />
                <span className="text-sm text-gray-700">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Menu Items */}
        <div className="p-4 flex-1">
          <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
            {activeCategory === '에이전트 채팅' ? '채팅 기록' : activeCategory}
          </h3>
          <div className="space-y-1">
            {menuItems[activeCategory]?.map((item, index) => (
              <div
                key={index}
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  item.active ? 'border-l-2 border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="font-medium text-sm text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-500">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">사용자</div>
              <div className="text-xs text-gray-500">user@example.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{activeCategory}</h2>
              <p className="text-sm text-gray-600">대화내용 한 줄 소개</p>
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

export default ChatPageReact;
