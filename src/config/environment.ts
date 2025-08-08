// Environment configuration with validation
export const environment = {
  // API Configuration
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  
  // Firebase Configuration
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  },
  
  // App Configuration
  app: {
    name: process.env.REACT_APP_APP_NAME || 'WhatsApp Web UI',
    version: process.env.REACT_APP_APP_VERSION || '1.0.0',
    environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  },
  
  // Feature Flags
  features: {
    authentication: process.env.REACT_APP_ENABLE_AUTHENTICATION === 'true',
    realTimeMessaging: process.env.REACT_APP_ENABLE_REAL_TIME_MESSAGING === 'true',
    fileUpload: process.env.REACT_APP_ENABLE_FILE_UPLOAD === 'true',
  },
  
  // UI Configuration
  ui: {
    theme: process.env.REACT_APP_THEME || 'light',
    language: process.env.REACT_APP_LANGUAGE || 'en',
  },
};

// API Constants for backend endpoints
export const API_CONSTANTS = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      VERIFY_OTP: '/api/auth/verifyOTP',
    },
    MESSAGES: {
      SEND: '/api/sendMessage',
      GET: '/api/getMessages',
      GET_BY_SENDER: '/api/messages/sender',
      GET_BY_RECEIVER: '/api/messages/receiver',
    },
  },
};

// Validate required environment variables
export const validateEnvironment = () => {
  const requiredVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing required environment variables:', missingVars);
    console.warn('Please check your .env file');
  }

  return missingVars.length === 0;
};

// Export validation result
export const isEnvironmentValid = validateEnvironment();







