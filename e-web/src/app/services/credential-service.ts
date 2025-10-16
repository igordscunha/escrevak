const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiRequest(endpoint: string, method: string, body: any = null, token: string | null = null) {
  if (!API_BASE_URL) { throw new Error("A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida."); }
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const config: RequestInit = { method, headers };
  if (body) { config.body = JSON.stringify(body); }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ocorreu um erro na requisição.');
  }
  return response.json();
}

export const registerUser = (userData: any) => apiRequest('/api/register', 'POST', userData);
export const loginUser = (credentials: any) => apiRequest('/api/login', 'POST', credentials);

export const createArticle = (formData: FormData, token: string) => {
  if (!API_BASE_URL) { throw new Error("A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida."); }
  return fetch(`${API_BASE_URL}/api/articles`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  }).then(res => {
    if (!res.ok) { return res.json().then(err => { throw new Error(err.message) }); }
    return res.json();
  });
};
