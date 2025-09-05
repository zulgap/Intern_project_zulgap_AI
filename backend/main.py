"""
ZULGAP AI 인턴 프로젝트 - 백엔드 API 서버
Flask 기반 API 서버로 React 프론트엔드와 연동
"""

from flask import Flask, send_from_directory, jsonify, request
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))  # backend/ 경로 추가
# bot_db.py에서 CRUD 함수 임포트
import bot_db
from dotenv import load_dotenv
from openai import OpenAI
import json
from memory import ensure_schema, get_context_for_prompt, add_task, update_task_status, add_task_note, upsert_session_summary
from memory import get_context_for_prompt  # ✅ 요약 컨텍스트 불러오기


# 환경 변수 로드
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# 💡 팀장 에이전트 OpenAI 모델명 환경변수
MODEL_NAME = os.getenv("TEAMLEAD_MODEL", "gpt-4o")
FINAL_MODEL_NAME = os.getenv("TEAMLEAD_FINAL_MODEL", MODEL_NAME)
MAX_COMPLETION_TOKENS = int(os.getenv("TEAMLEAD_MAX_TOKENS", "1200"))

# 팀장 에이전트의 경량 메모리 정책 (짧게 저장, JSON 이벤트만)
MEMORY_POLICY = (
    "메모리를 절약하세요. 긴 원문은 저장하지 말고 링크(artifact_url)만 남기고, "
    "요약은 짧게(결과 3~5줄, 피드백 1~3줄, 할당 한 줄)로 유지합니다. "
    "필요할 때 아래 형식 중 하나의 JSON을 (텍스트 답변과 별개로) 0~1개 포함하세요:\n"
    "{ \"event\": \"DELEGATION\", \"task_title\": \"...\", \"assignee\": \"...\", \"summary\": \"한 줄\" }\n"
    "{ \"event\": \"RESULT\", \"task_id\": 123, \"summary\": \"3~5줄\", \"artifact_url\": \"http(s)://...\" }\n"
    "{ \"event\": \"FEEDBACK\", \"task_id\": 123, \"summary\": \"핵심 1~3개\" }\n"
    "{ \"event\": \"SESSION_SUMMARY\", \"session_id\": \"...\", \"summary\": \"200~300자\" }\n"
    "가능하면 JSON만 출력해도 됩니다. JSON은 최대 한 개만 출력하세요."
)


# ✅ 팀장 프롬프트 로더 (content_agent_prompts.json에서 system_prompt 읽기)
POLICY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'content_agent_prompts.json')
try:
    with open(POLICY_PATH, 'r', encoding='utf-8') as f:
        TEAMLEAD_SYSTEM_PROMPT = json.load(f).get('system_prompt', '당신은 팀장 에이전트입니다.')
    print("✅ TEAMLEAD_SYSTEM_PROMPT 로드 완료:", POLICY_PATH)
except Exception as e:
    print("⚠️ TEAMLEAD_SYSTEM_PROMPT 로드 실패:", e)
    TEAMLEAD_SYSTEM_PROMPT = '당신은 팀장 에이전트입니다.'  # 안전한 기본값


# OpenAI 클라이언트 초기화
client = OpenAI(api_key=openai_api_key) if openai_api_key else None

# React 빌드 폴더 경로 설정
build_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'build')

# Flask 앱 초기화
app = Flask(__name__, static_folder=build_path, static_url_path='')
app.config['JSON_AS_ASCII'] = False  # 한글 지원

# DB 테이블 초기화 (없으면 자동 생성)
try:
    bot_db.init_db()
    print("DB init success")
except Exception as e:
    print("DB init error:", e)

ensure_schema()  # 메모리 테이블 생성
# =============================================================================
# API 엔드포인트
# =============================================================================

# -----------------------------------------------------------------------------
# [1] 봇(에이전트) CRUD API 엔드포인트
# -----------------------------------------------------------------------------

@app.route('/api/bots', methods=['GET'])
def get_all_bots_api():
    """
    모든 봇(에이전트) 목록을 조회하는 API
    프론트엔드에서 봇 리스트를 불러올 때 사용
    """
    try:
        bots = bot_db.get_all_bots()
        return jsonify({'bots': bots})
    except Exception as e:
        return jsonify({'error': f'봇 목록 조회 중 오류: {str(e)}'}), 500


@app.route('/api/bots/<int:bot_id>', methods=['GET'])
def get_bot_by_id_api(bot_id):
    """
    특정 봇(에이전트) 정보를 ID로 조회하는 API
    """
    try:
        bot = bot_db.get_bot_by_id(bot_id)
        if bot:
            return jsonify({'bot': bot})
        else:
            return jsonify({'error': '해당 ID의 봇을 찾을 수 없습니다.'}), 404
    except Exception as e:
        return jsonify({'error': f'봇 조회 중 오류: {str(e)}'}), 500


