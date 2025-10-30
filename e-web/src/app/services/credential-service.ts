const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiRequest(endpoint: string, method: string, body: any = null, token: string | null = null) {
  if (!API_BASE_URL) {
   throw new Error("A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida." )
  };

  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  if (token) {
   headers['Authorization'] = `Bearer ${token}`; 
  }
  
  const config: RequestInit = { method, headers };
  
  if (body) {
   config.body = JSON.stringify(body); 
  }

  if(!API_BASE_URL){
    throw new Error("A variável de ambiente BASE URL não está definida");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  //Isso tudo é pra conseguir ler a porcaria do payload do token em utf-8
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(buffer);

  let data;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("Falha ao fazer parse do JSON:", text);
      throw new Error("A resposta do servidor não é um JSON válido.");
    }
  }

  if (!response.ok) {
    const errorMessage = data?.message || response.statusText || 'Ocorreu um erro na requisição 00';
    throw new Error(errorMessage);
  }
  return data;
};

export const registerUser = (formData: FormData) => {
  if (!API_BASE_URL) {
    throw new Error("A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida.");
  }
  return fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    body: formData,

  }).then(async res => {

    const buffer = await res.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(buffer);
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new Error(data.message || 'Ocorreu um erro no registo.');
    }
    return data;
  });
};

export const loginUser = (credentials: any) => apiRequest('/api/login', 'POST', credentials);

export const createArticle = (formData: FormData, token: string) => {
  if (!API_BASE_URL) {
   throw new Error("A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida."); 
  }
  
  return fetch(`${API_BASE_URL}/api/articles`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  })
  .then(async res => {
    const buffer = await res.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(buffer);
    const data = text ? JSON.parse(text) : null;

    if(!res.ok){
      throw new Error(data?.message || "Erro ao criar artigo. cod73");
    }

    return data;
  });
};

export const getArticles = async (searchTerm?: string) => {
  if(!API_BASE_URL) { throw new Error("A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida." )};

  let apiUrl = `${API_BASE_URL}/api/articles`;
  if(searchTerm){
    apiUrl += `?search=${encodeURIComponent(searchTerm)}`;
  }

  try{
    const response = await fetch(apiUrl, { cache: 'no-store'});

    if(!response.ok){
      throw new Error('Falha ao buscar artigos. cod49')
    }

    return response.json();
  }
  catch(error){
    console.error("102 Erro ao buscar artigos: ", error);
    return [];
  }
};

export const getArticleById = async (id: string) => {
  if(!API_BASE_URL) { throw new Error("A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida." )};

  try{
    const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, { cache: 'no-store' });

    if(!response.ok){
      throw new Error('Falha ao buscar artigo. cod931');
    }

    return response.json();
  }
  catch(error){
    console.error("Alguma coisa deu errado. cod 09412", error);
    return;
  }
};
