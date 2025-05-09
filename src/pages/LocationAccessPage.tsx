
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLocation } from '@/context/LocationContext';
import Logo from '@/components/Logo';

const LocationAccessPage = () => {
  const { requestLocationAccess } = useLocation();
  const navigate = useNavigate();

  const handleAllowLocation = async () => {
    const locationGranted = await requestLocationAccess();
    if (locationGranted) {
      navigate('/theatres');
    }
  };

  const handleManualCitySelection = () => {
    navigate('/search-city');
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
              Location Access
            </CardTitle>
            <CardDescription className="text-center text-faircut-text/80">
              Allow location access to find nearby theaters
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="rounded-full p-4 bg-faircut/20 mb-2">
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
                className="h-12 w-12 text-faircut-light"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <p className="text-faircut-text/90 text-center">
              To show you theaters near you, we need access to your location. 
              This helps us find the best movie options in your area.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={handleAllowLocation}
              className="w-full bg-faircut hover:bg-faircut-light"
            >
              Allow Location Access
            </Button>
            <Button
              variant="outline"
              onClick={handleManualCitySelection}
              className="w-full border-faircut/30 text-faircut-light hover:bg-faircut-accent/50"
            >
              Enter Location Manually
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LocationAccessPage;
