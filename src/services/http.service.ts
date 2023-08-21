import axios from 'axios';

const API_SERVER_URL = 'https://api.github.com/';

export const HTTP = axios.create({
  baseURL: API_SERVER_URL,
  headers: {
    'Content-type': 'application/json;charset=utf-8',
  },
});
