import api from '../utils/axios';

export const getTopSelling = async (limit = 10) => {
  const response = await api.get('/reports/top-selling', { params: { limit } });
  return response.data;
};

export const getDeadStock = async () => {
  const response = await api.get('/reports/dead-stock');
  return response.data;
};

export const exportInventory = async () => {
  const response = await api.get('/reports/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('href');
  link.href = url;
  link.setAttribute('download', 'inventory_report.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
