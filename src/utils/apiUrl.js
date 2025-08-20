// This utility file helps us use the correct API URL based on the environment
const getApiUrl = (path) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // Ensure baseUrl doesn't have trailing slash
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // Ensure path starts with /api/
  const cleanPath = path.startsWith('/api/') ? path : `/api${path.startsWith('/') ? path : `/${path}`}`;
  return `${cleanBaseUrl}${cleanPath}`;
};

export default getApiUrl;
