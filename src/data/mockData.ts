
import { Theatre, Movie, Showtime, Seat } from '@/types';

// Mock Theatres
export const theatres: Theatre[] = [
  {
    id: 'theatre-1',
    name: 'Light House Cinemas',
    location: 'Anna Nagar, Chennai',
    city: 'Chennai',
    image: 'https://whatsupmonterey.com/subscribers/3/uploaded_files/member/profile/f5e208581db49cec4d3e7acb4b86e995.jpg',
    isActive: true,
    hasPaymentGateway: true
  },
  {
    id: 'theatre-2',
    name: 'KG Cinemas',
    location: 'T Nagar, Chennai',
    city: 'Chennai',
    image: 'https://pbs.twimg.com/media/GCvt7mcbgAAjD4S.jpg',
    isActive: true,
    hasPaymentGateway: false
  },
  {
    id: 'theatre-3',
    name: 'APA Cinemas',
    location: 'Velachery, Chennai',
    city: 'Chennai',
    image: 'https://www.mappls.com/place/ZY9V6T_1661773879954_0.png',
    isActive: true,
    hasPaymentGateway: false
  },
  {
    id: 'theatre-4',
    name: 'Ratnam Talkies',
    location: 'Adyar, Chennai',
    city: 'Chennai',
    image: 'https://ecoimbatore.com/wp-content/uploads/2021/06/cinema.jpg',
    isActive: true,
    hasPaymentGateway: false
  }
];

// Mock Movies
export const movies: Movie[] = [
  {
    id: 'movie-1',
    title: 'Cosmic Odyssey',
    posterUrl: 'https://images.unsplash.com/photo-1636572481914-a07d36917486?q=80&w=2070',
    description: 'A journey beyond the stars',
    duration: '2h 15m'
  },
  {
    id: 'movie-2',
    title: 'Neon Nights',
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070',
    description: 'A cyberpunk thriller',
    duration: '1h 55m'
  },
  {
    id: 'movie-3',
    title: 'Digital Dreams',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070',
    description: 'Reality is just an illusion',
    duration: '2h 30m'
  },
  {
    id: 'movie-4',
    title: 'Quantum Leap',
    posterUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070',
    description: 'The future is now',
    duration: '2h 5m'
  }
];

// Mock Showtimes
export const showtimes: Showtime[] = [
  // Showtimes for theatre-1, movie-1
  {
    id: 'showtime-1',
    movieId: 'movie-1',
    theatreId: 'theatre-1',
    screen: 'Screen 1',
    time: '10:00 AM',
    date: '2025-05-10'
  },
  {
    id: 'showtime-2',
    movieId: 'movie-1',
    theatreId: 'theatre-1',
    screen: 'Screen 2',
    time: '1:30 PM',
    date: '2025-05-10'
  },
  
  // Showtimes for theatre-1, movie-2
  {
    id: 'showtime-3',
    movieId: 'movie-2',
    theatreId: 'theatre-1',
    screen: 'Screen 1',
    time: '4:00 PM',
    date: '2025-05-10'
  },
  {
    id: 'showtime-4',
    movieId: 'movie-2',
    theatreId: 'theatre-1',
    screen: 'Screen 2',
    time: '7:30 PM',
    date: '2025-05-10'
  },
  
  // Add more showtimes for other theatres and movies as needed
  {
    id: 'showtime-5',
    movieId: 'movie-3',
    theatreId: 'theatre-2',
    screen: 'Screen 1',
    time: '11:00 AM',
    date: '2025-05-10'
  },
  {
    id: 'showtime-6',
    movieId: 'movie-4',
    theatreId: 'theatre-3',
    screen: 'Screen 2',
    time: '3:00 PM',
    date: '2025-05-10'
  }
];

// Generate seats for a showtime
export const generateSeats = (showtimeId: string): Seat[] => {
  const seats: Seat[] = [];
  
  // Create rows A-J
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  // Create seats 1-20 for each row
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= 20; i++) {
      const seatId = `${row}${i}`;
      
      // First two rows (A and B) are premium seats with lower price
      const price = rowIndex < 2 ? 70 : 150;
      
      seats.push({
        id: `${showtimeId}-${seatId}`,
        row,
        number: i.toString(),
        price,
        status: Math.random() > 0.8 ? 'booked' : 'available' // Randomly mark some seats as booked
      });
    }
  });
  
  return seats;
};
