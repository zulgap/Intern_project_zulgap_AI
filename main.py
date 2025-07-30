from flask import Flask, send_from_directory, send_file
from dotenv import load_dotenv
import os

load_dotenv()  # .env 파일에서 환경 변수 로드

openai_api_key = os.getenv("OPENAI_API_KEY")

# React 빌드 폴더 경로 설정 (절대 경로로 수정)
build_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'zulgap-ai-intern-project', 'build')
app = Flask(__name__, static_folder=build_path, static_url_path='')

@app.route('/api/health')
def health_check():
    """API 상태 확인"""
    return '✅ 플라스크 API 정상 작동!'

@app.route('/')
def serve_react_app():
    """React 로그인 페이지를 서빙합니다"""
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        return f"Error serving React app: {str(e)}<br>Static folder: {app.static_folder}<br>Build path: {build_path}"

@app.route('/<path:path>')
def serve_react_routes(path):
    """React의 모든 라우트를 처리합니다"""
    # React의 static 파일들을 서빙
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # React 앱의 index.html로 라우팅 (SPA 라우팅)
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
