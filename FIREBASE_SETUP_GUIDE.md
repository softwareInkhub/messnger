# 🔥 Firebase Setup Guide for Phone Auth

## ❌ Current Error: `auth/invalid-app-credential`

This error occurs when Firebase Phone Auth is not properly configured. Follow these steps to fix it:

## 📋 Step-by-Step Firebase Console Setup

### 1. **Enable Phone Authentication**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `messagingapp-844da`
3. Go to **Authentication** → **Sign-in method**
4. Click on **Phone** provider
5. **Enable** Phone Authentication
6. Click **Save**

### 2. **Add Authorized Domains**
1. In **Authentication** → **Settings** → **Authorized domains**
2. Add these domains:
   - `localhost`
   - `127.0.0.1`
   - Your production domain (if any)

### 3. **Configure reCAPTCHA**
1. In **Authentication** → **Settings** → **reCAPTCHA Enterprise**
2. **Disable** reCAPTCHA Enterprise (we're using v2)
3. Go to **Authentication** → **Settings** → **reCAPTCHA v2**
4. **Enable** reCAPTCHA v2
5. Add your domain to the allowed list

### 4. **Check API Key Restrictions**
1. Go to **Project Settings** → **General**
2. Scroll down to **Your apps**
3. Click on your web app
4. Copy the **API Key**
5. Go to **Project Settings** → **Service accounts**
6. Check if API key has proper restrictions

### 5. **Enable Phone Auth in Google Cloud**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Library**
4. Search for **"Phone Number Verification API"**
5. **Enable** it if not already enabled

## 🔧 Environment Variables

Create a `.env` file in `whatsapp-web-ui/` with:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=messagingapp-844da.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=messagingapp-844da
REACT_APP_FIREBASE_STORAGE_BUCKET=messagingapp-844da.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=950457344052
REACT_APP_FIREBASE_APP_ID=1:950457344052:web:0628c5d6fe8618ccfcaa61
REACT_APP_FIREBASE_MEASUREMENT_ID=G-JDK5SJQ55R

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001
```

## 🧪 Test Phone Numbers

For testing, you can use these phone numbers:
- `+1 650-555-1234` (US test number)
- `+91 9876543210` (India test number)

## 🚨 Common Issues & Solutions

### Issue 1: "auth/invalid-app-credential"
**Solution:** Enable Phone Auth in Firebase Console

### Issue 2: "auth/recaptcha-not-enabled"
**Solution:** Enable reCAPTCHA v2 in Firebase Console

### Issue 3: "auth/quota-exceeded"
**Solution:** Upgrade to Blaze plan or wait for quota reset

### Issue 4: "auth/invalid-phone-number"
**Solution:** Use international format: `+91XXXXXXXXXX`

## ✅ Verification Steps

1. **Check Firebase Console:**
   - Phone Auth is enabled
   - reCAPTCHA v2 is enabled
   - Domain is authorized

2. **Check Browser Console:**
   - No Firebase config errors
   - reCAPTCHA initializes successfully

3. **Test with Real Phone:**
   - Use your actual phone number
   - Check for SMS delivery

## 🔍 Debug Information

The app will log these in console:
- ✅ Firebase Config status
- ✅ reCAPTCHA initialization
- ✅ OTP sending attempts
- ❌ Any errors with specific codes

## 📞 Support

If issues persist:
1. Check Firebase Console logs
2. Verify all steps above
3. Test with different phone numbers
4. Check browser console for detailed errors 