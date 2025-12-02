import apiClient from './index';

/**
 * Get all products
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data;
};

/**
 * Get single product by ID
 * @param {string|number} id - Product ID
 * @returns {Promise<Object>} Product object
 */
export const getProduct = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

/**
 * Adjust product stock
 * @param {string|number} id - Product ID
 * @param {number} delta - Stock change amount (positive or negative)
 * @param {string} reason - Optional reason for adjustment
 * @returns {Promise<Object>} Updated product
 */
export const adjustStock = async (id, delta, reason = '') => {
  const response = await apiClient.post(`/products/${id}/adjust`, {
    delta,
    reason,
  });
  return response.data;
};

/**
 * Get low-stock alerts
 * @returns {Promise<Array>} Array of alerts
 */
export const getAlerts = async () => {
  const response = await apiClient.get('/alerts');
  return response.data;
};

/**
 * Get sales trends data for charting
 * @param {number} range - Number of days (default 30)
 * @returns {Promise<Array>} Sales trend data
 */
export const getSalesTrends = async (range = 30) => {
  const response = await apiClient.get('/sales/trends', {
    params: { range },
  });
  return response.data;
};
