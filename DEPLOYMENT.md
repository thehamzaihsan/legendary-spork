# Deployment Guide

This guide provides instructions for deploying the Vodoo Desktop application to production environments.

## Frontend Deployment

### 1. Environment Configuration

Before building the frontend for production:

1. Create a production environment file:
   ```
   cp .env.production.example .env.production
   ```

2. Edit `.env.production` to set the correct backend API URL:
   - For same-domain deployment: `VITE_API_BASE_URL=/api`
   - For separate domain: `VITE_API_BASE_URL=https://your-backend-api.com/api`

### 2. Building the Frontend

```bash
npm run build
```

This will create a `dist` folder containing the optimized production build.

### 3. Serving the Frontend

You can serve the frontend using any static file server like Nginx, Apache, or Vercel:

#### Using Nginx (example configuration)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Forward API requests to backend server
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Backend Deployment

### 1. Environment Configuration

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=https://yourdomain.com
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_admin_password
```

### 2. Running the Server

```bash
cd server
npm install
npm start
```

For production, it's recommended to use PM2 or a similar process manager:

```bash
npm install -g pm2
pm2 start server.js --name "vodoo-backend"
```

## Using Docker (Optional)

A Docker configuration is available in the server directory.

```bash
cd server
docker-compose up -d
```

## Troubleshooting

### API Connection Issues

- Make sure the API URL is correctly set in your `.env.production` file
- Check CORS settings in the backend server
- Verify network connectivity between frontend and backend

### Database Issues

- Ensure your MongoDB instance is accessible from your server
- Check connection string format in your backend `.env` file

### Admin Panel Access

- The admin panel is accessible at `/admin` 
- Use the credentials defined in your server's `.env` file
- No mock data is shown in production - only actual flagged posts will appear
