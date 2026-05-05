import api from '../utils/axios';

export const getSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};
