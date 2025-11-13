// Read base URL from Vite env (VITE_API_BASE_URL). Fall back to localhost:5001 for local dev.
// Do NOT hardcode a production URL here; set VITE_API_BASE_URL in Vercel when deploying.
const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5001'

async function request(method: string, path: string, body?: any) {
  const opts: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' }
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${API_BASE}${path}`, opts)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  if (res.status === 204) return null
  return res.json()
}

const api = {
  get: (p: string) => request('GET', p),
  post: (p: string, b: any) => request('POST', p, b),
  put: (p: string, b: any) => request('PUT', p, b),
  del: (p: string) => request('DELETE', p)
}

export type Api = typeof api
export default api