@app.route('/api/bots', methods=['POST'])
def create_bot_api():
    """
    새로운 봇(에이전트)을 생성하는 API
    프론트엔드에서 봇 추가 시 사용
    """
    try:
        data = request.get_json() or {}

        # 필수 필드 확인
        name = data.get('name')
        prompt = data.get('prompt')
        if not name or not prompt:
            return jsonify({'error': 'name과 prompt는 필수입니다.'}), 400

        # bot_db.create_bot()은 '딕셔너리' 1개를 받습니다.
        new_bot = {
            'name': name,
            'avatar': data.get('avatar'),
            'color': data.get('color'),
            'personality': data.get('personality'),
            'response_length': data.get('response_length'),
            'expertise': data.get('expertise') or [],
            'prompt': prompt,
            'randomness': data.get('randomness'),
            'api_config': data.get('api_config')
        }

        bot_id = bot_db.create_bot(new_bot)
        return jsonify({'id': bot_id, 'message': '봇이 성공적으로 생성되었습니다.'}), 201

    except Exception as e:
        return jsonify({'error': f'봇 생성 중 오류: {str(e)}'}), 500
    

@app.route('/api/bots/<int:bot_id>', methods=['PUT'])
def update_bot_api(bot_id):
    """
    기존 봇(에이전트) 정보를 수정하는 API
    프론트엔드에서 봇 정보 수정 시 사용
    """
    try:
        data = request.get_json() or {}

        name = data.get('name')
        prompt = data.get('prompt')
        if not name or not prompt:
            return jsonify({'error': 'name과 prompt는 필수입니다.'}), 400

        updated_bot = {
            'name': name,
            'avatar': data.get('avatar'),
            'color': data.get('color'),
            'personality': data.get('personality'),
            'response_length': data.get('response_length'),
            'expertise': data.get('expertise') or [],
            'prompt': prompt,
            'randomness': data.get('randomness'),
            'api_config': data.get('api_config')
        }

        # bot_db.update_bot는 반환값이 없습니다. 호출만 해도 업데이트 수행.
        bot_db.update_bot(bot_id, updated_bot)
        return jsonify({'message': '봇 정보가 성공적으로 수정되었습니다.'})

    except Exception as e:
        return jsonify({'error': f'봇 수정 중 오류: {str(e)}'}), 500



@app.route('/api/bots/<int:bot_id>', methods=['DELETE'])
def delete_bot_api(bot_id):
    """
    기존 봇(에이전트)을 삭제하는 API
    프론트엔드에서 봇 삭제 시 사용
    """
    try:
        deleted = bot_db.delete_bot(bot_id)
        if deleted:
            return jsonify({'message': '봇이 성공적으로 삭제되었습니다.'})
        else:
            return jsonify({'error': '해당 ID의 봇을 찾을 수 없습니다.'}), 404
    except Exception as e:
        return jsonify({'error': f'봇 삭제 중 오류: {str(e)}'}), 500

@app.route('/api/health')
def health_check():
    """서버 상태 확인용 헬스체크 API (Render 배포 확인용)"""
    return jsonify({
        'status': 'healthy',
        'message': '✅ ZULGAP AI 백엔드 서버 정상 작동!',
        'openai_configured': client is not None,
        'model' : MODEL_NAME
    })


@app.route('/api/chat', methods=['POST'])
def chat_api():
    """채팅 API - OpenAI와 연동하여 AI 응답 생성"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        step = data.get('step', 1)  # ✅ 기본값은 1, 프론트에서 안주면 그냥 1단계 처리
        session_id = data.get('session_id', 'default')

        if not user_message:
            return jsonify({'error': '메시지가 비어있습니다.'}), 400
            
        if not client:
            return jsonify({'error': 'OpenAI API 키가 설정되지 않았습니다.'}), 500

        # ✅ 모델 선택 로직
        model_to_use = FINAL_MODEL_NAME if step == 5 else MODEL_NAME

        # ✅ 짧은 컨텍스트 요약 가져오기
        context_block = get_context_for_prompt(session_id)

        # ✅ 프롬프트에 주입
        messages_payload = [
            {"role": "system", "content": TEAMLEAD_SYSTEM_PROMPT},
            {"role": "system", "content": MEMORY_POLICY},
            {"role": "system", "content": f"컨텍 스트(요약):\n{context_block}"},
            {"role": "user",   "content": user_message}
        ]

        print("[/api/chat] model =", model_to_use)
        print("[/api/chat] TEAMLEAD_SYSTEM_PROMPT len =", len(TEAMLEAD_SYSTEM_PROMPT))
        print("[/api/chat] messages_payload_len =", len(messages_payload))


        # OpenAI API 호출
        response = client.chat.completions.create(
            model=model_to_use,
            messages=messages_payload,
            max_completion_tokens = MAX_COMPLETION_TOKENS ## 토큰 수 조절은 .env에서
        )

        ai_response = response.choices[0].message.content

        return jsonify({
            'response': ai_response,
            'used_model': model_to_use,  # ✅ 디버깅용으로 응답에 모델도 넣어줌
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