import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Workflow, 
  Cog, 
  Save,
  RefreshCw,
  Settings,
  User,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Eye,
  EyeOff,
  Sliders,
  Zap,
  Target,
  Brain,
  Palette,
  Link,
  FileText,
  Hash,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  X,
  Search,
  Filter
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { 
  saveToStorage, 
  loadFromStorage, 
  getAllAgents, 
  getStorageInfo,
  STORAGE_KEYS,
  saveAgent,
  deleteAgent 
} from '../utils/agentStorage';

const BotSetting_menu = () => {
  // 상태 관리
  const [agents, setAgents] = useState({});
  const [activeTab, setActiveTab] = useState('agents');
  const [editingAgent, setEditingAgent] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // 초기 로딩
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    try {
      const storedAgents = getAllAgents();
      setAgents(storedAgents);
    } catch (error) {
      console.error('초기 데이터 로딩 실패:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 에이전트 업데이트 함수 (메인 레벨에 정의)
  const updateAgent = useCallback((agentKey, updatedAgent) => {
    const agentWithTimestamp = {
      ...updatedAgent,
      lastModified: new Date().toISOString()
    };
    
    const newAgents = {
      ...agents,
      [agentKey]: agentWithTimestamp
    };
    
    setAgents(newAgents);
    saveToStorage(STORAGE_KEYS.agents, newAgents);
    
    setSuccess('에이전트가 저장되었습니다.');
    setTimeout(() => setSuccess(null), 3000);
  }, [agents]);

  // 새 에이전트 생성
  const createNewAgent = () => {
    const newAgentKey = `agent_${Date.now()}`;
    const newAgent = {
      name: '새 에이전트',
      prompt: '당신은 도움이 되는 AI 어시스턴트입니다.',
      personality: 'balanced',
      responseLength: 'medium',
      avatar: '🤖',
      color: '#3B82F6',
      expertise: [],
      randomness: 0.7,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    updateAgent(newAgentKey, newAgent);
    setEditingAgent(newAgentKey);
  };

  // 메시지 배너 컴포넌트
  const MessageBanner = () => {
    if (!error && !success) return null;

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
        error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
      }`}>
        {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
        <span>{error || success}</span>
        <button 
          onClick={() => { setError(null); setSuccess(null); }}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  // 에이전트 카드 컴포넌트
  const AgentCard = React.memo(({ agentKey, agent }) => {
    const isEditing = editingAgent === agentKey;

    const handleFieldChange = (field, value) => {
      const updatedAgent = { ...agent, [field]: value };
      updateAgent(agentKey, updatedAgent);
    };

    const deleteAgentHandler = () => {
      if (window.confirm('정말로 이 에이전트를 삭제하시겠습니까?')) {
        const newAgents = { ...agents };
        delete newAgents[agentKey];
        setAgents(newAgents);
        saveToStorage(STORAGE_KEYS.agents, newAgents);
        setEditingAgent(null);
        setSuccess('에이전트가 삭제되었습니다.');
        setTimeout(() => setSuccess(null), 3000);
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{agent.avatar || '🤖'}</span>
            {isEditing ? (
              <input
                type="text"
                value={agent.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditingAgent(isEditing ? null : agentKey)}
              className={`p-2 rounded-lg transition-colors ${
                isEditing 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
            </button>
            <button
              onClick={deleteAgentHandler}
              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4">
            {/* 아바타 및 색상 선택 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아바타
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['🤖', '👨‍💻', '👩‍🔬', '🧠', '⚡', '🎯', '💡', '🔥'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleFieldChange('avatar', emoji)}
                      className={`p-2 text-xl border rounded-lg hover:bg-gray-50 ${
                        agent.avatar === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  테마 색상
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
                    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => handleFieldChange('color', color)}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        agent.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 프롬프트 수정 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시스템 프롬프트
              </label>
              <textarea
                value={agent.prompt}
                onChange={(e) => handleFieldChange('prompt', e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="에이전트의 역할과 행동 방식을 설명해주세요..."
              />
            </div>

            {/* 성격과 스타일 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성격
                </label>
                <select
                  value={agent.personality}
                  onChange={(e) => handleFieldChange('personality', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="conservative">신중한</option>
                  <option value="balanced">균형적인</option>
                  <option value="innovative">혁신적인</option>
                  <option value="creative">창의적인</option>
                  <option value="analytical">분석적인</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  답변 길이
                </label>
                <select
                  value={agent.responseLength}
                  onChange={(e) => handleFieldChange('responseLength', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="brief">간결</option>
                  <option value="medium">보통</option>
                  <option value="detailed">상세</option>
                </select>
              </div>
            </div>

            {/* 고급 설정 토글 */}
            <div>
              <button
                onClick={() => setShowAdvanced({
                  ...showAdvanced,
                  [agentKey]: !showAdvanced[agentKey]
                })}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Sliders size={16} />
                <span>고급 설정</span>
                {showAdvanced[agentKey] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* 고급 설정 패널 */}
            {showAdvanced[agentKey] && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                {/* 창의성/무작위성 슬라이더 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    창의성 레벨: {Math.round((agent.randomness || 0.7) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={agent.randomness || 0.7}
                    onChange={(e) => handleFieldChange('randomness', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>일관성</span>
                    <span>창의적</span>
                  </div>
                </div>

                {/* 전문 분야 태그 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전문 분야
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(agent.expertise || []).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center"
                      >
                        {tag}
                        <button
                          onClick={() => {
                            const newExpertise = agent.expertise.filter((_, i) => i !== index);
                            handleFieldChange('expertise', newExpertise);
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    {['프로그래밍', '디자인', '마케팅', '분석', '글쓰기', '연구'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          const currentExpertise = agent.expertise || [];
                          if (!currentExpertise.includes(tag)) {
                            handleFieldChange('expertise', [...currentExpertise, tag]);
                          }
                        }}
                        className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-500 mt-4">
          마지막 수정: {new Date(agent.lastModified || agent.created || Date.now()).toLocaleDateString('ko-KR')}
        </div>
      </div>
    );
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <MessageBanner />
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">봇 설정</h1>
              <p className="text-gray-600 mt-1">AI 에이전트를 생성하고 관리합니다</p>
            </div>
            <button
              onClick={createNewAgent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>새 에이전트</span>
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 p-6 overflow-auto">
          {Object.keys(agents).length === 0 ? (
            <div className="text-center py-12">
              <Bot size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                아직 생성된 에이전트가 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                새 에이전트를 생성하여 AI 어시스턴트를 만들어보세요
              </p>
              <button
                onClick={createNewAgent}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus size={20} />
                <span>첫 번째 에이전트 만들기</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(agents).map(([agentKey, agent]) => (
                <AgentCard key={agentKey} agentKey={agentKey} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotSetting_menu;
