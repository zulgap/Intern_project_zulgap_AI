// 에이전트 데이터 localStorage 관리 유틸리티
// 채팅 화면에서도 사용할 수 있도록 공통 함수 제공

// localStorage 키 상수
export const STORAGE_KEYS = {
  agents: 'zulgap_ai_agents',
  documents: 'zulgap_ai_documents',
  relationships: 'zulgap_ai_relationships',
  agentDocumentMappings: 'zulgap_ai_agent_document_mappings'
};

// localStorage에서 데이터 불러오기
export const loadFromStorage = (key, defaultValue = {}) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`localStorage 불러오기 실패 (${key}):`, error);
    return defaultValue;
  }
};

// localStorage에 데이터 저장하기
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`localStorage 저장 실패 (${key}):`, error);
    return false;
  }
};

// 에이전트 목록 가져오기 (채팅에서 사용)
export const getAllAgents = () => {
  return loadFromStorage(STORAGE_KEYS.agents, {});
};

// 특정 에이전트 가져오기
export const getAgentById = (agentId) => {
  const agents = getAllAgents();
  return agents[agentId] || null;
};

// 에이전트 이름 목록 가져오기 (드롭다운용)
export const getAgentNameList = () => {
  const agents = getAllAgents();
  return Object.entries(agents)
    .sort((a, b) => (b[1]?.createdAt || 0) - (a[1]?.createdAt || 0))
    .map(([id, agent]) => ({
      id,
      name: agent.name,
      avatar: agent.avatar,
      color: agent.color,
      personality: agent.personality
    }));
};

// 에이전트 존재 여부 확인
export const hasAgents = () => {
  const agents = getAllAgents();
  return Object.keys(agents).length > 0;
};

// localStorage 용량 확인 (대략적)
export const getStorageInfo = () => {
  try {
    const agents = JSON.stringify(loadFromStorage(STORAGE_KEYS.agents, {}));
    const documents = JSON.stringify(loadFromStorage(STORAGE_KEYS.documents, []));
    const relationships = JSON.stringify(loadFromStorage(STORAGE_KEYS.relationships, []));
    const mappings = JSON.stringify(loadFromStorage(STORAGE_KEYS.agentDocumentMappings, {}));
    
    const totalSize = agents.length + documents.length + relationships.length + mappings.length;
    const agentCount = Object.keys(JSON.parse(agents)).length;
    const docCount = JSON.parse(documents).length;
    
    return {
      totalSizeBytes: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      agentCount,
      documentCount: docCount,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    return {
      totalSizeBytes: 0,
      totalSizeKB: 0,
      agentCount: 0,
      documentCount: 0,
      error: error.message
    };
  }
};

// localStorage 초기화 (위험한 작업!)
export const clearAllStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.agents);
    localStorage.removeItem(STORAGE_KEYS.documents);
    localStorage.removeItem(STORAGE_KEYS.relationships);
    localStorage.removeItem(STORAGE_KEYS.agentDocumentMappings);
    return true;
  } catch (error) {
    console.error('localStorage 초기화 실패:', error);
    return false;
  }
};

// 데이터 내보내기 (JSON 다운로드)
export const exportAgentData = () => {
  try {
    const exportData = {
      agents: loadFromStorage(STORAGE_KEYS.agents, {}),
      documents: loadFromStorage(STORAGE_KEYS.documents, []),
      relationships: loadFromStorage(STORAGE_KEYS.relationships, []),
      agentDocumentMappings: loadFromStorage(STORAGE_KEYS.agentDocumentMappings, {}),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zulgap_ai_agents_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('데이터 내보내기 실패:', error);
    return false;
  }
};

// 데이터 가져오기 (JSON 업로드)
export const importAgentData = (jsonData) => {
  try {
    const importData = JSON.parse(jsonData);
    
    // 데이터 검증
    if (!importData.agents || typeof importData.agents !== 'object') {
      throw new Error('올바르지 않은 에이전트 데이터입니다.');
    }

    // 기존 데이터 백업
    const backup = {
      agents: loadFromStorage(STORAGE_KEYS.agents, {}),
      documents: loadFromStorage(STORAGE_KEYS.documents, []),
      relationships: loadFromStorage(STORAGE_KEYS.relationships, []),
      agentDocumentMappings: loadFromStorage(STORAGE_KEYS.agentDocumentMappings, {})
    };

    // 새 데이터 저장
    saveToStorage(STORAGE_KEYS.agents, importData.agents || {});
    saveToStorage(STORAGE_KEYS.documents, importData.documents || []);
    saveToStorage(STORAGE_KEYS.relationships, importData.relationships || []);
    saveToStorage(STORAGE_KEYS.agentDocumentMappings, importData.agentDocumentMappings || {});
    
    return { success: true, backup };
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
    return { success: false, error: error.message };
  }
};

// 에이전트 저장/업데이트
export const saveAgent = (agentId, agentData) => {
  try {
    const agents = getAllAgents();
    const updatedAgent = {
      ...agentData,
      id: agentId,
      updatedAt: new Date().toISOString()
    };
    
    agents[agentId] = updatedAgent;
    saveToStorage(STORAGE_KEYS.agents, agents);
    return updatedAgent;
  } catch (error) {
    console.error('에이전트 저장 실패:', error);
    return null;
  }
};

// 에이전트 삭제
export const deleteAgent = (agentId) => {
  try {
    const agents = getAllAgents();
    if (agents[agentId]) {
      delete agents[agentId];
      saveToStorage(STORAGE_KEYS.agents, agents);
      return true;
    }
    return false;
  } catch (error) {
    console.error('에이전트 삭제 실패:', error);
    return false;
  }
};
