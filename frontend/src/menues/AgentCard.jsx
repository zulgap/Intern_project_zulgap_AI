import React from 'react';

// AgentCard 컴포넌트 (props로 모든 상태와 함수 전달)
const AgentCard = React.memo(function AgentCard({
  agent,
  editingAgent,
  setEditingAgent,
  saving,
  handleSaveAgent,
  deleteAgent,
  responseLengthOptions,
  generateEnhancedPrompt
}) {
  const isEditing = editingAgent === agent.id;
  const [editAgent, setEditAgent] = React.useState(agent);
  React.useEffect(() => { setEditAgent(agent); }, [agent]);

  const handleFieldChange = (field, value) => setEditAgent(prev => ({ ...prev, [field]: value }));
  const handleApiConfigChange = (field, value) => setEditAgent(prev => ({ ...prev, apiConfig: { ...prev.apiConfig, [field]: value } }));
  const handleResponseLengthChange = (key) => setEditAgent(prev => ({ ...prev, responseLength: key }));
  const handleRandomnessChange = (value) => setEditAgent(prev => ({ ...prev, randomness: value, apiConfig: { ...prev.apiConfig, temperature: value } }));
  const handleSave = () => handleSaveAgent(agent.id, editAgent);
  const handleCancel = () => setEditingAgent(null);
  const handleDelete = () => deleteAgent(agent.id);

  // 인라인 SVG 아이콘
  const CheckIcon = () => (<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 8.5l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
  const XIcon = () => (<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);
  const SettingsIcon = () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Zm7.4-2.9a1 1 0 0 0 .21-1.09l-1.43-2.49a1 1 0 0 1 0-.92l1.43-2.49a1 1 0 0 0-.21-1.09l-2.12-2.12a1 1 0 0 0-1.09-.21l-2.49 1.43a1 1 0 0 1-.92 0l-2.49-1.43a1 1 0 0 0-1.09.21L4.6 5.6a1 1 0 0 0-.21 1.09l1.43 2.49a1 1 0 0 1 0 .92L4.39 12.1a1 1 0 0 0 .21 1.09l2.12 2.12a1 1 0 0 0 1.09.21l2.49-1.43a1 1 0 0 1 .92 0l2.49 1.43a1 1 0 0 0 1.09-.21l2.12-2.12Z" stroke="currentColor" strokeWidth="2"/></svg>);
  const TrashIcon = () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" stroke="currentColor" strokeWidth="2"/></svg>);
  const LoaderIcon = () => (<svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#3B82F6" strokeWidth="2" strokeDasharray="22" strokeDashoffset="10"/></svg>);

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center text-white text-2xl">🤖</div>
            <div className="flex-1">
              <input type="text" value={editAgent.name || ''} onChange={e => handleFieldChange('name', e.target.value)} className="text-xl font-bold text-gray-900 border-none outline-none bg-transparent border-b-2 border-blue-500 pb-1 w-full" />
            </div>
            <div className="flex space-x-2">
              <button onClick={handleSave} disabled={saving} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">{saving ? <LoaderIcon /> : <CheckIcon />}</button>
              <button onClick={handleCancel} className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"><XIcon /></button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">답변 스타일</label>
            <div className="flex space-x-2">
              {Object.entries(responseLengthOptions).map(([key, option]) => (
                <button key={key} onClick={() => handleResponseLengthChange(key)} className={`flex-1 p-3 rounded-lg border text-center transition-colors ${editAgent.responseLength === key ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="font-medium text-sm">{option.name}</div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">전문 분야</label>
            <div className="flex flex-wrap gap-2">
              {editAgent.expertise?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시스템 프롬프트</label>
            <textarea value={editAgent.prompt || ''} onChange={e => handleFieldChange('prompt', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" rows="4" placeholder="이 에이전트의 역할과 행동 방식을 정의하세요..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">랜덤 지수 (창의성 수준)<span className="ml-2 text-blue-600 font-semibold">{(editAgent.randomness || 0.7).toFixed(1)}</span></label>
            <div className="px-3">
              <div className="relative">
                <input type="range" min="0" max="1" step="0.1" value={editAgent.randomness || 0.7} onChange={e => handleRandomnessChange(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" style={{ background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(editAgent.randomness || 0.7) * 100}%, #E5E7EB ${(editAgent.randomness || 0.7) * 100}%, #E5E7EB 100%)` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>보수적 (0.0)</span><span>균형적 (0.5)</span><span>창의적 (1.0)</span></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">낮을수록 일관되고 예측 가능한 답변, 높을수록 창의적이고 다양한 답변을 생성합니다.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">🔧 API 설정</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">모델</label>
                <select value={editAgent.apiConfig?.model || 'gpt-4'} onChange={e => handleApiConfigChange('model', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">최대 토큰</label>
                <input type="number" value={editAgent.apiConfig?.maxTokens || 1500} onChange={e => handleApiConfigChange('maxTokens', parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" min="100" max="4000" />
              </div>
            </div>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-blue-600">💡</span>
                <span className="text-blue-700">API 키는 공유 방식을 사용합니다. Temperature는 위의 랜덤 지수와 동기화됩니다.</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center"><span className="mr-2">🔍</span>실제 AI 프롬프트 미리보기</h4>
            <div className="bg-white rounded-lg p-3 border border-amber-200 max-h-48 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{generateEnhancedPrompt(editAgent)}</pre>
            </div>
            <p className="text-xs text-amber-700 mt-2">위 내용이 실제로 AI에게 전달되는 최종 시스템 프롬프트입니다. 성격 유형, 답변 스타일, 전문 분야가 모두 반영됩니다.</p>
          </div>
        </div>
      </div>
    );
  }
  // 일반(비편집) 카드 뷰
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center text-white text-2xl">🤖</div>
          <div className="flex-1">
            <input type="text" value={agent.name || ''} readOnly className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent w-full mb-2" placeholder="에이전트 이름을 입력하세요" />
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setEditingAgent(agent.id)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="고급 설정"><SettingsIcon /></button>
          <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="에이전트 삭제"><TrashIcon /></button>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">전문 분야</div>
        <div className="flex flex-wrap gap-2">
          {agent.expertise?.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{skill}</span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">시스템 프롬프트</div>
        <textarea value={agent.prompt || ''} disabled className="w-full p-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none" rows="4" placeholder="이 에이전트의 역할과 행동 방식을 정의하세요..." />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">랜덤 지수 (창의성)</div>
          <span className="text-sm font-semibold text-blue-600">{(agent.randomness || 0.7).toFixed(1)}</span>
        </div>
        <div className="mb-2">
          <input type="range" min="0" max="1" step="0.1" value={agent.randomness || 0.7} disabled className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-not-allowed" style={{ background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(agent.randomness || 0.7) * 100}%, #E5E7EB ${(agent.randomness || 0.7) * 100}%, #E5E7EB 100%)` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500"><span>보수적</span><span>균형적</span><span>창의적</span></div>
      </div>
    </div>
  );
});

export default AgentCard;
