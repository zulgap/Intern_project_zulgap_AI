import React from "react";

function LoginPage() {
  return (
    <div
      style={{
        width: "1440px",
        height: "1024px",
        position: "relative",
        background: "white",
        overflow: "hidden",
      }}
    >
      {/* 여기에 나머지 HTML 요소들이 들어갑니다 */}
      {/* 예시로 하나만 써둘게요. 나머지는 피그마에서 받은 걸 그대로 추가해 주세요. */}

      {/* 배경 이미지 또는 로고 */}
      <img
        style={{
          width: "200px",
          height: "200px",
          position: "absolute",
          top: "50px",
          left: "620px",
        }}
        src="your-logo-url.png"
        alt="로고"
      />

      {/* 로그인 입력창 예시 */}
      <input
        style={{
          position: "absolute",
          top: "300px",
          left: "520px",
          width: "400px",
          height: "50px",
          fontSize: "16px",
        }}
        type="text"
        placeholder="아이디 입력"
      />

      <input
        style={{
          position: "absolute",
          top: "370px",
          left: "520px",
          width: "400px",
          height: "50px",
          fontSize: "16px",
        }}
        type="password"
        placeholder="비밀번호 입력"
      />

      <button
        style={{
          position: "absolute",
          top: "450px",
          left: "520px",
          width: "400px",
          height: "50px",
          fontSize: "18px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => {
          // 로그인 검증 (임시로 test/test로 고정)
          const id = document.querySelector("input[type='text']").value;
          const pw = document.querySelector("input[type='password']").value;

          if (id === "test" && pw === "test") {
            alert("로그인 성공!");
            // 추후에 페이지 이동 코드도 넣을 수 있어요
          } else {
            alert("아이디 또는 비밀번호가 잘못되었습니다.");
          }
        }}
      >
        로그인
      </button>
    </div>
  );
}

export default LoginPage;
