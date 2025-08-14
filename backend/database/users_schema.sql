-- 👤 사용자 관리 데이터베이스 (users.db)
-- 회원가입, 로그인, 사용자 프로필 관리

-- 1. 사용자 기본 정보
CREATE TABLE users (
    id TEXT PRIMARY KEY,                 -- UUID 형태의 사용자 고유 ID
    email TEXT UNIQUE NOT NULL,          -- 이메일 (로그인용)
    password_hash TEXT NOT NULL,         -- 암호화된 비밀번호
    name TEXT NOT NULL,                  -- 사용자 이름
    profile_image TEXT,                  -- 프로필 이미지 경로
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,         -- 계정 활성화 상태
    last_login DATETIME                  -- 마지막 로그인 시간
);

-- 2. 사용자 설정
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,                        -- users 테이블 참조
    theme TEXT DEFAULT 'light',          -- UI 테마 (light/dark)
    language TEXT DEFAULT 'ko',          -- 언어 설정
    notifications BOOLEAN DEFAULT 1,     -- 알림 설정
    timezone TEXT DEFAULT 'Asia/Seoul',  -- 시간대 설정
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
