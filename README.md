# Voodo Desktop Frontend

A React-based video and text chat application that connects random strangers. Built with React, Vite, WebRTC, and Socket.IO.

## Features

- Random video chat with strangers
- Text messaging alongside video calls
- User preferences and matching
- Premium features with payment integration
- Responsive design for all devices

## Environment Setup

This project uses environment variables for configuration. Copy the example file to get started:

```bash
cp .env.example .env
```

Then edit `.env` with your actual configuration values:

- **API URLs**: Set your backend API and socket server URLs
- **WebRTC Configuration**: STUN/TURN server information for WebRTC connections
- **Feature Flags**: Enable/disable various application features
- **Payment Configuration**: API keys for payment processors (if using premium features)

> **Important**: Never commit `.env` or `.env.production` files to version control! They contain sensitive credentials.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate  TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
   