// 봇 설정 메뉴

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const BotSetting_menu = () => {
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [botPersonality, setBotPersonality] = useState('친절하고 도움이 되는');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Common Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">에이전트 생성</h2>
              <p className="text-sm text-gray-600">새로운 AI 에이전트를 설정하고 생성합니다</p>
            </div>
          </div>
        </header>

        {/* Bot Setting Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">에이전트 기본 설정</h3>
              
              <div className="space-y-6">
                {/* 봇 이름 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    에이전트 이름
                  </label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="예: 고객 상담 봇"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 봇 설명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    에이전트 설명
                  </label>
                  <textarea
                    value={botDescription}
                    onChange={(e) => setBotDescription(e.target.value)}
                    placeholder="에이전트의 역할과 기능을 설명해주세요"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 봇 성격 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    에이전트 성격
                  </label>
                  <select
                    value={botPersonality}
                    onChange={(e) => setBotPersonality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="친절하고 도움이 되는">친절하고 도움이 되는</option>
                    <option value="전문적이고 정확한">전문적이고 정확한</option>
                    <option value="활발하고 창의적인">활발하고 창의적인</option>
                    <option value="차분하고 신중한">차분하고 신중한</option>
                  </select>
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-end">
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      // 봇 생성 로직 구현 필요
                      alert('에이전트 생성 기능은 추후 구현될 예정입니다.');
                    }}
                  >
                    에이전트 생성
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotSetting_menu;