// 本地 Mock API 客户端（无需后端服务器）
import mockApi from './mock';

// 保持与原来 axios 实例相同的接口
const api = {
  get: (url, config) => mockApi.get(url, config),
  post: (url, data, config) => mockApi.post(url, data),
  put: (url, data, config) => mockApi.put(url, data),
  delete: (url, config) => mockApi.delete(url),
};

// 添加请求拦截器（用于设置 Authorization header） - mock 中忽略
api.interceptors = {
  request: { use: () => {} },
  response: { use: () => {} },
};

export default api;
