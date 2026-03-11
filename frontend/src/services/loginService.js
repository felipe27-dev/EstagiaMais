import { api } from '../lib/axios';

export const loginService = { 
    signIn: async (email,password) => {
        const response = await api.post('/auth/login', { email: email, password: password });
        return response.data;
    }
}