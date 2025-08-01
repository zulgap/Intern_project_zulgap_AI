import React, { useState } from 'react';

function LoginPage() {
  // 이메일, 비밀번호, 로그인 상태 유지 여부를 상태로 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  // 로그인 버튼 클릭 시 처리 로직 (submit 기본 동작 방지)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 로그인 검증
    if (email === 'test' && password === 'test') {
      console.log('로그인 성공!');
      
      // 로그인 상태 유지 옵션 처리
      if (keepLoggedIn) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
      } else {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
      }
      
      // 채팅 페이지로 이동 (환경에 따라 자동 URL 설정)
      window.location.href = '/api/chat';
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* 로고 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black">ZULGAP.ai</h1>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 이메일 입력 */}
          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block mx-auto w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-gray-700 placeholder-gray-500"
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-gray-700 placeholder-gray-500"
              required
            />
          </div>

          {/* 로그인 상태 유지 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="keepLoggedIn"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="mr-3 w-5 h-5 text-gray-600 bg-white border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
            />
            <label htmlFor="keepLoggedIn" className="text-gray-600 text-sm">
              로그인 상태 유지
            </label>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-full transition duration-200 ease-in-out"
          >
            로그인
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-gray-600 text-sm">
            <span className="hover:underline cursor-pointer">
              비밀번호 찾기
            </span>
            <span className="text-gray-400">|</span>
            <span className="hover:text-gray-800 transition duration-200 cursor-pointer">
              아이디 찾기
            </span>
            <span className="text-gray-400">|</span>
            <span className="hover:text-gray-800 transition duration-200 cursor-pointer">
              회원가입
            </span>
            <div className="bg-red-500">뷁뷁</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
