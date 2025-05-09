
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { movies, showtimes } from '@/data/mockData';
import { useBooking } from '@/context/BookingContext';
import AppHeader from '@/components/AppHeader';
import { Movie, Showtime } from '@/types';

const ShowtimePage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { selectedTheatre, setSelectedShowtime } = useBooking();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [availableShowtimes, setAvailableShowtimes] = useState<Showtime[]>([]);
  
  useEffect(() => {
    // Find the selected movie
    const selectedMovie = movies.find(m => m.id === movieId);
    if (selectedMovie) {
      setMovie(selectedMovie);
    } else {
      // Movie not found, redirect back to movies list
      navigate(-1);
    }
    
    // Filter showtimes for this movie and theatre
    if (selectedTheatre && movieId) {
      const filtered = showtimes.filter(
        st => st.movieId === movieId && st.theatreId === selectedTheatre.id
      );
      setAvailableShowtimes(filtered);
    }
  }, [movieId, selectedTheatre, navigate]);

  const handleSelectShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    navigate(`/showtimes/${showtime.id}/seats`);
  };

  if (!movie || !selectedTheatre) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-faircut"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-faircut-bg flex flex-col">
      <AppHeader title={movie.title} showBackButton />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Movie poster and details */}
          <div className="md:w-1/3">
            <Card className="cyberpunk-card overflow-hidden">
              <div className="aspect-[2/3] overflow-hidden">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-faircut-light">{movie.title}</h2>
                {movie.duration && (
                  <p className="text-sm text-faircut-text/70 mt-1">{movie.duration}</p>
                )}
                {movie.description && (
                  <p className="text-sm text-faircut-text/80 mt-3">{movie.description}</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Showtimes */}
          <div className="md:w-2/3">
            <h2 className="text-xl font-semibold mb-4 text-faircut-light">Available Showtimes</h2>
            
            <div className="space-y-4">
              {availableShowtimes.map((showtime) => (
                <Card 
                  key={showtime.id} 
                  className="cyberpunk-card overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-faircut-light">{showtime.time} • {showtime.date}</h3>
                        <p className="text-sm text-faircut-text/70">{showtime.screen}</p>
                      </div>
                      <Button 
                        onClick={() => handleSelectShowtime(showtime)}
                        className="bg-faircut hover:bg-faircut-light"
                      >
                        Book Seats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {availableShowtimes.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-faircut-text/70">
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
                    className="h-8 w-8 mb-4 text-faircut/40"
                  >
                    <path d="M9.5 2h5" />
                    <path d="M12 2v7" />
                    <path d="M15.5 14h-7" />
                    <path d="M12 9v15" />
                  </svg>
                  <p className="text-lg">No showtimes available</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate(-1)}
                    className="mt-2 text-faircut"
                  >
                    Go back
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShowtimePage;
