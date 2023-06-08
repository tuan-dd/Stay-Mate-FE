import axios from 'axios';
import { BASE_URL } from './config';

const apiService = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiService.interceptors.request.use(
  (request) =>
    // console.log('Start Request', request);
    request,
  (error) =>
    // console.log('REQUEST ERROR', { error });
    Promise.reject(error)
);

apiService.interceptors.response.use(
  (response) =>
    // console.log('Response', response);
    response,
  (error) => {
    // console.log('RESPONSE ERROR', { error });
    const message = error.response?.data?.errors?.message || 'Unknown Error';
    const newError = new Error(message);
    return Promise.reject(newError);
  }
);

export default apiService;
