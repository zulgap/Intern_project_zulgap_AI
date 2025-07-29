from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()  # .env 파일에서 환경 변수 로드

openai_api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

@app.route('/')
def home():
    return '✅ 플라스크 배포 성공! 항항항'

if __name__ == '__main__':
    app.run()
