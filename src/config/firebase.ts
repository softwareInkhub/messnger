import { initializeApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { environment } from './environment';

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: environment.firebase.apiKey || "AIzaSyA96ilJYYK5O5he3iLI89buf6RXCXtcMP4",
  authDomain: environment.firebase.authDomain || "chatting-92351.firebaseapp.com",
  projectId: environment.firebase.projectId || "chatting-92351",
  storageBucket: environment.firebase.storageBucket || "chatting-92351.firebasestorage.app",
  messagingSenderId: environment.firebase.messagingSenderId || "667497787507",
  appId: environment.firebase.appId || "1:667497787507:web:a411e61ee5a5ccfc78ba06",
  measurementId: environment.firebase.measurementId || "G-QMY5XWRW6J"
};

console.log('🔧 Firebase Config Status:', {
  apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
  projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
  appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing',
  usingEnvVars: environment.firebase.apiKey ? '✅ Environment Variables' : '❌ Hardcoded Values'
});

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Create reCAPTCHA verifier
export const createRecaptchaVerifier = (containerId: string) => {
  try {
    console.log('🔧 Creating reCAPTCHA verifier for container:', containerId);
    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('✅ reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('❌ reCAPTCHA expired');
      }
    });
    console.log('✅ reCAPTCHA verifier created successfully');
    return verifier;
  } catch (error) {
    console.error('❌ Error creating reCAPTCHA verifier:', error);
    throw error;
  }
};

// Phone Auth Provider
export const phoneAuthProvider = new PhoneAuthProvider(auth);

export default app;
