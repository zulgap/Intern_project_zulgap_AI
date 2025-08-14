-- 🔗 매핑 관리 데이터베이스 (mappings.db)
-- 서로 다른 데이터베이스 간의 관계를 관리하는 핵심 데이터베이스
-- 이 파일이 봇↔문서, 워크플로우↔봇 등의 연결을 담당해요!

-- 1. 봇-문서 매핑 (가장 중요!)
CREATE TABLE bot_document_mappings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bot_id TEXT NOT NULL,                -- bots.db의 bots 테이블 참조
    document_id TEXT NOT NULL,           -- documents.db의 documents 테이블 참조
    user_id TEXT NOT NULL,               -- 매핑을 생성한 사용자 (users.db 참조)
    mapped_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 매핑 생성 시간
    priority INTEGER DEFAULT 1,          -- 문서 우선순위 (1=높음, 5=낮음)
    is_active BOOLEAN DEFAULT 1,         -- 매핑 활성화 상태
    notes TEXT,                          -- 매핑에 대한 메모
    UNIQUE(bot_id, document_id)          -- 같은 봇에 같은 문서 중복 매핑 방지
);

-- 2. 워크플로우-봇 매핑
CREATE TABLE workflow_bot_mappings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id TEXT NOT NULL,           -- workflows.db 참조
    bot_id TEXT NOT NULL,                -- bots.db 참조
    user_id TEXT NOT NULL,               -- users.db 참조
    step_order INTEGER,                  -- 워크플로우에서의 봇 실행 순서
    mapped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    step_config TEXT,                    -- 각 단계별 설정 (JSON 형태)
    UNIQUE(workflow_id, bot_id, step_order)
);

-- 3. 사용자-봇 권한 매핑
CREATE TABLE user_bot_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,               -- users.db 참조
    bot_id TEXT NOT NULL,                -- bots.db 참조
    permission_type TEXT NOT NULL,        -- 'owner', 'editor', 'viewer'
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    granted_by TEXT,                     -- 권한을 부여한 사용자 ID
    is_active BOOLEAN DEFAULT 1,
    UNIQUE(user_id, bot_id)
);

-- 4. 클라이언트-프로젝트 매핑
CREATE TABLE client_project_mappings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT NOT NULL,             -- clients.db 참조
    project_name TEXT NOT NULL,
    assigned_bots TEXT,                  -- 할당된 봇들의 ID 목록 (JSON 배열)
    assigned_workflows TEXT,             -- 할당된 워크플로우 ID 목록 (JSON 배열)
    user_id TEXT NOT NULL,               -- 담당자 (users.db 참조)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

-- 5. 인덱스 (검색 속도 향상)
CREATE INDEX idx_bot_doc_mappings_bot ON bot_document_mappings(bot_id);
CREATE INDEX idx_bot_doc_mappings_doc ON bot_document_mappings(document_id);
CREATE INDEX idx_bot_doc_mappings_user ON bot_document_mappings(user_id);
CREATE INDEX idx_workflow_bot_mappings_workflow ON workflow_bot_mappings(workflow_id);
CREATE INDEX idx_workflow_bot_mappings_bot ON workflow_bot_mappings(bot_id);
CREATE INDEX idx_user_bot_permissions_user ON user_bot_permissions(user_id);
CREATE INDEX idx_user_bot_permissions_bot ON user_bot_permissions(bot_id);
