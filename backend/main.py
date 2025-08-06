"""
ZULGAP AI 인턴 프로젝트 - 백엔드 API 서버
Flask 기반 API 서버로 React 프론트엔드와 연동
"""

from flask import Flask, send_from_directory, jsonify, request
from dotenv import load_dotenv
import os
from openai import OpenAI

# 환경 변수 로드
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=openai_api_key) if openai_api_key else None

# React 빌드 폴더 경로 설정
build_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'build')

# Flask 앱 초기화
app = Flask(__name__, static_folder=build_path, static_url_path='')
app.config['JSON_AS_ASCII'] = False  # 한글 지원


# =============================================================================
# API 엔드포인트
# =============================================================================

@app.route('/api/health')
def health_check():
    """서버 상태 확인용 헬스체크 API (Render 배포 확인용)"""
    return jsonify({
        'status': 'healthy',
        'message': '✅ ZULGAP AI 백엔드 서버 정상 작동!',
        'openai_configured': client is not None
    })


@app.route('/api/chat', methods=['POST'])
def chat_api():
    """채팅 API - OpenAI와 연동하여 AI 응답 생성"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': '메시지가 비어있습니다.'}), 400
            
        if not client:
            return jsonify({'error': 'OpenAI API 키가 설정되지 않았습니다.'}), 500
        
        # OpenAI API 호출
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "당신은 ZULGAP AI 어시스턴트입니다. 친근하고 도움이 되는 응답을 해주세요."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        return jsonify({
            'response': ai_response,
            'timestamp': os.environ.get('TZ', 'Asia/Seoul')
        })
        
    except Exception as e:
        return jsonify({'error': f'AI 응답 생성 중 오류가 발생했습니다: {str(e)}'}), 500


# =============================================================================
# React 앱 서빙 (정적 파일 제공)
# =============================================================================

@app.route('/')
def serve_react_app():
    """React 앱의 메인 페이지 제공"""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def serve_react_routes(path):
    """React Router 경로 처리 - SPA 라우팅 지원"""
    file_path = os.path.join(app.static_folder, path)
    
    # 실제 파일이 존재하면 해당 파일 제공 (CSS, JS, 이미지 등)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)
    
    # 그 외 모든 경로는 React Router가 처리하도록 index.html 제공
    return send_from_directory(app.static_folder, 'index.html')


# =============================================================================
# 서버 실행
# =============================================================================

if __name__ == '__main__':
    """로컬 개발용 서버 실행 (Render에서는 gunicorn 사용)"""
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_ENV") == "development"
    
    print(f"🚀 ZULGAP AI 백엔드 서버 시작")
    print(f"📍 포트: {port}")
    print(f"🔧 디버그 모드: {debug_mode}")
    print(f"🤖 OpenAI 설정: {'✅' if client else '❌'}")
    
    app.run(
        host="0.0.0.0", 
        port=port,
        debug=debug_mode
    )