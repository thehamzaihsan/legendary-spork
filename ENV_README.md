# Environment Variables for Voodo Desktop

## Backend (.env in server folder)

### Server Configuration
```
PORT=5000                   # Port number for the server
NODE_ENV=development        # Environment mode (development/production)
```

### MongoDB Connection
```
MONGODB_URI=mongodb://localhost:27017/voodo-desktop   # MongoDB connection string
```

### Frontend URL (for CORS)
```
FRONTEND_URL=http://localhost:5173   # URL of the frontend application
```

### CoTURN Server Configuration
```
TURN_SERVER_URL=turn:your-turn-server:3478   # Your TURN server URL
TURN_SERVER_USERNAME=username                # TURN server username
TURN_SERVER_CREDENTIAL=password              # TURN server password
STUN_SERVER_URL=stun:stun.l.google.com:19302 # STUN server URL
```

## Frontend (.env in root folder)

### API URLs
```
VITE_API_URL=http://localhost:5000            # Backend API URL
VITE_SOCKET_SERVER_URL=http://localhost:5000  # Socket.IO server URL
```

### WebRTC Configuration
```
VITE_STUN_SERVER=stun:stun.l.google.com:19302  # STUN server for WebRTC
VITE_TURN_SERVER=turn:your-turn-server:3478    # TURN server for WebRTC
VITE_TURN_USERNAME=username                    # TURN server username
VITE_TURN_CREDENTIAL=password                  # TURN server password
```

### App Configuration
```
VITE_APP_NAME=Voodo Desktop                    # Application name
VITE_APP_DESCRIPTION=Connect with strangers    # Application description
VITE_APP_VERSION=1.0.0                        # Application version
```

### Feature Flags
```
VITE_ENABLE_HANGOUTS=true     # Enable/disable hangouts feature
VITE_ENABLE_VIDEO_CHAT=true   # Enable/disable video chat feature
VITE_ENABLE_TEXT_CHAT=true    # Enable/disable text chat feature
VITE_ENABLE_PREMIUM=false     # Enable/disable premium features
```
