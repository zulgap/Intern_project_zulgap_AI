// 워크 플로우 메뉴

import React, { useState } from 'react';

const steps = ['리서처', '플래너', '비주얼', '퍼블리셔'];

export default function WorkflowPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [botMessages, setBotMessages] = useState(['안녕하세요! 주제를 입력하고 시작하세요.']);
  const [feedback, setFeedback] = useState('');

  const handleStart = () => {
    setCurrentStep(1);
    setBotMessages(['리서처 봇이 시작되었습니다. 문서 분석을 진행합니다.']);
  };

  const handleSend = () => {
    setBotMessages((msgs) => [...msgs, feedback]);
    setFeedback('');
    
    // 다음 단계로 진행
    if (currentStep < steps.length) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        if (currentStep + 1 < steps.length) {
          setBotMessages([`${steps[currentStep + 1]} 봇이 시작되었습니다. 작업을 진행합니다.`]);
        }
      }, 1000); // 1초 후 다음 단계로 진행
    }
    
    // 여기서 API 호출 후 결과 받아서 botMessages에 추가하는 로직 필요
  };

  return (
    <div className="max-w-6xl mx-auto font-sans p-5">
      {/* Step Progress */}
      <div className="flex justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={idx} className="text-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto ${
                idx === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : idx < currentStep 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {idx < currentStep ? '✓' : step[0]}
            </div>
            <div className={`mt-2 ${idx <= currentStep ? 'text-blue-600' : 'text-gray-600'}`}>{step}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {currentStep === 0 && (
        <div className="text-center">
          <h1 className="text-blue-600 text-3xl font-bold mb-10">블로그 자동 작성 워크플로우 시작</h1>
          <input
            type="text"
            placeholder="주제를 입력하세요 (예: 친환경 도시 설계)"
            className="w-full max-w-2xl h-12 rounded-lg border border-gray-300 px-3 text-base mt-10"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <br />
          <button className="mt-5 w-full max-w-2xl h-12 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
            참고 문서 업로드 또는 URL 입력
          </button>
          <br />
          <button
            className="mt-10 w-48 h-12 bg-blue-600 text-white rounded-full border-none cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStart}
            disabled={!userInput}
          >
            시작하기
          </button>
        </div>
      )}

      {(currentStep > 0 && currentStep < steps.length) && (
        <div className="max-w-4xl mx-auto">
          <div className="min-h-96 bg-gray-100 rounded-2xl p-5 overflow-y-auto">
            {botMessages.map((msg, idx) => (
              <div
                key={idx}
                className="bg-gray-100 rounded-2xl p-4 mb-3 text-left text-gray-900"
              >
                {msg}
              </div>
            ))}
          </div>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-gray-300 mt-4 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="답변을 수정하거나 피드백을 입력하세요..."
          />
          <div className="mt-3 flex gap-3">
            <button
              className="flex-1 bg-transparent border border-blue-600 rounded-lg text-blue-600 cursor-pointer h-10 hover:bg-blue-50 transition-colors"
              onClick={() => alert('수정 요청 기능 구현 필요')}
            >
              수정 요청
            </button>
            <button
              className="flex-1 bg-transparent border border-blue-600 rounded-lg text-blue-600 cursor-pointer h-10 hover:bg-blue-50 transition-colors"
              onClick={() => alert('다시 생성 기능 구현 필요')}
            >
              다시 생성
            </button>
            <button
              className="bg-blue-600 text-white border-none rounded-lg px-6 cursor-pointer h-10 hover:bg-blue-700 transition-colors"
              onClick={handleSend}
            >
              전송
            </button>
          </div>
        </div>
      )}

      {currentStep === steps.length && (
        <div className="text-center mt-24">
          <div className="text-6xl text-blue-600 mb-6">✓</div>
          <h2 className="text-blue-600 text-3xl font-bold mb-4">블로그 게시가 완료되었습니다!</h2>
          <a 
            href="https://www.youtube.com/watch?v=p7dBBJ79OTs" 
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/watch?v=p7dBBJ79OTs
          </a>
          <br />
          <button
            className="mt-10 w-48 h-12 bg-blue-600 text-white rounded-full border-none cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={() => {
              setCurrentStep(0);
              setUserInput('');
              setBotMessages(['안녕하세요! 주제를 입력하고 시작하세요.']);
            }}
          >
            새 글 작성하기
          </button>
        </div>
      )}
    </div>
  );
}
