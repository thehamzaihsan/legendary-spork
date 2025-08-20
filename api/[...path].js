// api/[...path].js
// This serverless function proxies all API requests to your backend using Vercel's environment variables

// Import the node-fetch module for Node.js environments
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { path } = req.query;
  
  // Get the backend URL from Vercel's environment variables
  // Make sure to add BACKEND_API_URL in your Vercel project settings
  const apiUrl = process.env.BACKEND_API_URL;
  
  // Construct the full URL to the backend API
  const url = `${apiUrl}/api/${Array.isArray(path) ? path.join('/') : path}${
    req.url.includes('?') ? `?${req.url.split('?')[1]}` : ''
  }`;path.js
// This serverless function proxies all API requests to your backend

export default async function handler(req, res) {
  const { path } = req.query;
  const apiUrl = process.env.BACKEND_API_URL ;
  
  // Construct the full URL to the backend API
  const url = `${apiUrl}/api/${Array.isArray(path) ? path.join('/') : path}${
    req.url.includes('?') ? `?${req.url.split('?')[1]}` : ''
  }`;

  try {
    // Forward the request to the backend
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        // Don't forward host header to avoid CORS issues
        host: undefined,
      },
      ...(req.method !== 'GET' && req.method !== 'HEAD' && { body: JSON.stringify(req.body) }),
    });

    // Get the response body
    const body = await response.text();

    // Set response status code
    res.status(response.status);

    // Forward response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send response body
    res.send(body);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from API', 
      message: error.message 
    });
  }
}
