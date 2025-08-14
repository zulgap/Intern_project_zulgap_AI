-- 🤖 봇 데이터베이스 설계
-- 이 파일은 데이터베이스의 구조를 정의해요
-- 각 테이블은 봇의 정보, 설정, 문서, 채팅 기록 등을 저장해요
-- SQLite 데이터베이스를 사용하며, 각 테이블은 봇의 기능을 지원하기 위해 설계되었어요


-- 테이블 구조는 다음과 같아요:

-- 1. 봇 기본 정보 테이블
CREATE TABLE bots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 봇의 고유 번호 (자동으로 증가)
    name TEXT NOT NULL,                    -- 봇 이름 (필수)
    description TEXT,                      -- 봇 설명
    avatar TEXT,                          -- 봇 아바타 (이모지나 이미지 경로)
    role TEXT NOT NULL,                   -- 봇의 역할 (business, tech, marketing 등)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 생성 날짜
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 수정 날짜
    is_active BOOLEAN DEFAULT 1           -- 활성화 상태 (1=활성, 0=비활성)
);

-- 2. 봇 설정 정보 테이블
CREATE TABLE bot_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 설정의 고유 번호
    bot_id INTEGER,                       -- 어떤 봇의 설정인지
    temperature REAL DEFAULT 0.7,        -- AI 창의성 정도 (0.0~1.0)
    max_tokens INTEGER DEFAULT 2000,     -- 최대 응답 길이
    system_prompt TEXT,                   -- 봇의 기본 성격/역할 설명
    model_name TEXT DEFAULT 'gpt-4o-mini',  -- 사용할 AI 모델 (OpenAI API 공식 모델명)
    FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE -- 봇이 삭제되면 설정도 삭제
);

-- 3. 문서 저장소 테이블 (모든 문서를 보관)
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 문서의 고유 번호
    file_name TEXT NOT NULL,             -- 파일 이름
    file_path TEXT,                      -- 파일이 저장된 경로
    file_size INTEGER,                   -- 파일 크기 (바이트)
    file_type TEXT,                      -- 파일 종류 (pdf, txt, docx 등)
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- 업로드 날짜
    content_summary TEXT                 -- 문서 내용 요약 (검색용)
);

-- 4. 봇-문서 관계 테이블 (봇이 어떤 문서를 사용하는지)
CREATE TABLE bot_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 관계의 고유 번호
    bot_id INTEGER,                       -- 어떤 봇인지
    document_id INTEGER,                  -- 어떤 문서인지
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- 문서가 봇에 할당된 날짜
    FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE,     -- 봇 삭제시 관계만 삭제
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE, -- 문서 삭제시 관계만 삭제
    UNIQUE(bot_id, document_id)          -- 같은 봇에게 같은 문서를 중복 할당 방지
);

-- 5. 채팅 기록 테이블
CREATE TABLE chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 채팅 기록의 고유 번호
    bot_id INTEGER,                       -- 어떤 봇과의 채팅인지
    user_message TEXT NOT NULL,          -- 사용자가 보낸 메시지
    bot_response TEXT NOT NULL,          -- 봇이 답변한 메시지
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- 채팅 시간
    FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE -- 봇이 삭제되면 채팅 기록도 삭제
);

-- 6. 인덱스 생성 (검색 속도를 빠르게 하기 위해)
CREATE INDEX idx_bots_role ON bots(role); -- 봇 역할로 검색 속도 향상
CREATE INDEX idx_chat_history_bot_id ON chat_history(bot_id); -- 채팅 기록에서 봇 ID로 검색 속도 향상
CREATE INDEX idx_bot_documents_bot_id ON bot_documents(bot_id); -- 봇-문서 관계에서 봇 ID로 검색 속도 향상
CREATE INDEX idx_bot_documents_document_id ON bot_documents(document_id); -- 봇-문서 관계에서 문서 ID로 검색 속도 향상
CREATE INDEX idx_documents_file_type ON documents(file_type); -- 문서 타입으로 검색 속도 향상
