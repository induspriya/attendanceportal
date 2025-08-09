// Client-side API functions for news
import axios from 'axios';

const API_BASE = '/api/news';

// Get all news with optional filtering
export const getAllNews = async (params = {}) => {
  try {
    const response = await axios.get(API_BASE, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Get latest news
export const getLatestNews = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_BASE}/latest`, { 
      params: { limit } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    throw error;
  }
};

// Get news by ID
export const getNewsById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    throw error;
  }
};

// Get news categories
export const getNewsCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news categories:', error);
    throw error;
  }
};

// Add new news (Admin only)
export const addNews = async (newsData) => {
  try {
    const response = await axios.post(`${API_BASE}/add`, newsData);
    return response.data;
  } catch (error) {
    console.error('Error adding news:', error);
    throw error;
  }
};

// Update news (Admin only)
export const updateNews = async (id, newsData) => {
  try {
    const response = await axios.put(`${API_BASE}/${id}`, newsData);
    return response.data;
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

// Delete news (Admin only)
export const deleteNews = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
}; 