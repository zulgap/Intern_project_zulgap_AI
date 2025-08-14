-- ⚡ 워크플로우 관리 데이터베이스 (workflows.db)
-- 워크플로우 정의, 실행 기록 관리

-- 1. 워크플로우 기본 정보
CREATE TABLE workflows (
    id TEXT PRIMARY KEY,                 -- UUID 형태의 워크플로우 고유 ID
    user_id TEXT NOT NULL,               -- 생성한 사용자 (users.db 참조)
    name TEXT NOT NULL,                  -- 워크플로우 이름
    description TEXT,                    -- 설명
    flow_definition TEXT,                -- 워크플로우 구조 (JSON 형태로 저장)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    version INTEGER DEFAULT 1           -- 버전 관리
);

-- 2. 워크플로우 실행 기록
CREATE TABLE workflow_executions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id TEXT,                    -- workflows 테이블 참조
    user_id TEXT,                        -- 실행한 사용자 (users.db 참조)
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    status TEXT DEFAULT 'running',       -- running, completed, failed, cancelled
    execution_log TEXT,                  -- 실행 로그 (JSON)
    result_data TEXT,                    -- 실행 결과 (JSON)
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);

-- 3. 인덱스
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
