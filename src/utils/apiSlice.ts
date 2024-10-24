// utils/api.js
import axios from "axios";

const BASE_URL = 'http://localhost:5000/'; // Set your base URL in .env

// Create an instance of axios with default configurations
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to handle API calls
const apiCall = async (endpoint: string, method = "GET", data: any = null, config = {}) => {
  // Retrieve the token from session storage
  const token = sessionStorage.getItem("token");

  // Add the token to the headers if it exists
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await api({
      url: endpoint,
      method,
      data,
      ...config,
    });

    return response.data;
  } catch (error: any) {
    // Handle error gracefully
    const err = error.response?.data?.error || "Something went wrong!";
    return err;
  }
};

export default apiCall;
