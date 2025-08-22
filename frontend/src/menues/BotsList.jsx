import React, { useEffect, useState } from "react";

export default function BotsList() {
  const [bots, setBots] = useState([]);
  const [status, setStatus] = useState("불러오는 중...");

  useEffect(() => {
    // 상대경로 사용: Flask가 같은 호스트에서 /api를 서빙하므로 CORS 걱정 없음
    fetch("/api/bots")
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 오류: " + res.status);
        return res.json();
      })
      .then((data) => {
        setBots(data.bots || []);
        setStatus(`총 ${data.bots?.length ?? 0}개`);
      })
      .catch((err) => {
        console.error(err);
        setStatus("에러: " + err.message);
      });
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h2>봇 목록</h2>
      <div style={{ color: "#555", marginBottom: 8 }}>{status}</div>

      {bots.length === 0 ? (
        <div>아직 봇이 없어요.</div>
      ) : (
        <ul>
          {bots.map((b) => (
            <li key={b.id} style={{ marginBottom: 6 }}>
              <strong>#{b.id}</strong> {b.name}{" "}
              <small style={{ color: "#888" }}>
                {typeof b.prompt === "string" ? `— ${b.prompt}` : ""}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
