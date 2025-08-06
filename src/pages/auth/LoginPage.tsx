import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  signInWithPhoneNumber, 
  ConfirmationResult 
} from 'firebase/auth';
import { auth, createRecaptchaVerifier } from '../../config/firebase';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #5a6fd8;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const OTPInput = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 1rem 0;
`;

const OTPDigit = styled.input`
  width: 40px;
  height: 40px;
  text-align: center;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Message = styled.div<{ isError?: boolean }>`
  margin: 8px 0;
  padding: 8px;
  border-radius: 4px;
  background: ${props => props.isError ? '#ffebee' : '#e8f5e8'};
  color: ${props => props.isError ? '#c62828' : '#2e7d32'};
`;

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Don't auto-render reCAPTCHA on mount
    // It will be created when needed
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Ensure proper phone number format with country code
      let formattedPhone = phoneNumber;
      
      // If it doesn't start with +, add +91 (India country code)
      if (!formattedPhone.startsWith('+')) {
        // If it's a 10-digit Indian number, add +91
        if (formattedPhone.length === 10 && !formattedPhone.startsWith('0')) {
          formattedPhone = `+91${formattedPhone}`;
        } else {
          formattedPhone = `+${formattedPhone}`;
        }
      }
      
      // Validate phone number format
      if (formattedPhone.length < 12) {
        setMessage('Please enter a valid phone number with country code (e.g., +919142402110)');
        setLoading(false);
        return;
      }
      const recaptchaVerifier = createRecaptchaVerifier();
      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA not available');
      }
      
      // Render reCAPTCHA before sending OTP
      await recaptchaVerifier.render();
      
      console.log('Sending OTP to:', formattedPhone);
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      console.log('OTP sent successfully, confirmation received');
      setConfirmationResult(confirmation);
      setShowOTP(true);
      setMessage('OTP sent successfully! Check your phone for the 6-digit code.');
    } catch (error: any) {
      console.error('Firebase OTP Error:', error);
      setMessage(`Error: ${error.message}. Please check Firebase configuration.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setMessage('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (confirmationResult) {
        await confirmationResult.confirm(otpString);
        setMessage('Login successful!');
        // Redirect to chat or update user state
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setShowOTP(false);
    setMessage('');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>WhatsApp Login</Title>
        
        <div id="recaptcha-container"></div>

        {!showOTP ? (
          <>
                         <Input
               type="tel"
               placeholder="Enter phone number (e.g., +919142402110)"
               value={phoneNumber}
               onChange={(e) => setPhoneNumber(e.target.value)}
             />
            <Button onClick={handleSendOTP} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </>
        ) : (
          <>
            <p>Enter the 6-digit code sent to {phoneNumber}</p>
            <OTPInput>
              {otp.map((digit, index) => (
                <OTPDigit
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                />
              ))}
            </OTPInput>
            <Button onClick={handleVerifyOTP} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <Button onClick={handleResendOTP} disabled={loading}>
              Resend OTP
            </Button>
          </>
        )}

        {message && (
          <Message isError={message.includes('Error')}>
            {message}
          </Message>
        )}
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>Don't have an account?</p>
          <a 
            href="/signup" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Create Account
          </a>
        </div>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage; 