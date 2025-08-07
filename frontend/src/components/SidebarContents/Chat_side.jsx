// components/SidebarContents/ChatSidebarContent.jsx
import React from 'react';

const ChatSidebarContent = () => {
  return (
    <div>
      {/* 작업 현황 */}
      <div className="mb-6">
        <h3 className="text-xs text-gray-500 font-bold mb-2">작업 현황</h3>
        <div className="mb-2">
          <div className="text-sm text-gray-700">블로그 작성 진행률</div>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '34%' }}></div>
          </div>
          <div className="text-right text-xs text-gray-500">34%</div>
        </div>
      </div>

      {/* 참여 에이전트 */}
      <div>
        <h3 className="text-xs text-gray-500 font-bold mb-2">참여 에이전트</h3>
        <ul className="space-y-1">
          <li>🔍 리서쳐 봇 - 진행 중</li>
          <li>📝 플래너 봇 - 대기</li>
          <li>🎨 비주얼 봇 - 완료</li>
          <li>🚀 퍼블리셔 봇 - 대기</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebarContent;
