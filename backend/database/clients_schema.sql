-- 🏢 동료사 관리 데이터베이스 (clients.db)
-- 클라이언트 정보, 프로젝트, 계약 관리

-- 1. 클라이언트 기본 정보
CREATE TABLE clients (
    id TEXT PRIMARY KEY,                 -- UUID 형태의 클라이언트 고유 ID
    user_id TEXT NOT NULL,               -- 담당자 (users.db 참조)
    company_name TEXT NOT NULL,          -- 회사명
    contact_person TEXT,                 -- 담당자 이름
    email TEXT,                          -- 연락처 이메일
    phone TEXT,                          -- 전화번호
    address TEXT,                        -- 주소
    industry TEXT,                       -- 업종
    company_size TEXT,                   -- 회사 규모 (startup, small, medium, large)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',        -- active, inactive, prospect
    notes TEXT                           -- 메모
);

-- 2. 프로젝트 정보
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT,                      -- clients 테이블 참조
    project_name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),                -- 프로젝트 예산
    status TEXT DEFAULT 'planning',      -- planning, active, completed, cancelled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 3. 계약 정보
CREATE TABLE contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT,                      -- clients 테이블 참조
    project_id INTEGER,                  -- projects 테이블 참조
    contract_number TEXT UNIQUE,         -- 계약번호
    contract_date DATE,
    contract_amount DECIMAL(12,2),       -- 계약금액
    payment_terms TEXT,                  -- 결제 조건
    contract_file_path TEXT,             -- 계약서 파일 경로
    status TEXT DEFAULT 'draft',         -- draft, active, completed, terminated
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 4. 인덱스
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
