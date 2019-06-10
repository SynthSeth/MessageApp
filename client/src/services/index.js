import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/graphql',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});

export function apiCall(method, url, data) {
  return new Promise((resolve, reject) => {
    axios[method](url, data)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
}

export function setAuthorizationHeaderToken(token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
