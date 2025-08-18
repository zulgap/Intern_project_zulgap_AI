import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bot, 
  Save,
  RefreshCw,
  Settings,
  User,
  FileText,
  Check,
  X,
  Upload,
  File,
  Trash2,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const BotSetting_menu = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [editingAgent, setEditingAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [agents, setAgents] = useState({
    // 빈 상태로 시작 - 사용자가 직접 생성한 에이전트들만 표시
  });
  const [agentDocumentMappings, setAgentDocumentMappings] = useState({});

  // 초기 데이터 로드 (목업 데이터 사용)
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 목업 데이터로 대체
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      
      // 에이전트는 이미 초기값으로 설정됨
      // 문서와 관계는 빈 배열로 시작
      setDocuments([]);
      setRelationships([]);
      setAgentDocumentMappings({});
      
      showMessage('설정이 로드되었습니다.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // useCallback 종료

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 에러/성공 메시지 표시
  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 6000); // 에러 메시지는 6초간 표시
    }
  };

  // 파일 업로드 처리 (목업)
  const handleFileUpload = async (files) => {
    try {
      setUploading(true);
      
      // 목업 업로드 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const uploadedDocs = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toLocaleDateString('ko-KR'),
        description: ''
      }));

      setDocuments(prev => [...prev, ...uploadedDocs]);
      showMessage(`${uploadedDocs.length}개 파일이 업로드되었습니다.`);
    } catch (err) {
      showMessage('파일 업로드에 실패했습니다.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // 문서 설명 업데이트 (목업)
  const updateDocumentDescription = async (docId, description) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, description } : doc
    ));
  };

  // 문서 삭제 (목업)
  const deleteDocument = async (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    setRelationships(prev => prev.filter(rel => rel.doc1 !== docId && rel.doc2 !== docId));
    showMessage('문서가 삭제되었습니다.');
  };

  // 관계 추가 (목업)
  const addRelationship = async () => {
    if (documents.length < 2) return;

    const newRelationship = {
      id: Date.now(),
      doc1: documents[0].id,
      doc2: documents[1].id,
      relationshipType: 'concept-example',
      description: ''
    };

    setRelationships(prev => [...prev, newRelationship]);
    showMessage('새로운 관계가 추가되었습니다.');
  };

  // 관계 업데이트 (목업)
  const updateRelationship = async (id, field, value) => {
    setRelationships(prev => prev.map(rel => 
      rel.id === id ? { ...rel, [field]: value } : rel
    ));
  };

  // 관계 삭제 (목업)
  const deleteRelationship = async (id) => {
    setRelationships(prev => prev.filter(rel => rel.id !== id));
    showMessage('관계가 삭제되었습니다.');
  };

  // 에이전트 저장 (목업)
  const handleSaveAgent = async (agentKey, updatedAgent) => {
    try {
      // 프롬프트 유효성 검사
      const defaultPrompt = '새로 생성된 AI 에이전트입니다. 역할을 정의해주세요.';
      const prompt = updatedAgent.prompt?.trim();
      
      if (!prompt || prompt === defaultPrompt) {
        showMessage('시스템 프롬프트를 입력해주세요. AI 에이전트가 어떤 역할을 수행할지 구체적으로 작성해야 합니다.', 'error');
        return;
      }
      
      setSaving(true);
      
      // 목업 저장 처리
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAgents(prev => ({
        ...prev,
        [agentKey]: updatedAgent
      }));
      setEditingAgent(null);
      showMessage('에이전트 설정이 저장되었습니다.');
    } catch (err) {
      showMessage('저장에 실패했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 새 에이전트 추가
  const addNewAgent = () => {
    const newAgentId = `agent_${Date.now()}`;
    const newAgent = {
      name: '새로운 에이전트',
      avatar: '🤖',
      color: 'bg-gray-500',
      prompt: '새로 생성된 AI 에이전트입니다. 역할을 정의해주세요.',
      randomness: 0.7,
      // API 설정 (단일 키 공유)
      apiConfig: {
        useSharedKey: true,
        temperature: 0.7,
        maxTokens: 1500,
        model: 'gpt-4'
      }
    };

    setAgents(prev => ({
      ...prev,
      [newAgentId]: newAgent
    }));
    
    // 새 에이전트를 바로 편집 모드로
    setEditingAgent(newAgentId);
    showMessage('새로운 에이전트가 추가되었습니다!');
  };

  // 에이전트 삭제
  const deleteAgent = (agentKey) => {
    const agent = agents[agentKey];
    const agentName = agent?.name || '이름 없는 에이전트';
    
    if (window.confirm(`정말로 "${agentName}" 에이전트를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      setAgents(prev => {
        const newAgents = { ...prev };
        delete newAgents[agentKey];
        return newAgents;
      });
      
      // 매핑에서도 제거
      setAgentDocumentMappings(prev => {
        const newMappings = { ...prev };
        delete newMappings[agentKey];
        return newMappings;
      });
      
      if (editingAgent === agentKey) {
        setEditingAgent(null);
      }
      
      showMessage(`"${agentName}" 에이전트가 삭제되었습니다.`);
    }
  };

  // 에이전트-문서 매핑 업데이트 (목업)
  const updateAgentDocumentMapping = async (agentKey, documentIds) => {
    setAgentDocumentMappings(prev => ({
      ...prev,
      [agentKey]: documentIds
    }));
    showMessage('에이전트-문서 매핑이 업데이트되었습니다.');
  };

  // 전체 저장 (목업)
  const handleSaveAll = async () => {
    try {
      // 모든 에이전트의 프롬프트 유효성 검사
      const defaultPrompt = '새로 생성된 AI 에이전트입니다. 역할을 정의해주세요.';
      const invalidAgents = [];
      
      Object.entries(agents).forEach(([agentKey, agent]) => {
        const prompt = agent.prompt?.trim();
        if (!prompt || prompt === defaultPrompt || prompt.length < 0) {
          invalidAgents.push(agent.name || '이름 없는 에이전트');
        }
      });
      
      if (invalidAgents.length > 0) {
        showMessage(`다음 에이전트들의 시스템 프롬프트를 확인해주세요: ${invalidAgents.join(', ')}. 각 에이전트의 역할과 행동 방식을 구체적으로 작성해야 합니다.`, 'error');
        return;
      }
      
      setSaving(true);
      
      // 목업 저장 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showMessage('모든 설정이 저장되었습니다.');
    } catch (err) {
      showMessage('저장에 실패했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 드래그 앤 드롭 처리
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const relationshipTypes = {
    'concept-example': { name: '개념-예시', description: '한 문서는 개념을 설명하고, 다른 문서는 구체적인 예시를 제공' },
    'prerequisite': { name: '선행-후행', description: '한 문서를 먼저 이해해야 다른 문서를 이해할 수 있음' },
    'complementary': { name: '상호보완', description: '두 문서가 서로 다른 관점에서 같은 주제를 다룸' },
    'comparison': { name: '비교-대조', description: '두 문서의 내용을 비교하여 차이점을 파악' },
    'update': { name: '업데이트', description: '한 문서가 다른 문서의 최신 버전이거나 개선 사항' },
    'reference': { name: '참조', description: '한 문서가 다른 문서를 참고 자료로 활용' }
  };

  const getDocumentById = (id) => {
    return documents.find(doc => doc.id === id);
  };

  // 프롬프트 보강 함수
  const generateEnhancedPrompt = (agent) => {
    return agent.prompt || '';
  };

  // 메시지 컴포넌트
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

    // 기본 updateAgent 함수
    const updateAgent = useCallback((updatedAgent) => {
      setAgents(prev => ({
        ...prev,
        [agentKey]: updatedAgent
      }));
    }, [agentKey]);

    if (isEditing) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            {/* 에이전트 헤더 */}
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${agent.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {agent.avatar}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  defaultValue={agent.name || ''}
                  onBlur={(e) => updateAgent({ ...agent, name: e.target.value })}
                  className="text-xl font-bold text-gray-900 border-none outline-none bg-transparent border-b-2 border-blue-500 pb-1 w-full"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSaveAgent(agentKey, agent)}
                  disabled={saving}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                </button>
                <button
                  onClick={() => setEditingAgent(null)}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 프롬프트 편집 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">시스템 프롬프트</label>
              <textarea
                defaultValue={agent.prompt || ''}
                onFocus={(e) => {
                  const defaultPrompt = '새로 생성된 AI 에이전트입니다. 역할을 정의해주세요.';
                  if (e.target.value === defaultPrompt) {
                    e.target.value = '';
                    e.target.placeholder = '';
                  }
                }}
                onBlur={(e) => {
                  updateAgent({ ...agent, prompt: e.target.value });
                }}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${
                  agent.prompt === '새로 생성된 AI 에이전트입니다. 역할을 정의해주세요.' || !agent.prompt 
                    ? 'text-gray-400' 
                    : 'text-gray-700'
                }`}
                rows="4"
                placeholder="이 에이전트의 역할과 행동 방식을 정의하세요..."
              />
            </div>

            {/* 랜덤 지수 슬라이더 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                랜덤 지수 (창의성 수준)
                <span className="ml-2 text-blue-600 font-semibold">{(agent.randomness || 0.7).toFixed(1)}</span>
              </label>
              <div className="px-3">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={agent.randomness || 0.7}
                    onChange={(e) => updateAgent({ 
                      ...agent, 
                      randomness: parseFloat(e.target.value),
                      apiConfig: {
                        ...agent.apiConfig,
                        temperature: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(agent.randomness || 0.7) * 100}%, #E5E7EB ${(agent.randomness || 0.7) * 100}%, #E5E7EB 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>보수적 (0.0)</span>
                  <span>균형적 (0.5)</span>
                  <span>창의적 (1.0)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                낮을수록 일관되고 예측 가능한 답변, 높을수록 창의적이고 다양한 답변을 생성합니다.
              </p>
            </div>

            {/* API 설정 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">🔧 API 설정</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">모델</label>
                  <select
                    value={agent.apiConfig?.model || 'gpt-4'}
                    onChange={(e) => updateAgent({ 
                      ...agent, 
                      apiConfig: { ...agent.apiConfig, model: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">최대 토큰</label>
                  <input
                    type="number"
                    value={agent.apiConfig?.maxTokens || 1500}
                    onChange={(e) => updateAgent({ 
                      ...agent, 
                      apiConfig: { ...agent.apiConfig, maxTokens: parseInt(e.target.value) }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    min="100"
                    max="4000"
                  />
                </div>
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-blue-600">💡</span>
                  <span className="text-blue-700">
                    API 키는 공유 방식을 사용합니다. Temperature는 위의 랜덤 지수와 동기화됩니다.
                  </span>
                </div>
              </div>
            </div>

            {/* 위험 구역 - 에이전트 삭제 */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <button
                onClick={() => deleteAgent(agentKey)}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>에이전트 삭제</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    // 기본 카드 뷰 - 바로 편집 가능
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* 에이전트 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-12 h-12 ${agent.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
              {agent.avatar}
            </div>
            <div className="flex-1">
              {/* 에이전트 이름 편집 */}
              <input
                type="text"
                defaultValue={agent.name || ''}
                onBlur={(e) => updateAgent({ ...agent, name: e.target.value })}
                className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors w-full mb-2"
                placeholder="에이전트 이름을 입력하세요"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {/* 저장 버튼 */}
            <button
              onClick={() => handleSaveAgent(agentKey, agent)}
              disabled={saving}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="에이전트 저장"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            </button>
            
            <button
              onClick={() => setEditingAgent(agentKey)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="고급 설정"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* 시스템 프롬프트 편집 */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">시스템 프롬프트</div>
          <textarea
            defaultValue={agent.prompt || ''}
            onFocus={(e) => {
              const defaultPrompt = '새로 생성된 AI 에이전트입니다. 역할을 정의해주세요.';
              if (e.target.value === defaultPrompt) {
                e.target.value = '';
                e.target.placeholder = '';
              }
            }}
            onBlur={(e) => {
              updateAgent({ ...agent, prompt: e.target.value });
            }}
            className={`w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none ${
              agent.prompt === '새로 생성된 AI 에이전트입니다. 역할을 정의해주세요.' || !agent.prompt 
                ? 'text-gray-400' 
                : 'text-gray-700'
            }`}
            rows="4"
            placeholder="이 에이전트의 역할과 행동 방식을 정의하세요..."
          />
        </div>

        {/* 랜덤 지수 슬라이더 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">랜덤 지수 (창의성)</div>
            <span className="text-sm font-semibold text-blue-600">
              {(agent.randomness || 0.7).toFixed(1)}
            </span>
          </div>
          <div className="mb-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={agent.randomness || 0.7}
              onChange={(e) => updateAgent({ ...agent, randomness: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(agent.randomness || 0.7) * 100}%, #E5E7EB ${(agent.randomness || 0.7) * 100}%, #E5E7EB 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>보수적</span>
            <span>균형적</span>
            <span>창의적</span>
          </div>
        </div>
      </div>
    );
  });

  // 문서 관계 탭 컴포넌트
  const DocumentRelationTab = () => {
    // 문서 설명을 위한 로컬 상태
    const [localDescriptions, setLocalDescriptions] = useState({});

    // documents가 변경될 때 로컬 상태 초기화
    useEffect(() => {
      const newDescriptions = {};
      documents.forEach(doc => {
        newDescriptions[doc.id] = doc.description || '';
      });
      setLocalDescriptions(newDescriptions);
    }, [documents]); // eslint-disable-line react-hooks/exhaustive-deps

    // 로컬 문서 설명 업데이트 함수
    const updateLocalDescription = (docId, description) => {
      setLocalDescriptions(prev => ({
        ...prev,
        [docId]: description
      }));
      // 즉시 글로벌 상태도 업데이트
      updateDocumentDescription(docId, description);
    };

    // 관계 설정을 위한 로컬 상태
    const [localRelationships, setLocalRelationships] = useState({});

    // relationships가 변경될 때 로컬 상태 초기화
    useEffect(() => {
      const newRelationships = {};
      relationships.forEach(rel => {
        newRelationships[rel.id] = {
          description: rel.description || '',
          keywords: rel.keywords || '',
          usage_scenario: rel.usage_scenario || ''
        };
      });
      setLocalRelationships(newRelationships);
    }, [relationships]); // eslint-disable-line react-hooks/exhaustive-deps

    // 로컬 관계 정보 업데이트 함수
    const updateLocalRelationship = (id, field, value) => {
      setLocalRelationships(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value
        }
      }));
      // 즉시 글로벌 상태도 업데이트
      updateRelationship(id, field, value);
    };

    return (
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* 파일 업로드 영역 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📁 문서 업로드</h3>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 size={48} className="mx-auto text-blue-500 mb-4 animate-spin" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    파일 업로드 중...
                  </h4>
                </div>
              ) : (
                <>
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    파일을 드래그하거나 클릭하여 업로드
                  </h4>
                  <p className="text-gray-500 mb-4">
                    PDF, Word, PowerPoint, 텍스트 파일을 지원합니다
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    <Upload size={16} className="mr-2" />
                    파일 선택
                  </label>
                </>
              )}
            </div>
          </div>

          {/* 업로드된 문서 목록 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📚 업로드된 문서</h3>
              <span className="text-sm text-gray-500">{documents.length}개 문서</span>
            </div>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                업로드된 문서가 없습니다.<br />
                위에서 문서를 업로드해주세요.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <File size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                          <p className="text-sm text-gray-500">{doc.size} • {doc.uploadDate}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <textarea
                      defaultValue={localDescriptions[doc.id] || ''}
                      onBlur={(e) => updateLocalDescription(doc.id, e.target.value)}
                      placeholder="문서 설명을 입력하세요..."
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                      rows="2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 문서 간 관계 설정 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🔗 문서 간 관계</h3>
              <button
                onClick={addRelationship}
                disabled={documents.length < 2}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
                <span>관계 추가</span>
              </button>
            </div>

            {relationships.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {documents.length < 2 ? (
                  <>
                    문서 간 관계를 설정하려면 최소 2개의 문서가 필요합니다.<br />
                    먼저 문서를 업로드해주세요.
                  </>
                ) : (
                  <>
                    설정된 문서 관계가 없습니다.<br />
                    '관계 추가' 버튼을 클릭해서 문서 간의 관계를 정의해보세요.
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {relationships.map(relationship => {
                  const doc1 = getDocumentById(relationship.doc1);
                  const doc2 = getDocumentById(relationship.doc2);
                  
                  return (
                    <div key={relationship.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">문서 관계 #{relationship.id}</h4>
                        <button
                          onClick={() => deleteRelationship(relationship.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center mb-6">
                        {/* 첫 번째 문서 선택 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">첫 번째 문서</label>
                          <select
                            value={relationship.doc1}
                            onChange={(e) => updateRelationship(relationship.id, 'doc1', parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          >
                            {documents.map(doc => (
                              <option key={doc.id} value={doc.id}>{doc.name}</option>
                            ))}
                          </select>
                          {doc1 && doc1.description && (
                            <p className="text-xs text-gray-500 mt-1">{doc1.description}</p>
                          )}
                        </div>

                        {/* 관계 유형 */}
                        <div className="text-center">
                          <label className="block text-sm font-medium text-gray-700 mb-2">관계 유형</label>
                          <select
                            value={relationship.relationshipType}
                            onChange={(e) => updateRelationship(relationship.id, 'relationshipType', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          >
                            {Object.entries(relationshipTypes).map(([key, type]) => (
                              <option key={key} value={key}>{type.name}</option>
                            ))}
                          </select>
                          <div className="flex items-center justify-center mt-2">
                            <ArrowRight size={20} className="text-blue-500" />
                          </div>
                        </div>

                        {/* 두 번째 문서 선택 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">두 번째 문서</label>
                          <select
                            value={relationship.doc2}
                            onChange={(e) => updateRelationship(relationship.id, 'doc2', parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          >
                            {documents.filter(doc => doc.id !== relationship.doc1).map(doc => (
                              <option key={doc.id} value={doc.id}>{doc.name}</option>
                            ))}
                          </select>
                          {doc2 && doc2.description && (
                            <p className="text-xs text-gray-500 mt-1">{doc2.description}</p>
                          )}
                        </div>
                      </div>

                      {/* 관계 설명 - 강화된 텍스트 입력 영역 */}
                      <div className="bg-white rounded-lg p-4 border border-gray-300">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          📝 관계 상세 설명
                          <span className="text-gray-500 font-normal ml-1">
                            ({relationshipTypes[relationship.relationshipType]?.description})
                          </span>
                        </label>
                        
                        <div className="space-y-3">
                          {/* 주요 설명 입력 */}
                          <textarea
                            defaultValue={localRelationships[relationship.id]?.description || ''}
                            onBlur={(e) => updateLocalRelationship(relationship.id, 'description', e.target.value)}
                            placeholder="두 문서 간의 관계를 구체적으로 설명해주세요. 예: 사업계획서 템플릿은 개념적 프레임워크를 제시하고, 시장분석 보고서는 실제 데이터와 구체적인 사례를 제공합니다."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            rows="4"
                          />
                          
                          {/* 추가 텍스트 필드들 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">연관 키워드</label>
                              <input
                                type="text"
                                defaultValue={localRelationships[relationship.id]?.keywords || ''}
                                onBlur={(e) => updateLocalRelationship(relationship.id, 'keywords', e.target.value)}
                                placeholder="예: 사업모델, 시장분석, 경쟁우위"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">우선순위 (1-5)</label>
                              <select
                                value={relationship.priority || 3}
                                onChange={(e) => updateRelationship(relationship.id, 'priority', parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                              >
                                <option value={1}>1 (낮음)</option>
                                <option value={2}>2</option>
                                <option value={3}>3 (보통)</option>
                                <option value={4}>4</option>
                                <option value={5}>5 (높음)</option>
                              </select>
                            </div>
                          </div>

                          {/* 사용 시나리오 */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">AI 활용 시나리오</label>
                            <textarea
                              defaultValue={localRelationships[relationship.id]?.usage_scenario || ''}
                              onBlur={(e) => updateLocalRelationship(relationship.id, 'usage_scenario', e.target.value)}
                              placeholder="AI가 이 관계를 어떻게 활용할지 설명해주세요. 예: 사용자가 사업계획 관련 질문을 할 때, 템플릿의 구조를 참고하되 시장분석 보고서의 실제 데이터를 근거로 답변하도록 함"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                              rows="3"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 에이전트 문서 매핑 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 에이전트 문서 매핑</h3>
            
            {Object.keys(agents).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bot size={48} className="mx-auto text-gray-300 mb-4" />
                <p>생성된 에이전트가 없습니다.</p>
                <p className="text-sm">먼저 기본 설정에서 에이전트를 설정해주세요.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(agents).map(([agentKey, agent]) => (
                  <div key={agentKey} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 ${agent.color} rounded-lg flex items-center justify-center text-white text-lg mr-3`}>
                        {agent.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                        <p className="text-sm text-gray-600">이 에이전트가 참고할 문서들을 선택하세요</p>
                      </div>
                    </div>
                    
                    {documents.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        매핑할 문서가 없습니다. 먼저 문서를 업로드해주세요.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {documents.map(doc => {
                          const isSelected = agentDocumentMappings[agentKey]?.includes(doc.id) || false;
                          
                          return (
                            <div
                              key={doc.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                              onClick={() => {
                                const currentMappings = agentDocumentMappings[agentKey] || [];
                                const newMappings = isSelected
                                  ? currentMappings.filter(id => id !== doc.id)
                                  : [...currentMappings, doc.id];
                                updateAgentDocumentMapping(agentKey, newMappings);
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                  <File size={16} className={isSelected ? 'text-blue-600' : 'text-gray-600'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className={`font-medium text-sm truncate ${
                                    isSelected ? 'text-blue-900' : 'text-gray-900'
                                  }`}>
                                    {doc.name}
                                  </h5>
                                  <p className={`text-xs mt-1 ${
                                    isSelected ? 'text-blue-600' : 'text-gray-500'
                                  }`}>
                                    {doc.size}
                                  </p>
                                  {doc.description && (
                                    <p className={`text-xs mt-1 line-clamp-2 ${
                                      isSelected ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                      {doc.description}
                                    </p>
                                  )}
                                </div>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  isSelected 
                                    ? 'border-blue-500 bg-blue-500' 
                                    : 'border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <Check size={12} className="text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* 선택된 문서 요약 */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          선택된 문서: {agentDocumentMappings[agentKey]?.length || 0}개
                        </span>
                        {agentDocumentMappings[agentKey]?.length > 0 && (
                          <button
                            onClick={() => updateAgentDocumentMapping(agentKey, [])}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            전체 해제
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 mb-4 animate-spin" />
          <p className="text-gray-600">설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <MessageBanner />
      
      {/* 기존 Sidebar 컴포넌트 사용 */}
      <Sidebar />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between min-h-[80px]">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'basic' ? '에이전트 기본 설정' : '문서 관계 설정'}
              </h2>
              <p className="text-gray-600 mt-1">
                {activeTab === 'basic' 
                  ? '각 AI 에이전트의 성격과 전문성을 커스터마이징하세요'
                  : '참고 문서와 에이전트 간의 관계를 설정하세요'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* 탭 선택 버튼들 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'basic' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User size={16} className="inline mr-2" />
                  기본 설정
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'documents' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText size={16} className="inline mr-2" />
                  문서 관계
                </button>
              </div>
              
              <button 
                onClick={loadInitialData}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50 whitespace-nowrap"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>초기화</span>
              </button>
              <button 
                onClick={handleSaveAll}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 whitespace-nowrap"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>저장</span>
              </button>
            </div>
          </div>
        </div>

        {/* 기본 설정 탭 */}
        {activeTab === 'basic' && (
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* 새 에이전트 추가 버튼 - 에이전트가 있을 때만 표시 */}
              {Object.keys(agents).length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={addNewAgent}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>새 에이전트 추가</span>
                  </button>
                </div>
              )}
              
              {Object.keys(agents).length === 0 ? (
                <div className="text-center py-16">
                  <Bot size={64} className="mx-auto text-gray-300 mb-6" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-3">
                    생성된 에이전트가 없습니다
                  </h3>
                  <p className="text-gray-500 mb-6">
                    첫 번째 AI 에이전트를 생성하여 시작해보세요!
                  </p>
                  <button
                    onClick={addNewAgent}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Plus size={20} />
                    <span>첫 번째 에이전트 생성</span>
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
        )}

        {/* 문서 관계 탭 */}
        {activeTab === 'documents' && (
          <DocumentRelationTab />
        )}
      </div>
    </div>
  );
};

// 실제 OpenAI API 호출 함수 (사용 예시)
export const callOpenAIAPI = async (agentConfig, userMessage) => {
  // 환경변수에서 API 키 가져오기 (단일 키 사용)
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  // 강화 프롬프트 생성
  const generateEnhancedPrompt = (agent) => {
    return agent.prompt || '';
  };

  const enhancedPrompt = generateEnhancedPrompt(agentConfig);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: agentConfig.apiConfig?.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: enhancedPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: agentConfig.apiConfig?.temperature || agentConfig.randomness || 0.7,
        max_tokens: agentConfig.apiConfig?.maxTokens || 1500
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content;
  } catch (error) {
    console.error('API 호출 실패:', error);
    return null;
  }
};

export default BotSetting_menu;