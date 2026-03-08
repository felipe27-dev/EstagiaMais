import { api } from '../lib/axios';

export const resumeService = {
  // Buscar todos
  getAll: async () => {
    const response = await api.get('/resumes/');
    return response.data;
  },

  // Buscar um específico
  getById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  // Criar novo
  create: async (resumeData) => {
    const response = await api.post('/resumes/', resumeData);
    return response.data;
  },
  // Deletar
  delete: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },
  // Editar
  update: async(id,data) => {
    console.log(id)
    const response = await api.put(`/resumes/${id}`,data)
    return response.data;
  },
  //Receber analise do curriculo
  uploadAnalysis: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try{
      const response = await api.post('/resumes/upload/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }catch(e){
      console.error("Erro ao enviar currículo para análise:", e);
      throw e; 
    }
  },
  analysisCreate: async (analysisData) => {
    const response = await api.post('/resumes/analysis', {tags_request: analysisData.tags, text_request: analysisData.text});
    return response.data;
  }
};