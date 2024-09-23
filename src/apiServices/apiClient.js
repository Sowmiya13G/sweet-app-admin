import axios from 'axios';

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: 'https://sweetserver.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication tokens or modify requests
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor to handle errors or modify responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - redirecting to login.');
    } else if (error.response && error.response.status === 500) {
      console.error('Server error - please try again later.');
    } else {
      console.error('An error occurred:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
