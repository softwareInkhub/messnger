# Firebase Setup Guide

This guide will help you set up Firebase Authentication for the WhatsApp web app.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "WhatsApp Clone")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Enable for signup
   - **Phone**: Enable for OTP verification

### Phone Authentication Setup:
1. Click on "Phone" provider
2. Enable it
3. Add your test phone numbers (for development)
4. Save the changes

## Step 3: Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "WhatsApp Web")
6. Copy the Firebase configuration object

## Step 4: Update Firebase Config

Replace the placeholder values in `src/config/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Enable reCAPTCHA

1. In Firebase Console, go to Authentication > Settings
2. Scroll down to "reCAPTCHA Enterprise" section
3. Enable reCAPTCHA Enterprise
4. Add your domain to the allowed domains list

## Step 6: Test the Authentication

1. Start your development server: `npm start`
2. Navigate to `/signup` to test user registration
3. Navigate to `/login` to test phone authentication
4. Try sending OTP to your test phone number

## Features Included

### Signup Flow:
1. User enters name, email, and password
2. Account is created with email/password
3. User enters phone number for verification
4. OTP is sent to the phone number
5. User verifies OTP to complete signup

### Login Flow:
1. User enters phone number
2. OTP is sent to the phone number
3. User enters 6-digit OTP
4. User is authenticated and redirected to chat

### Security Features:
- Protected routes (redirect to login if not authenticated)
- Firebase Authentication state management
- reCAPTCHA integration for phone verification
- Automatic logout functionality

## Troubleshooting

### Common Issues:

1. **"reCAPTCHA not found" error**:
   - Make sure reCAPTCHA is enabled in Firebase Console
   - Check that the domain is added to allowed domains

2. **"Phone number format invalid"**:
   - Ensure phone numbers include country code (e.g., +1234567890)
   - Add test phone numbers in Firebase Console

3. **"Quota exceeded" error**:
   - Phone authentication has usage limits
   - Consider upgrading Firebase plan for production

4. **"Invalid API key"**:
   - Double-check your Firebase configuration
   - Ensure the API key is correct

## Production Considerations

1. **Security Rules**: Set up proper Firebase Security Rules
2. **Domain Restrictions**: Add your production domain to Firebase allowed domains
3. **Error Handling**: Implement proper error handling for authentication failures
4. **User Management**: Consider adding user profile management features
5. **Rate Limiting**: Implement rate limiting for OTP requests

## Next Steps

1. Customize the UI to match your brand
2. Add user profile management
3. Implement password reset functionality
4. Add social login providers (Google, Facebook, etc.)
5. Set up Firebase Hosting for deployment 