import apiClient from './apiClient';
import { ENDPOINTS } from './endPoints';

// Function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.message || 'API error occurred');
  } else if (error.request) {
    console.error('No response received:', error.request);
    throw new Error('No response from server. Please try again.');
  } else {
    console.error('Error:', error.message);
    throw new Error(error.message || 'Unexpected error occurred');
  }
};

// GET Request for a single user
export const getUser = async (userId) => {
  try {
    const response = await apiClient.get(`${ENDPOINTS.USERS}/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// GET Request for multiple posts
export const getPosts = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.POSTS);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// POST Request to create a new post
export const createPost = async (postData) => {
  try {
    const response = await apiClient.post(ENDPOINTS.POSTS, postData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// PUT Request to update an existing post
export const updatePost = async (postId, postData) => {
  try {
    const response = await apiClient.put(`${ENDPOINTS.POSTS}/${postId}`, postData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// DELETE Request to delete a post
export const deletePost = async (postId) => {
  try {
    const response = await apiClient.delete(`${ENDPOINTS.POSTS}/${postId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
