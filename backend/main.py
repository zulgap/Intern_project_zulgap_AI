from flask import Flask, send_from_directory
from dotenv import load_dotenv
import os
import json
from openai import OpenAI

load_dotenv()  # .env 파일에서 환경 변수 로드
openai_api_key = os.getenv("OPENAI_API_KEY")

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=openai_api_key)

# React 빌드 폴더 경로 설정 (절대 경로)
build_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'build')

# static_url_path를 빈 문자열로 설정하여 모든 경로를 React가 처리하게 함
app = Flask(__name__, static_folder=build_path, static_url_path='')
app.config['JSON_AS_ASCII'] = False  # 한글 깨짐 방지



# 건강 체크 API (Render 헬스체크용)
@app.route('/api/health')
def health_check():
    return '✅ 플라스크 API 정상 작동!'

# 채팅 화면 테스트
@app.route('/api/chat')
def chat():
    return send_from_directory(app.static_folder, 'chat.html')

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
    # 개발용: 실시간 코드 변경 반영
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)