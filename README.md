# Placement Dashboard - Setup Instructions

## Installation

### 1. Install Node.js dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
```

The server will run on `http://localhost:3000`

### 3. Access the application
- Open your browser and go to `http://localhost:3000`
- You will be redirected to the login page

## Login Credentials

### Admin Account
- **Email:** admin@placement.com
- **Password:** admin123

### User Account
- **Email:** user@placement.com
- **Password:** user123

## Features

### Admin Features
- Schedule tests for students with:
  - Subject selection
  - Date and time
  - Duration
  - Number of questions
- View all assigned tests
- Delete tests
- Monitor test assignments

### User Features
- View assigned tests
- Start active tests
- Take mock tests on various subjects
- View detailed results and explanations
- Track test statistics
- Test security features:
  - Copy/paste prevention
  - Tab-switching detection (3 switches = test termination)
  - Dev tools blocking
  - Fullscreen mode enforcement

## Database

MongoDB is used for storing user credentials. The database is automatically initialized with:
- Admin user: `admin@placement.com`
- Regular user: `user@placement.com`

Both accounts are created on first server start.

## Project Structure

```
.
├── login.html          # Login page
├── login-styles.css    # Login page styling
├── login-script.js     # Login page functionality
├── index.html          # Main dashboard
├── styles.css          # Dashboard styling
├── script.js           # Dashboard functionality
├── server.js           # Express backend
├── package.json        # Dependencies
└── README.md           # This file
```

## Development

To enable watch mode (auto-restart on file changes):
```bash
npm run dev
```

## Notes

- Session data is stored in `sessionStorage` for authentication
- Test data is persisted in `localStorage`
- All credentials are validated against MongoDB
- The application uses JWT tokens for session management
