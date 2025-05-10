
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showtimes, generateSeats } from '@/data/mockData';
import { useBooking } from '@/context/BookingContext';
import AppHeader from '@/components/AppHeader';
import { Seat } from '@/types';
import { toast } from 'sonner';

const SeatSelectionPage: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const { 
    selectedTheatre,
    selectedMovie,
    selectedShowtime,
    setSelectedShowtime,
    selectedSeats,
    clearSelectedSeats,
    addSeat,
    removeSeat,
    numberOfSeats,
    setNumberOfSeats,
    totalAmount
  } = useBooking();
  
  // Use state for seats with a proper initialization
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use useMemo to compute rows for better performance
  const seatsByRow = useMemo(() => {
    if (!seats.length) return {};
    
    return seats.reduce<Record<string, Seat[]>>((acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = [];
      }
      acc[seat.row].push(seat);
      return acc;
    }, {});
  }, [seats]);
  
  useEffect(() => {
    // If we don't have the selected showtime yet, try to find it
    if (!selectedShowtime && showtimeId) {
      const showtime = showtimes.find(st => st.id === showtimeId);
      if (showtime) {
        setSelectedShowtime(showtime);
      } else {
        navigate('/theatres');
        return;
      }
    }
    
    setIsLoading(true);
    
    // Clear any previously selected seats
    clearSelectedSeats();
    
    // Generate seats for this showtime
    if (showtimeId) {
      try {
        const generatedSeats = generateSeats(showtimeId);
        // Sort seats by row and number for consistency
        generatedSeats.sort((a, b) => {
          if (a.row !== b.row) return a.row.localeCompare(b.row);
          return parseInt(a.number) - parseInt(b.number);
        });
        setSeats(generatedSeats);
      } catch (error) {
        console.error("Error generating seats:", error);
        toast.error("Failed to load seat map");
      } finally {
        setIsLoading(false);
      }
    }
  }, [showtimeId, selectedShowtime, setSelectedShowtime, clearSelectedSeats, navigate]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') {
      toast.error('This seat is already booked');
      return;
    }
    
    // If seat is already selected, deselect it
    if (selectedSeats.some(s => s.id === seat.id)) {
      removeSeat(seat.id);
      return;
    }
    
    // If we've reached the maximum number of seats, show an error
    if (selectedSeats.length >= numberOfSeats) {
      toast.error(`You can only select ${numberOfSeats} seat(s)`);
      return;
    }
    
    // Select the seat
    addSeat(seat);
    
    // Only try to select adjacent seats if this is the first selection
    if (numberOfSeats > 1 && selectedSeats.length === 0) {
      // Get available seats in the same row
      const sameRowSeats = seats.filter(s => 
        s.row === seat.row && 
        s.status === 'available' && 
        s.id !== seat.id
      );
      
      const currentSeatNumber = parseInt(seat.number);
      
      // Find seats to the right of the selected seat
      const rightSeats = sameRowSeats.filter(s => parseInt(s.number) > currentSeatNumber)
        .sort((a, b) => parseInt(a.number) - parseInt(b.number));
      
      // Find seats to the left of the selected seat
      const leftSeats = sameRowSeats.filter(s => parseInt(s.number) < currentSeatNumber)
        .sort((a, b) => parseInt(b.number) - parseInt(a.number)); // Reverse sort for left side
      
      // Calculate how many more seats we need
      const seatsNeeded = numberOfSeats - 1;
      let seatsAdded = 0;
      
      // Try to add seats from the right first
      for (let i = 0; i < rightSeats.length && seatsAdded < seatsNeeded; i++) {
        addSeat(rightSeats[i]);
        seatsAdded++;
      }
      
      // If we still need more seats, add from the left
      for (let i = 0; i < leftSeats.length && seatsAdded < seatsNeeded; i++) {
        addSeat(leftSeats[i]);
        seatsAdded++;
      }
    }
  };

  const handleNumberOfSeatsChange = (value: string) => {
    const num = parseInt(value);
    setNumberOfSeats(num);
    clearSelectedSeats();
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length !== numberOfSeats) {
      toast.error(`Please select ${numberOfSeats} seat(s)`);
      return;
    }
    
    navigate('/payment');
  };

  if (isLoading || !selectedShowtime || !selectedMovie || !selectedTheatre) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-faircut"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-faircut-bg flex flex-col">
      <AppHeader title="Select Seats" showBackButton />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-faircut-light">{selectedMovie.title}</h2>
            <p className="text-faircut-text/70">{selectedShowtime.time} • {selectedShowtime.date} • {selectedShowtime.screen}</p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex items-center space-x-4">
              <Label htmlFor="num-seats" className="text-faircut-text">Number of Seats:</Label>
              <Select
                value={numberOfSeats.toString()}
                onValueChange={handleNumberOfSeatsChange}
              >
                <SelectTrigger id="num-seats" className="w-20 border-faircut/30 bg-black/30 text-faircut-text">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-faircut-accent border-faircut/30">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-faircut-text hover:bg-faircut-dark/50">
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Card className="cyberpunk-card mb-6">
          <CardContent className="p-4">
            {/* Legend */}
            <div className="flex justify-center space-x-8 mb-6 pb-4 border-b border-faircut/20">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-gray-500 mr-2"></div>
                <span className="text-sm text-faircut-text/70">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-faircut mr-2"></div>
                <span className="text-sm text-faircut-text/70">Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-red-500 mr-2"></div>
                <span className="text-sm text-faircut-text/70">Booked</span>
              </div>
            </div>
            
            {/* Screen */}
            <div className="w-full p-2 mb-8 text-center">
              <div className="h-2 bg-faircut/30 rounded-lg mb-1 shadow-lg shadow-faircut/30"></div>
              <p className="text-xs text-faircut-text/50">SCREEN</p>
            </div>
            
            {/* Seats Container */}
            <div className="overflow-x-auto pb-4">
              <div className="max-w-3xl mx-auto">
                {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                  <div key={row} className="flex justify-center mb-2">
                    <div className="w-6 flex items-center justify-center mr-2 text-faircut-text/70">
                      {row}
                    </div>
                    <div className="flex space-x-1 flex-wrap">
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeats.some(s => s.id === seat.id);
                        let bgColor = 'bg-gray-500 hover:bg-gray-400';
                        if (seat.status === 'booked') {
                          bgColor = 'bg-red-500 cursor-not-allowed opacity-70';
                        } else if (isSelected) {
                          bgColor = 'bg-faircut hover:bg-faircut-light';
                        }
                        
                        return (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === 'booked'}
                            className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-medium text-white ${bgColor} transition-colors`}
                            title={`Seat ${seat.row}${seat.number} - ₹${seat.price}`}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price notice */}
            <div className="mt-6 text-center space-y-1">
              <p className="text-sm text-faircut-text/70">
                <span className="font-medium text-faircut-light">Rows A-B:</span> ₹70 per seat (Premium)
              </p>
              <p className="text-sm text-faircut-text/70">
                <span className="font-medium text-faircut-light">Rows C-J:</span> ₹150 per seat (Regular)
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-faircut/20 p-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-faircut-text/70">Selected Seats: {
                selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ') || 'None'
              }</p>
              <p className="font-semibold text-lg text-faircut-light">Total: ₹{totalAmount}</p>
            </div>
            <Button
              onClick={handleProceedToPayment}
              disabled={selectedSeats.length !== numberOfSeats}
              className="bg-faircut hover:bg-faircut-light"
            >
              Proceed to Payment
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default SeatSelectionPage;
