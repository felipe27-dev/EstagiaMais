import { api } from '../lib/axios';

export const loginService = { 
    signIn: async (email,password) => {
        const response = await api.post('/auth/login', { email: email, password: password });
        return response.data;
    },
    getUserById: async(id) =>{
        const response = await api.get(`/auth/user/${id}`);
        return response.data;
    },
    updateUser: async(id, userData) => {
        const response = await api.put(`/auth/user/${id}`, userData);
        return response.data;
    }
    
}