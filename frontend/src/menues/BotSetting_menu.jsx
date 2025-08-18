import React, { useState, useEffect, useCallback } from 'react';
// Lucide icon imports removed. Use only inline SVGs for icons as per project rules.


import AgentCard from './AgentCard';
import Sidebar from '../components/Sidebar';


// ====== 인라인 SVG 아이콘 컴포넌트 및 더미 함수/변수 정의 (실제 로직 필요시 구현) ======
const Loader2 = () => (<svg className="animate-spin" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="4" strokeDasharray="60" strokeDashoffset="20"/></svg>);
const Upload = () => (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 16V4M12 4l-5 5M12 4l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);
const File = () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 4v16h16V8l-6-4H4z" stroke="currentColor" strokeWidth="2"/></svg>);
const Trash2 = () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" stroke="currentColor" strokeWidth="2"/></svg>);
const Plus = () => (<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);
const ArrowRight = () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const User = () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" stroke="currentColor" strokeWidth="2"/></svg>);
const FileText = () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="2"/></svg>);
const RefreshCw = () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 5.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="2"/></svg>);
const Save = () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" stroke="currentColor" strokeWidth="2"/><path d="M17 21v-8H7v8" stroke="currentColor" strokeWidth="2"/><path d="M7 3v5h8" stroke="currentColor" strokeWidth="2"/></svg>);
const Bot = () => (<svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="8" y="16" width="32" height="24" rx="8" stroke="currentColor" strokeWidth="2"/><circle cx="16" cy="28" r="2" fill="currentColor"/><circle cx="32" cy="28" r="2" fill="currentColor"/><rect x="20" y="36" width="8" height="4" rx="2" fill="currentColor"/></svg>);
const Check = () => (<svg width="12" height="12" fill="none" viewBox="0 0 16 16"><path d="M4 8.5l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);

const updateDocumentDescription = () => {};
const updateRelationship = () => {};
const handleDrop = () => {};
const handleDragOver = () => {};
const handleDragLeave = () => {};
const deleteDocument = () => {};
const addRelationship = () => {};
const getDocumentById = () => {};
const deleteRelationship = () => {};
const relationshipTypes = { example: { name: '예시', description: '예시 설명' } };
const updateAgentDocumentMapping = () => {};
const loadInitialData = () => {};
const handleSaveAll = () => {};
const addNewAgent = () => {};
const handleSaveAgent = () => {};
const deleteAgent = () => {};
const responseLengthOptions = { brief: { name: '간결', description: '짧고 명확' }, medium: { name: '중간', description: '적당한 길이' }, detailed: { name: '상세', description: '자세하고 풍부' } };
const generateEnhancedPrompt = () => '';
const MessageBanner = () => null;


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
  // 에이전트 목록을 배열로 관리 (DB 연동)
  const [agents, setAgents] = useState([]); // [{id, name, ...}]
  const [agentDocumentMappings, setAgentDocumentMappings] = useState({});


  // 컴포넌트가 처음 마운트될 때 DB에서 에이전트 목록을 불러옴
  useEffect(() => {
    fetchAgents();
  }, []);

  // 실제 DB에서 에이전트 목록을 불러오는 함수
  async function fetchAgents() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/bots');
      const data = await res.json();
      if (data.bots) {
        setAgents(data.bots); // 배열로 저장
      } else {
        setAgents([]);
      }
    } catch (err) {
      setError('에이전트 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  // 에러/성공 메시지 표시
  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 5000);
    }
  };

  // 파일 업로드 처리 (목업)
  const handleFileUpload = async (files) => {
    try {
      setUploading(true);
      // 파일 업로드 로직을 여기에 구현 (현재는 목업)
      // 예: await uploadFilesToServer(files);
    } catch (err) {
      setError('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  }

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
              {/* DB에서 불러온 에이전트 배열을 순회하며 카드 렌더링 */}
              {agents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  editingAgent={editingAgent}
                  setEditingAgent={setEditingAgent}
                  saving={saving}
                  handleSaveAgent={handleSaveAgent}
                  deleteAgent={deleteAgent}
                  responseLengthOptions={responseLengthOptions}
                  generateEnhancedPrompt={generateEnhancedPrompt}
                />
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
  
  // 성격과 스타일이 반영된 강화 프롬프트 생성
  const generateEnhancedPrompt = (agent) => {
    const personalityPrompts = {
      conservative: "신중하고 안정적인 접근을 취하며, 검증된 정보와 기존의 모범 사례를 중시합니다. 리스크를 최소화하고 단계적인 해결책을 제시합니다.",
      balanced: "현실적이고 실용적인 관점에서 균형 잡힌 답변을 제공합니다. 다양한 관점을 고려하며 상황에 맞는 최적의 해결책을 찾습니다.",
      innovative: "창의적이고 도전적인 접근을 통해 새로운 아이디어와 혁신적인 해결책을 제시합니다. 기존 관습에 얽매이지 않고 참신한 관점을 제공합니다.",
      creative: "독창적이고 유연한 사고로 창의적인 아이디어를 생성합니다. 상상력을 발휘하여 예술적이고 혁신적인 접근법을 제안합니다.",
      analytical: "데이터와 논리에 기반한 체계적인 분석을 통해 객관적이고 정확한 답변을 제공합니다. 근거를 명확히 제시하며 논리적 추론을 중시합니다."
    };

    const responseStylePrompts = {
      brief: "핵심 내용만을 간결하고 명확하게 전달합니다. 불필요한 설명은 생략하고 요점만 정리하여 답변합니다.",
      medium: "필요한 내용을 적절한 수준으로 설명합니다. 중요한 배경 정보와 구체적인 예시를 포함하여 이해하기 쉽게 답변합니다.",
      detailed: "주제에 대해 포괄적이고 상세한 설명을 제공합니다. 관련 배경, 세부 사항, 다양한 예시, 추가 고려사항까지 포함하여 깊이 있게 답변합니다."
    };

    const basePrompt = agent.prompt || '';
    const personalityAddition = personalityPrompts[agent.personality] || '';
    const styleAddition = responseStylePrompts[agent.responseLength] || '';

    let enhancedPrompt = basePrompt;
    
    if (personalityAddition) {
      enhancedPrompt += `\n\n[성격 특성]\n${personalityAddition}`;
    }
    
    if (styleAddition) {
      enhancedPrompt += `\n\n[답변 스타일]\n${styleAddition}`;
    }

    if (agent.expertise && agent.expertise.length > 0) {
      enhancedPrompt += `\n\n[전문 분야]\n당신은 ${agent.expertise.join(', ')} 분야의 전문가입니다.`;
    }

    return enhancedPrompt.trim();
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