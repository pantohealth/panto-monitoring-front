import { api } from '../../lib/axios';

interface Login {
email:string,
password:string
}

const PREFIX = "auth/login";

export const loginApi = {
   login: async (credentials: Login) => {
    const response = await api.post(PREFIX , credentials);
    return response.data;
  }
};