"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import logo from '@/assets/logo2.png';
import { FiX, FiMail, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import httpClient from '@/lib/httpClient';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  userId: string;
  onVerificationSuccess: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  userId,
  onVerificationSuccess,
}: EmailVerificationModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false); // Track if code has been sent
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setCode(['', '', '', '', '', '']);
      setCodeSent(false);
      setCountdown(0);
    }
  }, [isOpen]);

  // Auto-focus first input when code input is shown
  useEffect(() => {
    if (isOpen && codeSent && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, codeSent]);

  const sendVerificationCode = async () => {
    setIsResending(true);
    try {
      const response = await httpClient.post('/verification/send', {
        userId,
        email,
      });
      setCountdown(60); // 60 second cooldown
      setCodeSent(true); // Mark that code has been sent
      
      toast.success('Verification code sent! Please check your email.', {
        position: 'top-right',
        autoClose: 4000,
      });
      
      // Auto-focus first input after code is sent
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send verification code';
      
      // User-friendly error messages
      let displayMessage = errorMessage;
      if (errorMessage.includes('Too many')) {
        displayMessage = 'You\'ve requested too many codes. Please wait a few minutes before trying again.';
      } else if (errorMessage.includes('wait')) {
        displayMessage = errorMessage; // Keep the wait time message
      }
      
      toast.error(displayMessage, {
        position: 'top-right',
        autoClose: 6000,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (digits.length === 6) {
      const newCode = digits.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code', {
        position: 'top-right',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await httpClient.post('/verification/verify', {
        userId,
        email,
        code: verificationCode,
      });

      if (response.data.success) {
        toast.success('Email verified successfully! Creating your account...', {
          position: 'top-right',
          autoClose: 2000,
        });
        // Call the success callback which will trigger completeApplication
        onVerificationSuccess();
      } else {
        toast.error(response.data.message || 'Verification failed', {
          position: 'top-right',
        });
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast.error(error.response?.data?.message || 'Invalid verification code. Please try again.', {
        position: 'top-right',
      });
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) {
      return;
    }

    setIsResending(true);
    try {
      await httpClient.post('/verification/resend', {
        userId,
        email,
      });
      setCountdown(60);
      setCodeSent(true); // Ensure code sent state is true
      toast.success('Verification code resent successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      // Clear code inputs
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error('Error resending code:', error);
      toast.error(error.response?.data?.message || 'Failed to resend verification code', {
        position: 'top-right',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6B5B5B] hover:text-[#702C3E] hover:bg-[#F6E7EA] rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#702C3E] to-[#5E2333] px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
            <Image src={logo} alt="Metsamdti Logo" className="w-16 opacity-95" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            {codeSent ? 'Verify Your Email' : 'Email Verification Required'}
          </h2>
          {codeSent ? (
            <>
              <p className="text-sm text-[#F6E7EA]">
                We've sent a verification code to
              </p>
              <p className="text-sm font-medium text-white mt-1">{email}</p>
            </>
          ) : (
            <p className="text-sm text-[#F6E7EA]">
              Please verify your email address to continue
            </p>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          {/* Send Code Button - Only show if code hasn't been sent yet */}
          {!codeSent && (
            <div className="mb-6 text-center">
              <div className="mb-4">
                <p className="text-sm text-[#491A26] font-medium mb-2">
                  Verify Your Email Address
                </p>
                <p className="text-sm text-[#6B5B5B] leading-relaxed">
                  To complete your registration and secure your account, we need to verify your email address. 
                  Click the button below to receive your verification code.
                </p>
              </div>
              <button
                onClick={sendVerificationCode}
                disabled={isResending}
                className="
                  w-full bg-[#702C3E] text-white
                  py-3 rounded-lg
                  font-semibold
                  hover:bg-[#5E2333] transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {isResending ? (
                  <>
                    <FiRefreshCw className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiMail className="w-5 h-5" />
                    Send Verification Code
                  </>
                )}
              </button>
              <p className="text-xs text-[#6B5B5B] mt-3">
                The code will be sent to <span className="font-medium text-[#491A26]">{email}</span>
              </p>
            </div>
          )}

          {/* Code Input and Verify Section - Only show after code is sent */}
          {codeSent && (
            <>
              {/* Individual Code Input Boxes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#491A26] mb-2 text-center">
                  Enter the 6-digit verification code
                </label>
                <p className="text-xs text-[#6B5B5B] mb-4 text-center">
                  We sent a code to <span className="font-medium text-[#491A26]">{email}</span>
                </p>
                <div className="flex gap-2 sm:gap-3 justify-center">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="
                        w-11 h-12 sm:w-12 sm:h-14
                        text-center text-xl sm:text-2xl font-bold
                        text-black
                        bg-[#F6E7EA] border-2 border-[#E4D6D6]
                        rounded-lg
                        focus:border-[#702C3E] focus:outline-none focus:ring-2 focus:ring-[#702C3E]/20
                        transition-all
                        disabled:opacity-50
                      "
                      aria-label={`Digit ${index + 1} of verification code`}
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={isVerifying || code.join('').length !== 6}
                className="
                  w-full bg-[#702C3E] text-white
                  py-3 rounded-lg
                  font-semibold
                  hover:bg-[#5E2333] transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>

              {/* Resend Code */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[#6B5B5B] mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResend}
                  disabled={isResending || countdown > 0}
                  className="
                    text-[#702C3E] text-sm font-medium
                    hover:underline
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 mx-auto
                  "
                >
                  {isResending ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend code in ${countdown}s`
                  ) : (
                    <>
                      <FiMail className="w-4 h-4" />
                      Resend Code
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Help Text - Only show after code is sent */}
          {codeSent && (
            <div className="mt-6 p-4 bg-[#F6E7EA] rounded-lg">
              <p className="text-xs text-[#6B5B5B] text-center leading-relaxed">
                <strong className="text-[#491A26]">Tip:</strong> Check your spam or junk folder if you don't see the email. 
                The verification code expires in 15 minutes for your security.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

