import api from '../utils/axios';

export const getStockLevels = async (lowStock = false) => {
  const response = await api.get('/stock', { params: { lowStock } });
  return response.data;
};

export const stockIn = async (data) => {
  const response = await api.post('/stock/in', data);
  return response.data;
};

export const stockOut = async (data) => {
  const response = await api.post('/stock/out', data);
  return response.data;
};

export const stockAdjust = async (data) => {
  const response = await api.post('/stock/adjust', data);
  return response.data;
};
