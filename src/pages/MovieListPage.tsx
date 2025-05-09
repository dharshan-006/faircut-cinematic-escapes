
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { theatres, movies } from '@/data/mockData';
import { useBooking } from '@/context/BookingContext';
import AppHeader from '@/components/AppHeader';
import { Movie, Theatre } from '@/types';

const MovieListPage: React.FC = () => {
  const { theatreId } = useParams<{ theatreId: string }>();
  const navigate = useNavigate();
  const { setSelectedMovie } = useBooking();
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  
  useEffect(() => {
    // Find the selected theatre
    const selectedTheatre = theatres.find(t => t.id === theatreId);
    if (selectedTheatre) {
      setTheatre(selectedTheatre);
    } else {
      // Theatre not found, redirect back to theatre list
      navigate('/theatres');
    }
    
    // Set all available movies for now
    setMoviesData(movies);
  }, [theatreId, navigate]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    navigate(`/movies/${movie.id}/showtimes`);
  };

  if (!theatre) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-faircut"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-faircut-bg flex flex-col">
      <AppHeader title={theatre.name} showBackButton />
      
      <main className="flex-1 container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4 text-faircut-light">Now Showing</h2>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {moviesData.map((movie) => (
            <Card 
              key={movie.id} 
              className="cyberpunk-card overflow-hidden hover:animate-pulse-glow transition-all duration-300 cursor-pointer"
              onClick={() => handleSelectMovie(movie)}
            >
              <div className="aspect-[2/3] overflow-hidden">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm mb-1 text-faircut-light truncate">{movie.title}</h3>
                {movie.duration && (
                  <p className="text-xs text-faircut-text/70">{movie.duration}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {moviesData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 text-faircut-text/70">
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
              className="h-12 w-12 mb-4 text-faircut/40"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="12" cy="12" r="3" />
              <path d="M3 12h.01" />
              <path d="M12 3v.01" />
              <path d="M12 21v.01" />
              <path d="M21 12h.01" />
            </svg>
            <p className="text-lg">No movies available</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MovieListPage;
