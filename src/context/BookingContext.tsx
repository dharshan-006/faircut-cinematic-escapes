
import React, { createContext, useContext, useState } from 'react';
import { Seat, Theatre, Movie, Showtime, Booking } from '@/types';
import { useAuth } from './AuthContext';

interface BookingContextType {
  selectedTheatre: Theatre | null;
  selectedMovie: Movie | null;
  selectedShowtime: Showtime | null;
  selectedSeats: Seat[];
  numberOfSeats: number;
  totalAmount: number;
  setSelectedTheatre: (theatre: Theatre | null) => void;
  setSelectedMovie: (movie: Movie | null) => void;
  setSelectedShowtime: (showtime: Showtime | null) => void;
  setNumberOfSeats: (number: number) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  clearSelectedSeats: () => void;
  resetBooking: () => void;
  currentBooking: Booking | null;
  setCurrentBooking: (booking: Booking | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedTheatre, setSelectedTheatre] = useState<Theatre | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [numberOfSeats, setNumberOfSeats] = useState<number>(1);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  const addSeat = (seat: Seat) => {
    // If we already selected enough seats, don't add more
    if (selectedSeats.length >= numberOfSeats) {
      return;
    }
    
    // If the seat is already selected, don't add it again
    if (selectedSeats.some(s => s.id === seat.id)) {
      return;
    }
    
    setSelectedSeats([...selectedSeats, seat]);
  };

  const removeSeat = (seatId: string) => {
    setSelectedSeats(selectedSeats.filter((seat) => seat.id !== seatId));
  };

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  const resetBooking = () => {
    setSelectedTheatre(null);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setNumberOfSeats(1);
    setCurrentBooking(null);
  };

  // Calculate total amount based on selected seats
  const totalAmount = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  return (
    <BookingContext.Provider
      value={{
        selectedTheatre,
        selectedMovie,
        selectedShowtime,
        selectedSeats,
        numberOfSeats,
        totalAmount,
        setSelectedTheatre,
        setSelectedMovie,
        setSelectedShowtime,
        setNumberOfSeats,
        addSeat,
        removeSeat,
        clearSelectedSeats,
        resetBooking,
        currentBooking,
        setCurrentBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
