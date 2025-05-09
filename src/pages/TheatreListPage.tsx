
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import { theatres } from '@/data/mockData';
import AppHeader from '@/components/AppHeader';
import { Theatre } from '@/types';

const TheatreListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCity } = useLocation();
  const { setSelectedTheatre } = useBooking();
  const [filteredTheatres, setFilteredTheatres] = useState<Theatre[]>([]);
  
  useEffect(() => {
    // Filter theatres by current city
    if (currentCity) {
      const filtered = theatres.filter(theatre => theatre.city === currentCity);
      setFilteredTheatres(filtered);
    } else {
      setFilteredTheatres(theatres);
    }
  }, [currentCity]);

  const handleSelectTheatre = (theatre: Theatre) => {
    setSelectedTheatre(theatre);
    navigate(`/theatres/${theatre.id}/movies`);
  };

  return (
    <div className="min-h-screen bg-faircut-bg flex flex-col">
      <AppHeader title={currentCity ? `Theatres in ${currentCity}` : 'Theatres'} showBackButton />
      
      <main className="flex-1 container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4 text-faircut-light">
          Theatres under Fair-Cut
        </h2>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredTheatres.map((theatre) => (
            <Card 
              key={theatre.id} 
              className="cyberpunk-card overflow-hidden hover:animate-pulse-glow transition-all duration-300 cursor-pointer"
              onClick={() => handleSelectTheatre(theatre)}
            >
              <div className="h-40 overflow-hidden">
                <img 
                  src={theatre.image} 
                  alt={theatre.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 text-faircut-light">{theatre.name}</h3>
                <p className="text-sm text-faircut-text/70 mb-2">{theatre.location}</p>
                
                <div className="flex items-center mt-2">
                  {theatre.hasPaymentGateway ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/30">
                      Payment Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                      Demo Only
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredTheatres.length === 0 && (
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
              <path d="M7 7h.01" />
              <path d="M17 7h.01" />
              <path d="M7 17h.01" />
              <path d="M17 17h.01" />
            </svg>
            <p className="text-lg">No theatres found in this area</p>
            <Button 
              variant="link" 
              onClick={() => navigate('/search-city')}
              className="mt-2 text-faircut"
            >
              Change location
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TheatreListPage;
