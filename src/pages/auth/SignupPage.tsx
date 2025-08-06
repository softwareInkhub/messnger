import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth, createRecaptchaVerifier } from '../../config/firebase';

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const SignupCard = styled.div`
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

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.completed ? '#4caf50' : props.active ? '#667eea' : '#e1e5e9'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  font-size: 14px;
  font-weight: bold;
`;

const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Don't auto-render reCAPTCHA on mount
    // It will be created when needed
  }, []);

  const handleStep1 = async () => {
    if (!name || !email || !password) {
      setMessage('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      setStep(2);
      setMessage('Account created! Now verify your phone number.');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const recaptchaVerifier = createRecaptchaVerifier();
      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA not available');
      }
      
      // Render reCAPTCHA before sending OTP
      await recaptchaVerifier.render();
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep(3);
      setMessage('OTP sent successfully!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
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
        setMessage('Signup successful! Welcome to WhatsApp!');
        // Redirect to chat or update user state
        setTimeout(() => {
          window.location.href = '/chat';
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
    setStep(2);
    setMessage('');
  };

  return (
    <SignupContainer>
      <SignupCard>
        <Title>WhatsApp Signup</Title>
        
        <StepIndicator>
          <Step active={step === 1} completed={step > 1}>1</Step>
          <Step active={step === 2} completed={step > 2}>2</Step>
          <Step active={step === 3} completed={step > 3}>3</Step>
        </StepIndicator>
        
        <div id="recaptcha-container"></div>

        {step === 1 && (
          <>
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleStep1} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <p>Verify your phone number</p>
            <Input
              type="tel"
              placeholder="Enter phone number (e.g., +1234567890)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button onClick={handleSendOTP} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </>
        )}

        {step === 3 && (
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
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>Already have an account?</p>
          <a 
            href="/login" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Sign In
          </a>
        </div>
      </SignupCard>
    </SignupContainer>
  );
};

export default SignupPage; 