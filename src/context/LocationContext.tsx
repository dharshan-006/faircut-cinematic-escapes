
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

interface LocationContextType {
  currentCity: string | null;
  setCurrentCity: (city: string) => void;
  requestLocationAccess: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within an LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [currentCity, setCurrentCity] = useState<string | null>(
    localStorage.getItem('faircut-city')
  );

  const requestLocationAccess = async (): Promise<boolean> => {
    try {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
        return false;
      }

      // Show loading toast
      toast.loading('Accessing your location...');

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // In a real app, we would use a geocoding API to get city from coordinates
            // For demo purposes, we'll set it to a default value
            
            // Simulate API call to get city name
            setTimeout(() => {
              toast.dismiss();
              setCurrentCity('Chennai');
              localStorage.setItem('faircut-city', 'Chennai');
              
              toast.success('Location accessed successfully', {
                description: 'Found theatres in Chennai'
              });
              
              resolve(true);
            }, 1500);
          },
          (error) => {
            toast.dismiss();
            console.error('Error getting location:', error);
            toast.error('Failed to access your location');
            resolve(false);
          }
        );
      });
    } catch (error) {
      toast.dismiss();
      console.error('Location access error:', error);
      toast.error('Failed to access your location');
      return false;
    }
  };

  return (
    <LocationContext.Provider
      value={{
        currentCity,
        setCurrentCity,
        requestLocationAccess
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
