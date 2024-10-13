import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AGENDA_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.NEXT_PUBLIC_AGENDA_API_KEY,
  },
});

export const setApiCredentials = (hostname: string, apiKey: string): void => {
  apiClient.defaults.baseURL = hostname;
  apiClient.defaults.headers.common['X-API-Key'] = apiKey;
};

export default apiClient;