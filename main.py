from flask import Flask, send_from_directory
from dotenv import load_dotenv
import os

load_dotenv()  # .env 파일에서 환경 변수 로드
openai_api_key = os.getenv("OPENAI_API_KEY")

# React 빌드 폴더 경로 설정 (절대 경로)
build_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'zulgap-ai-intern-project', 'build')

# static_url_path를 빈 문자열로 설정하여 모든 경로를 React가 처리하게 함
app = Flask(__name__, static_folder=build_path, static_url_path='')

# 건강 체크 API (Render 헬스체크용)
@app.route('/api/health')
def health_check():
    return '✅ 플라스크 API 정상 작동!'

# 채팅 화면 API (단순 테스트 용)
@app.route('/api/chat')
def chat_check():
    return '✅ 여기에 채팅 화면이 표시됩니다.'

# React 앱 기본 페이지
@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

# React 라우팅 처리 (e.g. /login, /dashboard 등)
@app.route('/<path:path>')
def serve_react_routes(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# 로컬 실행용 (Render에선 gunicorn이 실행)
if __name__ == '__main__':
    app.run(debug=True)
