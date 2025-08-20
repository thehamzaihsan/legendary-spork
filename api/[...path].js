// api/[...path].js
// This serverless function proxies all API requests to your backend using Vercel's environment variables

// Import the node-fetch module for Node.js environments
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-V, Authorization'
  );

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const apiUrl = process.env.BACKEND_API_URL;
  
  if (!apiUrl) {
    return res.status(500).json({ error: 'BACKEND_API_URL is not configured' });
  }
  
  // Construct the full URL to the backend API
  const url = `${apiUrl}/api/${Array.isArray(path) ? path.join('/') : path}${
    req.url.includes('?') ? `?${req.url.split('?')[1]}` : ''
  }`;

  try {
    // Forward the request to the backend
    const headers = { ...req.headers };
    // Remove headers that could cause issues
    delete headers.host;
    delete headers.origin;
    delete headers.referer;

    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      credentials: 'include',
      ...(req.method !== 'GET' && req.method !== 'HEAD' && req.body && { 
        body: JSON.stringify(req.body) 
      }),
    };

    const response = await fetch(url, fetchOptions);

    // Get the response body
    const body = await response.text();

    // Set response status code
    res.status(response.status);

    // Forward response headers
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      // Don't forward content-encoding header as it can cause issues
      if (key.toLowerCase() !== 'content-encoding') {
        responseHeaders[key] = value;
        res.setHeader(key, value);
      }
    });

    // Ensure CORS headers are set in the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

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
