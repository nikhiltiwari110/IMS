import api from '../utils/axios';

export const getTransactions = async (params) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};
