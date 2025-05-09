
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

const OtpVerificationPage: React.FC = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    // Check for pending email
    const pendingEmail = sessionStorage.getItem('faircut-pending-email');
    if (!pendingEmail) {
      navigate('/login');
      return;
    }
    setEmail(pendingEmail);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email not found. Please try logging in again.');
      navigate('/login');
      return;
    }
    
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const success = await verifyOtp(email, otp);
      if (success) {
        navigate('/location-access');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Failed to verify OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    
    // Here we would call the API to resend OTP
    toast.success('OTP resent successfully');
    setCountdown(30);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-faircut-dark via-faircut-bg to-faircut-accent flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="large" className="animate-pulse-glow" />
        </div>
        
        <Card className="cyberpunk-card bg-opacity-80 backdrop-blur-sm border-faircut/30">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-faircut-light neon-text">
              Verify OTP
            </CardTitle>
            <CardDescription className="text-center text-faircut-text/80">
              {email ? `Enter the OTP sent to ${email}` : 'Enter the OTP sent to your email'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border-faircut/30 bg-black/30 text-faircut-text text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-faircut hover:bg-faircut-light"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="link" 
              onClick={() => navigate('/login')}
              className="text-faircut-text/80"
            >
              Back to Login
            </Button>
            <Button 
              variant="link" 
              onClick={handleResendOtp}
              disabled={countdown > 0}
              className={countdown > 0 ? "text-faircut-text/50" : "text-faircut-light"}
            >
              {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
