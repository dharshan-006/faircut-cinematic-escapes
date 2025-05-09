
export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  isAdmin?: boolean;
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
  city: string;
  image: string;
  isActive: boolean;
  hasPaymentGateway: boolean;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  description?: string;
  duration?: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  theatreId: string;
  screen: string;
  time: string;
  date: string;
}

export interface Seat {
  id: string;
  row: string;
  number: string;
  price: number;
  status: 'available' | 'selected' | 'booked';
}

export interface Booking {
  id: string;
  userId: string;
  showtimeId: string;
  seats: Seat[];
  totalAmount: number;
  bookingDate: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
}
