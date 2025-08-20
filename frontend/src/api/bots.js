// src/api/bots.js
// 프론트에서 백엔드로 에이전트 CRUD HTTP 요청을 보내는 작은 도우미

const headers = { 'Content-Type': 'application/json' };

// 1) 목록 조회
export async function getBots() {
  const r = await fetch('/api/bots');
  if (!r.ok) throw new Error(await r.text());
  return r.json(); // { bots: [...] }
}

// 2) 생성
export async function createBot(partial = {}) {
  const payload = {
    name: partial.name ?? '새 에이전트',
    prompt: partial.prompt ?? '이 에이전트의 역할을 입력하세요.',
    expertise: partial.expertise ?? [],
    response_length: partial.response_length ?? 'brief',
    randomness: partial.randomness ?? 0.7,
    api_config: JSON.stringify(partial.api_config ?? { model: 'gpt-4o-mini', temperature: 0.7, maxTokens: 1000 }),
    avatar: partial.avatar ?? null,
    color: partial.color ?? null,
    personality: partial.personality ?? null,
  };
  const r = await fetch('/api/bots', { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error(await r.text());
  return r.json(); // { id: ... }
}

// 3) 수정
export async function updateBot(id, patch = {}) {
  const payload = {
    name: patch.name,
    prompt: patch.prompt,
    avatar: patch.avatar ?? null,
    color: patch.color ?? null,
    personality: patch.personality ?? null,
    response_length: patch.responseLength ?? patch.response_length ?? null,
    expertise: Array.isArray(patch.expertise) ? patch.expertise : [],
    randomness: typeof patch.randomness === 'number' ? patch.randomness : 0.7,
    api_config: JSON.stringify(patch.apiConfig ?? patch.api_config ?? {}),
  };
  const r = await fetch(`/api/bots/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error(await r.text());
  return r.json(); // { message: ... }
}

// 4) 삭제(소프트 딜리트)
export async function deleteBot(id) {
  const r = await fetch(`/api/bots/${id}`, { method: 'DELETE' });
  if (!r.ok) throw new Error(await r.text());
  return r.json(); // { message: ... }
}
