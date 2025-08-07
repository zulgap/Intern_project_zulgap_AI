// components/Sidebar.jsx

import React from 'react';
import ChatSidebarContent from './SidebarContents/Chat_side';
import PartnerSidebarContent from './SidebarContents/Client_side';
import WorkflowSidebarContent from './SidebarContents/Workflow_side';
import BotSettingsSidebarContent from './SidebarContents/BotSetting_side';

const Sidebar = ({ categories, activeCategory, setActiveCategory, menuItems }) => {
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

  const iconMap = {
    'MessageSquareIcon': MessageSquareIcon,
    'FolderIcon': FolderIcon,
    'SettingsIcon': SettingsIcon,
  };

  // 유연한 구역 렌더링 함수
  const renderFlexibleContent = () => {
    if (activeCategory === '에이전트 채팅') return <ChatSidebarContent />;
    if (activeCategory === '채팅 관리') return <PartnerSidebarContent />;
    if (activeCategory === '워크 플로우') return <WorkflowSidebarContent />;
    if (activeCategory === '에이전트 생성') return <BotSettingsSidebarContent />;
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

      {/* 2. 유연한 구역 */}
      <div className="p-4 border-b border-gray-200">
        {renderFlexibleContent()}
      </div>

      {/* 3. 메뉴 아이템 (하위 메뉴) */}
      <div className="p-4 flex-1 overflow-y-auto">
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
