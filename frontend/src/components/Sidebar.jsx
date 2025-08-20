// components/Sidebar.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatSidebarContent from './SidebarContents/Chat_side';
import PartnerSidebarContent from './SidebarContents/Clients_side';
import WorkflowSidebarContent from './SidebarContents/Workflow_side';
import BotSettingsSidebarContent from './SidebarContents/BotSetting_side';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('홈');

  // 현재 경로에 따라 활성 카테고리 설정
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/home') {
      setActiveCategory('홈');
    } else if (path === '/chat-react') {
      setActiveCategory('채팅');
    } else if (path === '/clients') {
      setActiveCategory('동료사 관리');
    } else if (path === '/workflow') {
      setActiveCategory('워크 플로우');
    } else if (path === '/botsetting') {
      setActiveCategory('에이전트 설정');
    }
  }, [location.pathname]);

  // 네비게이션 핸들러
  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    
    switch (categoryName) {
      case '홈':
        navigate('/home');
        break;
      case '채팅':
        navigate('/chat-react');
        break;
      case '동료사 관리':
        navigate('/clients');
        break;
      case '워크 플로우':
        navigate('/workflow');
        break;
      case '에이전트 설정':
        navigate('/botsetting');
        break;
      default:
        break;
    }
  };

  // 메뉴 아이콘 컴포넌트

  const HomeIcon = () => (
    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const MessageSquareIcon = () => (
    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  const FolderIcon = () => (
    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0..." />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  // 메뉴 카테고리 정의
  const categories = [
    { id: 'home', name: '홈', icon: HomeIcon },
    { id: 'agent-chat', name: '채팅', icon: MessageSquareIcon },
    { id: 'client-management', name: '동료사 관리', icon: UsersIcon },
    { id: 'work-flow', name: '워크 플로우', icon: FolderIcon },
    { id: 'agent-creation', name: '에이전트 설정', icon: SettingsIcon }
  
  ];

  // 각 카테고리별 하위 메뉴 아이템
  const menuItems = {
    '홈': [],
    '채팅': [
      { name: '일반 채팅', time: '방금 전', active: true },
      { name: '프로젝트 논의', time: '5분 전', active: false },
      { name: '업무 상담', time: '1시간 전', active: false }
    ],
    '워크 플로우': [
      { name: '데이터 처리', time: '오늘', active: false },
      { name: '보고서 생성', time: '어제', active: false }
    ],
    '에이전트 설정': [
      { name: '새 에이전트 설정', time: '진행 중', active: false }
    ],
    '동료사 관리': [
      { name: '클라이언트 A', time: '활성', active: false },
      { name: '클라이언트 B', time: '대기', active: false }
    ]
  };

  // 유연한 구역 렌더링 함수
  const renderFlexibleContent = () => {
    if (activeCategory === '채팅') return <ChatSidebarContent />;
    if (activeCategory === '동료사 관리') return <PartnerSidebarContent />;
    if (activeCategory === '워크 플로우') return <WorkflowSidebarContent />;
    if (activeCategory === '에이전트 설정') return <BotSettingsSidebarContent />;
    return null;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-black">ZULGAP.ai</h1>
        <p className="text-xs text-blue-500 mt-1">🚀 워크플로우 자동화 프로젝트</p>
      </div>

      {/* 1. 메뉴 구역 */}
      <div className="border-b border-gray-200">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
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

      {/* 2. 유연한 구역 */}
      <div className="p-4 border-b border-gray-200">
        {renderFlexibleContent()}
      </div>

      {/* 3. 메뉴 아이템 (하위 메뉴) */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
          {activeCategory === '채팅' ? '채팅 기록' : activeCategory}
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

      {/* 4. 기타 구역 */}
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
  );
};

export default Sidebar;