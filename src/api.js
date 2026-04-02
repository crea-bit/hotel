// Use environment variable for API URL, fallback to localhost for development
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

// For production, you'll need to deploy your backend and set VITE_API_URL
// Example: https://your-api-domain.com

// Example Usage: fetch(`${BASE_URL}/api/auth/login`, { ... })
