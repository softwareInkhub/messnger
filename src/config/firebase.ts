import { initializeApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';

// Firebase configuration for messagingapp-844da
const firebaseConfig = {
  apiKey: "AIzaSyAtqltJM5i3tVE312iZCqTJO5OQ_qVOf2E",
  authDomain: "messagingapp-844da.firebaseapp.com",
  projectId: "messagingapp-844da",
  storageBucket: "messagingapp-844da.firebasestorage.app",
  messagingSenderId: "950457344052",
  appId: "1:950457344052:web:0628c5d6fe8618ccfcaa61",
  measurementId: "G-JDK5SJQ55R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Phone Auth Provider
export const phoneAuthProvider = new PhoneAuthProvider(auth);

// Initialize Recaptcha Verifier (only when needed)
export const createRecaptchaVerifier = () => {
  if (typeof window !== 'undefined') {
    // Clear any existing reCAPTCHA
    const existingRecaptcha = document.querySelector('#recaptcha-container');
    if (existingRecaptcha) {
      existingRecaptcha.innerHTML = '';
    }
    
    try {
      // Use reCAPTCHA v2 invisible
      return new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          console.log('reCAPTCHA v2 solved successfully');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA v2 expired');
        },
        'error-callback': () => {
          console.error('reCAPTCHA v2 error');
        }
      });
    } catch (error) {
      console.error('Error creating reCAPTCHA verifier:', error);
      return null;
    }
  }
  return null;
};

export default app; 