import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_CONSTANTS } from "../../config/environment";
import { 
  signInWithPhoneNumber, 
  ConfirmationResult,
  RecaptchaVerifier 
} from "firebase/auth";
import { auth } from "../../config/firebase";

const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Signup form, 2: OTP verification
  const [formData, setFormData] = useState({
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Test Firebase configuration on component mount
  useEffect(() => {
    console.log('🔧 Testing Firebase configuration...');
    console.log('✅ Auth instance:', auth);
    console.log('✅ Auth config:', auth.config);
  }, []);

  // Clear reCAPTCHA when component unmounts
  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, []);

  const clearRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
        console.log('✅ reCAPTCHA cleared successfully');
      } catch (error) {
        console.log('reCAPTCHA already cleared or not rendered');
      }
      recaptchaVerifierRef.current = null;
      setRecaptchaInitialized(false);
    }
  };

  const initializeRecaptcha = async () => {
    try {
      // Clear any existing reCAPTCHA first
      clearRecaptcha();
      
      // Wait a bit to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🔧 Initializing reCAPTCHA...');
      
      // Check if container exists
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        throw new Error('reCAPTCHA container not found');
      }
      
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('✅ reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('❌ reCAPTCHA expired');
          clearRecaptcha();
        }
      });
      
      await recaptchaVerifierRef.current.render();
      setRecaptchaInitialized(true);
      console.log('✅ reCAPTCHA initialized and rendered successfully');
    } catch (error) {
      console.error('❌ Error initializing reCAPTCHA:', error);
      clearRecaptcha();
      throw error;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Add +91 prefix if it's a 10-digit Indian number without country code
    if (cleaned.length === 10 && !cleaned.startsWith('+')) {
      return `+91${cleaned}`;
    }
    
    // Add + if it doesn't have country code and is 10 digits
    if (cleaned.length === 10 && !cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    // If it already has +, return as is
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // Default: add +91 for Indian numbers
    return `+91${cleaned}`;
  };

  const validatePhoneNumber = (phone: string) => {
    const formatted = formatPhoneNumber(phone);
    
    // Basic validation
    if (formatted.length < 10) {
      return { isValid: false, error: "Phone number too short" };
    }
    
    if (formatted.length > 15) {
      return { isValid: false, error: "Phone number too long" };
    }
    
    // Check if it starts with +
    if (!formatted.startsWith('+')) {
      return { isValid: false, error: "Phone number must include country code" };
    }
    
    return { isValid: true, formatted };
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.phoneNumber || !formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || "Invalid phone number");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      console.log('📝 Validating registration data with backend...');
      
      const response = await fetch(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.ENDPOINTS.AUTH.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneValidation.formatted || formData.phoneNumber,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration validation failed');
      }

      console.log('✅ Registration data validated:', data);
      setMessage("Registration data validated! Now sending OTP to your phone...");
      
      // Send OTP using Firebase Phone Auth
      await sendOTP(phoneValidation.formatted || formData.phoneNumber);
      
    } catch (error: any) {
      console.error('❌ Registration validation error:', error);
      setError(error.message || 'Registration validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (phoneNumber: string) => {
    try {
      setLoading(true);
      setError("");
      
      console.log('📱 Sending REAL SMS OTP to:', phoneNumber);

      // Initialize reCAPTCHA only if not already initialized
      if (!recaptchaInitialized) {
        await initializeRecaptcha();
      }

      // Send OTP using Firebase Phone Auth (REAL SMS)
      const confirmation = await signInWithPhoneNumber(
        auth, 
        phoneNumber, 
        recaptchaVerifierRef.current!
      );

      console.log('✅ REAL SMS OTP sent successfully via Firebase Phone Auth');
      setConfirmationResult(confirmation);
      setStep(2);
      setMessage(`Real SMS OTP sent to ${phoneNumber}. Check your phone for the 6-digit code.`);
      
    } catch (error: any) {
      console.error('❌ Send OTP error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format. Please use international format (e.g., +91XXXXXXXXXX)');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else if (error.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please try again later.');
      } else if (error.code === 'auth/invalid-app-credential') {
        setError('Firebase configuration issue. Please check your Firebase setup and enable Phone Auth.');
      } else if (error.code === 'auth/recaptcha-not-enabled') {
        setError('reCAPTCHA not enabled. Please check Firebase Console settings.');
      } else if (error.code === 'auth/invalid-recaptcha-token') {
        setError('reCAPTCHA token invalid. Please refresh the page and try again.');
        clearRecaptcha();
      } else if (error.code === 'auth/billing-not-enabled') {
        setError('Firebase billing not enabled. Please upgrade to Blaze plan for real SMS.');
      } else if (error.message.includes('reCAPTCHA has already been rendered')) {
        setError('reCAPTCHA error. Please refresh the page and try again.');
        clearRecaptcha();
      } else {
        setError(error.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      setError("No OTP session found. Please request a new OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      console.log('🔐 Verifying OTP with Firebase...');
      
      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      
      console.log('✅ OTP verified with Firebase:', result.user);

      // Get the ID token from Firebase
      const idToken = await result.user.getIdToken();
      
      // Send ID token to backend for user creation/verification
      const response = await fetch(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.ENDPOINTS.AUTH.VERIFY_OTP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          username: formData.username,
          password: formData.password, // Send password for user creation
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Backend verification failed');
      }

      console.log('✅ Backend verification successful:', data);
      
      // Auto-login after successful verification
      await login(data.user);
      
      setMessage("Phone number verified and user created successfully! Redirecting...");
      
      // Redirect to chat page
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ OTP verification error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check the code and try again.');
      } else if (error.code === 'auth/code-expired') {
        setError('OTP has expired. Please request a new one.');
      } else {
        setError(error.message || 'OTP verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp("");
    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    if (phoneValidation.isValid) {
      sendOTP(phoneValidation.formatted || formData.phoneNumber);
    } else {
      setError(phoneValidation.error || "Invalid phone number");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? "Create your account" : "Verify your phone number"}
          </h2>
        </div>

        {/* reCAPTCHA container (invisible) */}
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="phoneNumber"
                  type="tel"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone number (e.g., 9876543210 or +919876543210)"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {message && (
              <div className="text-green-600 text-sm text-center">{message}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Validating..." : "Create account"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div>
              <p className="text-sm text-gray-600 text-center mb-4">
                Enter the 6-digit code sent to {formatPhoneNumber(formData.phoneNumber)}
              </p>
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  className="text-center text-2xl font-bold tracking-widest w-48 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {message && (
              <div className="text-green-600 text-sm text-center">{message}</div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                ← Back to signup
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage; 