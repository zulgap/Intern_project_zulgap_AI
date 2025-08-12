let API_BASE = 'http://localhost:4000/api';
try {
  // Vite-style env
  if (import.meta?.env?.VITE_API_BASE) API_BASE = import.meta.env.VITE_API_BASE;
} catch (e) {}
// CRA fallback (if bundled elsewhere)
if (typeof process !== 'undefined' && process?.env?.REACT_APP_API_BASE) {
  API_BASE = process.env.REACT_APP_API_BASE;
}

async function http(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export const WorkflowAPI = {
  list: () => http('GET', '/workflows'),
  get: (id) => http('GET', `/workflows/${id}`),
  create: ({ name, nodes, connections }) => http('POST', '/workflows', { name, nodes, connections }),
  update: (id, { name, nodes, connections }) => http('PUT', `/workflows/${id}`, { name, nodes, connections }),
  remove: (id) => http('DELETE', `/workflows/${id}`),
};
