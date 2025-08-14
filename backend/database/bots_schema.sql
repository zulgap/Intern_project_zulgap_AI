-- 🤖 봇 관리 데이터베이스 (bots.db)
-- 봇 정보, 설정, 채팅 기록 관리

-- 1. 봇 기본 정보
CREATE TABLE bots (
    id TEXT PRIMARY KEY,                 -- UUID 형태의 봇 고유 ID
    user_id TEXT NOT NULL,               -- 봇을 생성한 사용자 ID (users.db 참조)
    name TEXT NOT NULL,                  -- 봇 이름
    description TEXT,                    -- 봇 설명
    avatar TEXT,                         -- 봇 아바타 (이모지나 이미지 경로)
    role TEXT NOT NULL,                  -- 봇의 역할 (business, tech, marketing 등)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1          -- 활성화 상태
);

-- 2. 봇 AI 설정
CREATE TABLE bot_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bot_id TEXT,                         -- bots 테이블 참조
    temperature REAL DEFAULT 0.7,        -- AI 창의성 정도 (0.0~1.0)
    max_tokens INTEGER DEFAULT 2000,     -- 최대 응답 길이
    system_prompt TEXT,                   -- 봇의 기본 성격/역할 설명
    model_name TEXT DEFAULT 'gpt-4o-mini', -- 사용할 AI 모델
    FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE
);

-- 3. 채팅 기록
CREATE TABLE chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bot_id TEXT,                         -- bots 테이블 참조
    user_id TEXT,                        -- 채팅한 사용자 ID (users.db 참조)
    user_message TEXT NOT NULL,          -- 사용자 메시지
    bot_response TEXT NOT NULL,          -- 봇 응답
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT,                     -- 채팅 세션 구분용
    FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE
);

-- 4. 인덱스
CREATE INDEX idx_bots_user_id ON bots(user_id);
CREATE INDEX idx_bots_role ON bots(role);
CREATE INDEX idx_chat_history_bot_id ON chat_history(bot_id);
CREATE INDEX idx_chat_history_session ON chat_history(session_id);
