import axios from 'axios';

// Instanciando o Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Substitua pelo URL da sua API
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Obter o token de acesso do localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Adicionar o token no cabeçalho da requisição
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;