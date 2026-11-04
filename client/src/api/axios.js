import axios from "axios";
import { API_BASE_URL, API_URL } from "../config.js";

const apiInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { API_BASE_URL, API_URL };
export default apiInstance;

