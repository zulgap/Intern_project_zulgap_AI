from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '✅ 플라스크 배포 성공!'

if __name__ == '__main__':
    app.run()
