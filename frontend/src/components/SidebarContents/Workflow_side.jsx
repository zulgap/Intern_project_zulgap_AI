// components/SidebarContents/WorkflowSidebarContent.jsx
import React from 'react';

const WorkflowSidebarContent = () => {
  return (
    <div>
      <h3 className="text-xs text-gray-500 font-bold mb-2">워크플로우 템플릿</h3>
      <ul className="space-y-1 text-sm text-gray-700">
        <li>✍ 블로그 자동화</li>
        <li>📩 뉴스레터 생성</li>
        <li>📊 리서치 보고서</li>
      </ul>
    </div>
  );
};

export default WorkflowSidebarContent;
