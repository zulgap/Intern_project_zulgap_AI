// components/SidebarContents/BotSettingsSidebarContent.jsx
import React from 'react';

const BotSettingsSidebarContent = () => {
  return (
    <div>
      <h3 className="text-xs text-gray-500 font-bold mb-2">봇 설정</h3>
      <ul className="space-y-1 text-sm text-gray-700">
        <li>⚙ 리서쳐 봇 스킬 편집</li>
        <li>⚙ 플래너 봇 설정</li>
        <li>⚙ 퍼블리셔 봇 권한</li>
      </ul>
    </div>
  );
};

export default BotSettingsSidebarContent;

// 미정 (비워 둘 수도 있음)
