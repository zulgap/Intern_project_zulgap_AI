// components/SidebarContents/PartnerSidebarContent.jsx
import React from 'react';

const PartnerSidebarContent = () => {
  return (
    <div>
      <h3 className="text-xs text-gray-500 font-bold mb-2">동료사 목록</h3>
      <ul className="space-y-1 text-sm text-gray-700">
        <li>💼 AI파트너스 (진행 중)</li>
        <li>📦 물류넷 (검토 중)</li>
        <li>🔧 오토팩토리 (완료)</li>
      </ul>
    </div>
  );
};

export default PartnerSidebarContent;
