import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// SVG 아이콘 컴포넌트들 (Lucide 대신 직접 구현)
const SettingsIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const WorkflowIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4l-4 4 4 4m-10-4l-4-4 4-4" />
  </svg>
);

const BotIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const LayoutIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const MicIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const ImageIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

function Home() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('에이전트 세팅');
  const [message, setMessage] = useState('');

  const handleMenuClick = (menuLabel) => {
    console.log('메뉴 클릭됨:', menuLabel); // ← 디버깅용 추가
    setSelectedMenu(menuLabel);
    
    // 워크 플로우 메뉴 클릭 시 워크플로우 페이지로 이동
    if (menuLabel === '워크 플로우') {
        console.log('워크플로우로 이동'); // ← 디버깅용 추가
        navigate('/workflow');
    }
  };

  const handleServiceCardClick = (cardTitle) => {
    // 서비스 카드 클릭 시 채팅 페이지로 이동
    navigate('/chat-react');
  };

  const menuItems = [
    { icon: SettingsIcon, label: '에이전트 세팅', active: true },
    { icon: UsersIcon, label: '조직 관리', active: false },
    { icon: WorkflowIcon, label: '워크 플로우', active: false },
    { icon: BotIcon, label: '에이전트 설정', active: false }
  ];

  const serviceCards = [
    {
      title: '리서처봇',
      icon: SearchIcon,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      suggestions: [
        '"키워드를 분석해줘"',
        '"참고 문서를 분석해줘"'
      ]
    },
    {
      title: '플래너봇',
      icon: FileTextIcon,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      suggestions: [
        '"초안을 작성해줘"',
        '"내가 쓴 초안을 참고 문서의 내용을 포맷해서 수정해줘"'
      ]
    },
    {
      title: '비주얼봇',
      icon: EyeIcon,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      suggestions: [
        '"이미지를 3가지 추천해줘"',
        '"아래의 이미지를 비슷하게 변경해줘"'
      ]
    },
    {
      title: '퍼블리셔봇',
      icon: LayoutIcon,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      suggestions: [
        '"최종안을 수정해줘"',
        '"이미지를 넣은 최종안을 다른 형태로 해줘"'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">ZULGAP.ai</h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleMenuClick(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  selectedMenu === item.label
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <IconComponent />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-end gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon />
              새로운 세팅
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <span className="text-gray-700">출발</span>
              <ChevronDownIcon />
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <span className="text-gray-700">컬렉션김영지원팀</span>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Welcome Message */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
            <h2 className="text-4xl font-normal text-gray-900 mb-16 text-center">
              무엇을 도와드릴까요?
            </h2>

            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full">
              {serviceCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={index}
                    onClick={() => handleServiceCardClick(card.title)}
                   className={`${card.color} rounded-xl p-6 border hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-blue-300 hover:bg-blue-100`}
                  >
                    <div className="flex flex-col items-start text-left space-y-4">
                     <div className={`p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors`}>
                        <IconComponent />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900">
                        {card.title}
                      </h3>
                      
                      <div className="space-y-2">
                        {card.suggestions.map((suggestion, idx) => (
                          <p 
                            key={idx} 
                           className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                          >
                            {suggestion}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 bg-white p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-300 p-4 shadow-sm hover:shadow-md transition-shadow">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MicIcon />
                </button>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <ImageIcon />
                </button>

                <input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      navigate('/chat-react');
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 px-2 text-base"
                />

                <button 
                  onClick={() => {
                    if (message.trim()) {
                      navigate('/chat-react');
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" 
                  disabled={!message.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;