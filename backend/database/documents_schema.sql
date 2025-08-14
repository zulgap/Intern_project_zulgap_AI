-- 📄 문서 관리 데이터베이스 (documents.db)
-- 업로드된 모든 문서와 메타데이터 관리

-- 1. 문서 저장소
CREATE TABLE documents (
    id TEXT PRIMARY KEY,                 -- UUID 형태의 문서 고유 ID
    user_id TEXT NOT NULL,               -- 문서를 업로드한 사용자 ID (users.db 참조)
    file_name TEXT NOT NULL,             -- 원본 파일 이름
    file_path TEXT NOT NULL,             -- 서버에 저장된 파일 경로
    file_size INTEGER,                   -- 파일 크기 (바이트)
    file_type TEXT,                      -- 파일 확장자 (pdf, txt, docx 등)
    mime_type TEXT,                      -- MIME 타입
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    content_summary TEXT,                -- 문서 내용 요약 (AI로 생성)
    extracted_text TEXT,                 -- 문서에서 추출한 텍스트
    is_processed BOOLEAN DEFAULT 0,      -- AI 분석 완료 여부
    processing_status TEXT DEFAULT 'pending' -- pending, processing, completed, error
);

-- 2. 문서 태그 (분류용)
CREATE TABLE document_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT,                    -- documents 테이블 참조
    tag_name TEXT NOT NULL,              -- 태그 이름 (예: "계약서", "기술문서", "마케팅" 등)
    confidence REAL DEFAULT 1.0,        -- AI가 자동 태깅한 경우의 신뢰도
    created_by TEXT,                     -- 태그를 생성한 방식 ('user' 또는 'ai')
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- 3. 문서 검색용 키워드
CREATE TABLE document_keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT,                    -- documents 테이블 참조
    keyword TEXT NOT NULL,               -- 검색 키워드
    relevance REAL DEFAULT 1.0,          -- 키워드 관련성 점수
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- 4. 인덱스
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_file_type ON documents(file_type);
CREATE INDEX idx_documents_status ON documents(processing_status);
CREATE INDEX idx_document_tags_name ON document_tags(tag_name);
CREATE INDEX idx_document_keywords_keyword ON document_keywords(keyword);
