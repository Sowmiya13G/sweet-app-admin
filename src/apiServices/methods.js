// Function to handle API errors
export const handleApiError = (error) => {
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
