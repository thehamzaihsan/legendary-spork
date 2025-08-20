// api/[...path].js
// This serverless function proxies all API requests to your backend
import fetch from 'node-fetch';

// Enable CORS headers
const enableCors = (res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  return res;
};

// Skip static assets and other non-API routes
const shouldSkipProxy = (path) => {
  const skipPaths = ['/_next', '/assets', '/favicon.ico', '/manifest.json'];
  return skipPaths.some(skipPath => path.startsWith(skipPath));
};

export default async function handler(req, res) {
  const { path: pathParam } = req.query;
  const pathStr = Array.isArray(pathParam) ? pathParam.join('/') : pathParam || '';
  
  // Skip static assets and non-API routes
  if (shouldSkipProxy(`/${pathStr}`)) {
    console.log('Skipping proxy for path:', pathStr);
    return res.status(404).end();
  }

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    enableCors(res);
    return res.status(200).end();
  }
  
  // Enable CORS for all requests
  enableCors(res);

  const apiUrl = process.env.BACKEND_API_URL || 'https://voodo-api.zoomerrangz.com';
  
  if (!apiUrl) {
    console.error('BACKEND_API_URL is not configured');
    return res.status(500).json({ error: 'Backend URL is not configured' });
  }
  
  // Construct the full URL to the backend API
  const fullPath = Array.isArray(pathParam) ? pathParam.join('/') : pathParam || '';
  const queryString = req.url.includes('?') ? `?${req.url.split('?')[1]}` : '';
  const url = `${apiUrl.replace(/\/$/, '')}/api/${fullPath}${queryString}`;
  
  console.log('Proxying request to:', url);

  try {
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
    };

    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers,
      redirect: 'follow',
      ...(req.method !== 'GET' && req.body && { body: JSON.stringify(req.body) }),
    };
    
    console.log('Request headers:', JSON.stringify(headers, null, 2));

    console.log('Sending request with options:', {
      method: fetchOptions.method,
      headers: fetchOptions.headers,
      hasBody: !!fetchOptions.body
    });

    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    // Get the response body
    const body = isJson ? await response.json() : await response.text();
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Set CORS headers
    enableCors(res);
    
    // Set content type based on response
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Send the response
    res.status(response.status);
    res.send(isJson ? JSON.stringify(body) : body);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from API', 
      message: error.message 
    });
  }
}
