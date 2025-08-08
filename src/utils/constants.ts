import { environment } from '../config/environment';

// App Constants
export const APP_CONSTANTS = {
  NAME: environment.app.name,
  VERSION: environment.app.version,
  ENVIRONMENT: environment.app.environment,
};

// API Constants
export const API_CONSTANTS = {
  BASE_URL: environment.apiBaseUrl,
  ENDPOINTS: {
    SEND_MESSAGE: '/api/sendMessage',
    GET_MESSAGES: '/api/getMessages',
    HEALTH: '/health',
    TEST: '/test',
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Firebase Constants
export const FIREBASE_CONSTANTS = {
  CONFIG: environment.firebase,
  RECAPTCHA_SIZE: 'invisible' as const,
  PHONE_AUTH_TIMEOUT: 60000, // 60 seconds
};

// UI Constants
export const UI_CONSTANTS = {
  THEME: environment.ui.theme,
  LANGUAGE: environment.ui.language,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  MESSAGE_LIMIT: 50,
  MAX_MESSAGE_LENGTH: 1000,
};

// Feature Flags
export const FEATURE_FLAGS = {
  AUTHENTICATION: environment.features.authentication,
  REAL_TIME_MESSAGING: environment.features.realTimeMessaging,
  FILE_UPLOAD: environment.features.fileUpload,
};

// Validation Constants
export const VALIDATION_CONSTANTS = {
  PHONE_NUMBER: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
    PATTERN: /^\+?[1-9]\d{1,14}$/,
  },
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
  USER_ID: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Message sent successfully!',
  AUTHENTICATION_SUCCESS: 'Authentication successful!',
  CONNECTION_SUCCESS: 'Connected to server successfully!',
};


