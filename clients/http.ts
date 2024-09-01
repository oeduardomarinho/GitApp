import axios from 'axios';

const createHttpClient = () => {
  const Authorization = process.env.EXPO_PUBLIC_AUTHORIZATION;
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: { Authorization },
  });
};

export default createHttpClient;
