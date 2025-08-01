import axios from "axios";

// Correct way to use fallback if VITE_API_URL is undefined
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api-v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Fix interceptors spelling and logic
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event("force-logout"));
    }
    return Promise.reject(error);
  }
);

// ✅ Generalized API methods using Axios
const postData = async <T>(path: string, data: unknown): Promise<T> => {
  const response = await api.post<T>(path, data);
  return response.data;
};

const fetchData = async <T>(path: string): Promise<T> => {
  const response = await api.get<T>(path);
  return response.data;
};

const updateData = async <T>(path: string, data: unknown): Promise<T> => {
  const response = await api.put<T>(path, data);
  return response.data;
};

const deleteData = async <T>(path: string): Promise<T> => {
  const response = await api.delete<T>(path);
  return response.data;
};

export { postData, fetchData, updateData, deleteData };
