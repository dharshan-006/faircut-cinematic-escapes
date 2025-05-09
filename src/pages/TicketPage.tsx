
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

const TicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentBooking,
    selectedTheatre, 
    selectedMovie, 
    selectedShowtime,
    resetBooking
  } = useBooking();
  
  const ticketRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if we have all required data
    if (!currentBooking || !selectedTheatre || !selectedMovie || !selectedShowtime) {
      toast.error('Missing booking information');
      navigate('/theatres');
      return;
    }
    
    // Simulate sending email
    toast.success('Ticket details sent to your email!', {
      description: user?.email
    });
  }, [currentBooking, selectedTheatre, selectedMovie, selectedShowtime, navigate, user]);

  const handleDownloadTicket = () => {
    // In a real app, this would generate a downloadable ticket
    toast.success('Ticket downloaded successfully!');
  };

  const handleDone = () => {
    resetBooking();
    navigate('/theatres');
  };

  if (!currentBooking || !selectedTheatre || !selectedMovie || !selectedShowtime) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-faircut"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-faircut-bg flex flex-col">
      <AppHeader title="Booking Successful" showBackButton={false} />
      
      <main className="flex-1 container max-w-md mx-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-full p-3 bg-green-600/20 mb-2">
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
              className="h-8 w-8 text-green-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-faircut-light">Tickets Booked Successfully!</h2>
          <p className="text-faircut-text/70 text-sm mt-1">Your tickets have been sent to your email</p>
        </div>
        
        {/* Ticket */}
        <div ref={ticketRef} className="mb-6">
          <Card className="cyberpunk-card overflow-hidden relative">
            {/* Ticket Top */}
            <div className="bg-faircut p-4 flex justify-between items-center">
              <Logo size="small" />
              <div className="text-right">
                <h3 className="text-white font-semibold text-sm">Movie Ticket</h3>
                <p className="text-white/70 text-xs">{new Date(currentBooking.bookingDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Ticket Content */}
            <CardContent className="p-4">
              <h3 className="font-bold text-xl text-faircut-light mb-1">{selectedMovie.title}</h3>
              <p className="text-faircut-text/70 text-sm mb-4">{selectedTheatre.name} • {selectedShowtime.screen}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-faircut-text/70 text-xs">Date & Time</p>
                  <p className="text-faircut-text">{selectedShowtime.date}, {selectedShowtime.time}</p>
                </div>
                <div>
                  <p className="text-faircut-text/70 text-xs">Seats</p>
                  <p className="text-faircut-text">
                    {currentBooking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-dashed border-faircut/30 pt-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-faircut-text/70 text-xs">Amount Paid</p>
                    <p className="text-faircut-light font-semibold">₹{currentBooking.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-faircut-text/70 text-xs">Booking ID</p>
                    <p className="text-faircut-text">{currentBooking.id.slice(-8)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            {/* QR Code (mock) */}
            <div className="flex justify-center p-4 border-t border-faircut/30">
              <div className="bg-white p-2 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
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
              </div>
            </div>
            
            {/* Ticket tear */}
            <div className="absolute top-24 left-0 right-0 flex justify-between items-center px-1">
              <div className="h-4 w-4 rounded-full bg-faircut-bg -ml-2"></div>
              <div className="border-t border-dashed border-faircut/30 flex-1"></div>
              <div className="h-4 w-4 rounded-full bg-faircut-bg -mr-2"></div>
            </div>
          </Card>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleDownloadTicket}
            variant="outline"
            className="w-full border-faircut/30 text-faircut-light hover:bg-faircut/20"
          >
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
              className="h-4 w-4 mr-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download Ticket
          </Button>
          
          <Button
            onClick={handleDone}
            className="w-full bg-faircut hover:bg-faircut-light"
          >
            Done
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TicketPage;
