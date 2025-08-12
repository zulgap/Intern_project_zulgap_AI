import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Plus, 
  Play, 
  Save, 
  Trash2, 
  Clock, 
  Zap, 
  Users, 
  GitBranch,
  CheckCircle,
  Bot,
  MessageSquare,
  Workflow,
  Cog,
  Download
} from 'lucide-react';

const WorkflowBuilder = () => {
  const [nodes, setNodes] = useState([
    {
      id: 1,
      type: 'start',
      title: '워크플로우 시작',
      position: { x: 100, y: 100 },
      status: 'pending'
    }
  ]);
  
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const [currentWorkflowName, setCurrentWorkflowName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);

  const workflowRef = useRef(null);

  // 에이전트 설정
  const agentTypes = {
    business: { name: '사업전략가', avatar: '👨‍💼', color: 'bg-blue-500' },
    tech: { name: '개발자', avatar: '👩‍💻', color: 'bg-green-500' },
    marketing: { name: '마케터', avatar: '📊', color: 'bg-purple-500' },
    design: { name: '디자이너', avatar: '🎨', color: 'bg-pink-500' },
    finance: { name: '재무전문가', avatar: '💰', color: 'bg-yellow-500' },
    research: { name: '리서처', avatar: '🔍', color: 'bg-indigo-500' }
  };

  // 노드 타입 정의
  const nodeTypes = {
    start: { icon: Play, color: 'bg-green-500', name: '시작' },
    agent: { icon: Bot, color: 'bg-blue-500', name: 'AI 에이전트' },
    decision: { icon: GitBranch, color: 'bg-yellow-500', name: '조건 분기' },
    trigger: { icon: Zap, color: 'bg-purple-500', name: '수동 트리거' },
    delay: { icon: Clock, color: 'bg-gray-500', name: '대기' },
    collaboration: { icon: Users, color: 'bg-indigo-500', name: '협업' },
    end: { icon: CheckCircle, color: 'bg-red-500', name: '완료' }
  };

  // 템플릿
  const templates = [
    {
      name: '카페 창업 프로세스',
      description: '아이디어부터 오픈까지 전체 과정',
      nodes: [
        { type: 'start', title: '창업 아이디어 검증' },
        { type: 'agent', title: '시장 조사', agent: 'research' },
        { type: 'end', title: '카페 오픈' }
      ]
    }
  ];

  // 연결선 추가
  const addConnection = (fromNodeId, toNodeId) => {
    const existingConnection = connections.find(
      conn => conn.from === fromNodeId && conn.to === toNodeId
    );
    
    if (!existingConnection && fromNodeId !== toNodeId) {
      const newConnection = {
        id: Date.now(),
        from: fromNodeId,
        to: toNodeId
      };
      setConnections(prev => [...prev, newConnection]);
    }
  };

  // 연결선 삭제
  const deleteConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  // 연결 모드 시작
  const startConnection = (nodeId) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
  };

  // 연결 완료
  const finishConnection = (nodeId) => {
    if (isConnecting && connectionStart && connectionStart !== nodeId) {
      addConnection(connectionStart, nodeId);
    }
    setIsConnecting(false);
    setConnectionStart(null);
  };

  // 드래그 시작
  const handleMouseDown = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (workflowRef.current) {
      const rect = workflowRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - node.position.x;
      const offsetY = e.clientY - rect.top - node.position.y;
      
      setDragOffset({ x: offsetX, y: offsetY });
      setDraggedNode(node.id);
      setIsDragging(true);
    }
  };

  // 마우스 이동
  const handleMouseMove = useCallback((e) => {
    if (isDragging && draggedNode && workflowRef.current) {
      const rect = workflowRef.current.getBoundingClientRect();
      const newX = Math.max(0, e.clientX - rect.left - dragOffset.x);
      const newY = Math.max(0, e.clientY - rect.top - dragOffset.y);
      
      setNodes(prev => prev.map(node => 
        node.id === draggedNode 
          ? { ...node, position: { x: newX, y: newY } }
          : node
      ));
    }
  }, [isDragging, draggedNode, dragOffset]);

  // 마우스 업
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedNode(null);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isDragging]);

  // 드래그 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 노드 추가
  const addNode = (type) => {
    const newNode = {
      id: Date.now(),
      type,
      title: `새로운 ${nodeTypes[type].name}`,
      position: { x: 300, y: 200 },
      status: 'pending',
      config: type === 'agent' ? { agent: 'business' } : {}
    };
    
    setNodes(prev => [...prev, newNode]);
  };

  // 노드 삭제
  const deleteNode = (nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  // 워크플로우 실행
  const executeWorkflow = () => {
    alert('워크플로우 실행 기능은 아직 개발 중입니다.');
  };

  // 노드 컴포넌트
  const NodeComponent = ({ node }) => {
    const NodeIcon = nodeTypes[node.type].icon;
    const isSelected = selectedNode?.id === node.id;
    const isBeingDragged = draggedNode === node.id;

    return (
      <div
        className={`absolute cursor-pointer transform transition-all duration-200 ${
          isSelected ? 'scale-110 z-20' : 'z-10'
        } ${isBeingDragged ? 'z-30' : ''}`}
        style={{ left: node.position.x, top: node.position.y }}
        onMouseDown={(e) => handleMouseDown(e, node)}
        onClick={(e) => {
          e.stopPropagation();
          if (!isDragging) {
            setSelectedNode(node);
          }
        }}
      >
        <div className={`
          relative p-4 rounded-lg border-2 bg-white shadow-lg min-w-[180px]
          ${isSelected ? 'border-blue-500' : 'border-gray-200'}
          ${isBeingDragged ? 'shadow-2xl scale-105' : ''}
          hover:shadow-lg transition-all duration-200
        `}>
          {/* 연결점들 */}
          {!isExecuting && (
            <>
              <div
                className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-pointer hover:bg-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isConnecting) {
                    startConnection(node.id);
                  } else {
                    finishConnection(node.id);
                  }
                }}
              />
              
              {node.type !== 'start' && (
                <div
                  className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white cursor-pointer hover:bg-green-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isConnecting) {
                      finishConnection(node.id);
                    }
                  }}
                />
              )}
            </>
          )}

          {/* 노드 헤더 */}
          <div className="flex items-center space-x-2 mb-2">
            <div className={`p-2 rounded-full ${nodeTypes[node.type].color} text-white`}>
              <NodeIcon size={16} />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {nodeTypes[node.type].name}
            </span>
          </div>

          {/* 노드 제목 */}
          <h3 className="font-semibold text-gray-800 mb-2">{node.title}</h3>

          {/* 에이전트 정보 */}
          {node.type === 'agent' && node.config?.agent && agentTypes[node.config.agent] && (
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 ${agentTypes[node.config.agent].color} rounded-full flex items-center justify-center text-white text-xs`}>
                {agentTypes[node.config.agent].avatar}
              </div>
              <span className="text-xs text-gray-600">
                {agentTypes[node.config.agent].name}
              </span>
            </div>
          )}

          {/* 삭제 버튼 */}
          {node.type !== 'start' && isSelected && !isDragging && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              className="absolute -top-2 -left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">ZULGAP.ai</h1>
        </div>

        <div className="p-4 space-y-1">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <MessageSquare size={20} className="text-gray-600" />
            <span className="text-gray-700">채팅</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Bot size={20} className="text-gray-600" />
            <span className="text-gray-700">봇과 관리</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
            <Workflow size={20} className="text-blue-600" />
            <span className="text-blue-700 font-medium">워크플로우</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Cog size={20} className="text-gray-600" />
            <span className="text-gray-700">봇 설정</span>
          </div>
        </div>

        {/* 노드 팔레트 */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">🛠️ 노드 추가</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(nodeTypes).filter(([key]) => key !== 'start').map(([key, type]) => {
              const Icon = type.icon;
              return (
                <button
                  key={key}
                  onClick={() => addNode(key)}
                  className="p-3 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg transition-colors group"
                >
                  <div className={`p-2 rounded-full ${type.color} text-white mx-auto w-8 h-8 flex items-center justify-center mb-1`}>
                    <Icon size={14} />
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-blue-600">
                    {type.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 실행 버튼 */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={executeWorkflow}
            disabled={isExecuting || nodes.length === 0}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Play size={16} />
            <span>워크플로우 실행</span>
          </button>
        </div>
      </div>

      {/* 메인 캔버스 */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              워크플로우 캔버스
            </h2>
            <span className="text-sm text-gray-600">
              노드 {nodes.length}개
            </span>
          </div>
        </div>

        <div 
          ref={workflowRef}
          className="flex-1 bg-gray-50 relative overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
          onClick={() => {
            if (isConnecting) {
              setIsConnecting(false);
              setConnectionStart(null);
            }
            setSelectedNode(null);
          }}
        >
          {/* 연결선 */}
          <svg className="absolute inset-0 pointer-events-none z-5">
            {connections.map(conn => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const fromX = fromNode.position.x + 180;
              const fromY = fromNode.position.y + 40;
              const toX = toNode.position.x;
              const toY = toNode.position.y + 40;

              return (
                <g key={conn.id}>
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#6366f1"
                    strokeWidth="3"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })}
            
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6366f1"
                />
              </marker>
            </defs>
          </svg>

          {/* 노드들 */}
          {nodes.map(node => (
            <NodeComponent key={node.id} node={node} />
          ))}

          {/* 연결 모드 안내 */}
          {isConnecting && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
              <div className="text-sm font-medium">연결 모드</div>
              <div className="text-xs">대상 노드를 클릭하거나 캔버스를 클릭하여 취소</div>
            </div>
          )}

          {/* 빈 캔버스 안내 */}
          {nodes.length === 1 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-6xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  워크플로우를 구성해보세요
                </h3>
                <p className="text-gray-500">
                  왼쪽 팔레트에서 노드를 추가하고<br />
                  노드의 파란 점을 클릭하여 연결하세요
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 노드 설정 패널 */}
        {selectedNode && (
          <div className="absolute top-20 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">노드 설정</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    setNodes(prev => prev.map(node => 
                      node.id === selectedNode.id 
                        ? { ...node, title: e.target.value }
                        : node
                    ));
                    setSelectedNode(prev => ({ ...prev, title: e.target.value }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedNode.type === 'agent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    담당 에이전트
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(agentTypes).map(([key, agent]) => (
                      <button
                        key={key}
                        onClick={() => {
                          const updatedNode = { 
                            ...selectedNode, 
                            config: { ...selectedNode.config, agent: key }
                          };
                          setNodes(prev => prev.map(node => 
                            node.id === selectedNode.id ? updatedNode : node
                          ));
                          setSelectedNode(updatedNode);
                        }}
                        className={`p-2 rounded-lg border text-left ${
                          selectedNode.config?.agent === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 ${agent.color} rounded-full flex items-center justify-center text-white text-xs`}>
                            {agent.avatar}
                          </div>
                          <span className="text-xs">{agent.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;