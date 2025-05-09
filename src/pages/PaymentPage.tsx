
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';
import { toast } from 'sonner';

// Mock RazorPay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    selectedTheatre, 
    selectedMovie, 
    selectedShowtime, 
    selectedSeats, 
    totalAmount,
    setCurrentBooking
  } = useBooking();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'qr'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we have all required data for payment
    if (!selectedTheatre || !selectedMovie || !selectedShowtime || selectedSeats.length === 0) {
      toast.error('Missing booking information');
      navigate('/theatres');
      return;
    }
    
    // Check if this theatre supports payment
    if (!selectedTheatre.hasPaymentGateway) {
      toast.error('This theatre is in demo mode only');
      navigate('/theatres');
      return;
    }
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [selectedTheatre, selectedMovie, selectedShowtime, selectedSeats, navigate]);

  const handlePayment = () => {
    if (!user) {
      toast.error('User information not available');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      // Initialize RazorPay
      const options = {
        key: "rzp_test_1v4w1diaSwnTNf", // Test Key ID
        amount: totalAmount * 100, // Amount in paisa
        currency: "INR",
        name: "Fair-Cut",
        description: `Movie Tickets for ${selectedMovie?.title}`,
        image: "/lovable-uploads/8fbab84f-3317-4a9c-85fb-54969283a244.png",
        handler: function (response: any) {
          // Handle successful payment
          toast.success('Payment successful!');
          
          // Create booking object
          const booking = {
            id: `booking-${Math.random().toString(36).substr(2, 9)}`,
            userId: user.id,
            showtimeId: selectedShowtime?.id || '',
            seats: selectedSeats,
            totalAmount,
            bookingDate: new Date().toISOString(),
            paymentStatus: 'completed' as const
          };
          
          // Save booking and navigate to ticket page
          setCurrentBooking(booking);
          navigate('/ticket');
        },
        prefill: {
          email: user.email,
          contact: user.phoneNumber || ''
        },
        theme: {
          color: "#8B5CF6"
        }
      };
      
      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error('RazorPay error:', error);
        toast.error('Failed to initialize payment gateway');
      } finally {
        setIsProcessing(false);
      }
    }, 1000);
  };

  if (!selectedTheatre || !selectedMovie || !selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-faircut"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-faircut-bg flex flex-col">
      <AppHeader title="Payment" showBackButton />
      
      <main className="flex-1 container max-w-md mx-auto p-4">
        {/* Order Summary */}
        <Card className="cyberpunk-card mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-faircut-light">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-faircut-text/70">Movie</span>
              <span className="text-faircut-text font-medium">{selectedMovie.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-faircut-text/70">Theatre</span>
              <span className="text-faircut-text">{selectedTheatre.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-faircut-text/70">Show</span>
              <span className="text-faircut-text">{selectedShowtime.time}, {selectedShowtime.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-faircut-text/70">Screen</span>
              <span className="text-faircut-text">{selectedShowtime.screen}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-faircut-text/70">Seats</span>
              <span className="text-faircut-text font-medium">
                {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
              </span>
            </div>
            
            <div className="pt-3 border-t border-faircut/20">
              <div className="flex justify-between">
                <span className="text-faircut-text/70">Ticket Price</span>
                <span className="text-faircut-text">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-faircut-text/70">Convenience Fee</span>
                <span className="text-faircut-text">₹0</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-faircut-text font-medium">Total Amount</span>
                <span className="text-faircut-light font-semibold">₹{totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Method */}
        <Card className="cyberpunk-card mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-faircut-light">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as any)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" className="border-faircut" />
                <Label htmlFor="card" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-2 text-faircut-light"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  <span className="text-faircut-text">Credit/Debit Card</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" className="border-faircut" />
                <Label htmlFor="upi" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-2 text-faircut-light"
                  >
                    <path d="M9 6v11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-3-3H9a2 2 0 0 0-2 2Z" />
                  </svg>
                  <span className="text-faircut-text">UPI Payment</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="qr" id="qr" className="border-faircut" />
                <Label htmlFor="qr" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-2 text-faircut-light"
                  >
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                    <path d="M21 12v.01" />
                    <path d="M12 21v-1" />
                  </svg>
                  <span className="text-faircut-text">Scan QR Code</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-faircut hover:bg-faircut-light text-lg py-6"
        >
          {isProcessing ? 'Processing...' : `Pay ₹${totalAmount}`}
        </Button>
        
        <p className="mt-4 text-center text-xs text-faircut-text/60">
          No convenience fee charged. 100% secure payment.
        </p>
      </main>
    </div>
  );
};

export default PaymentPage;
