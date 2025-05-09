
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from '@/context/LocationContext';
import AppHeader from '@/components/AppHeader';
import { toast } from 'sonner';

const CITIES = [
  'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Coimbatore'
];

const CitySearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentCity } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>(CITIES);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value) {
      const filtered = CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(CITIES);
    }
  };

  const handleSelectCity = (city: string) => {
    setCurrentCity(city);
    toast.success(`Location set to ${city}`);
    navigate('/theatres');
  };

  return (
    <div className="min-h-screen bg-faircut-bg flex flex-col">
      <AppHeader title="Select Your City" showBackButton />
      
      <main className="flex-1 container max-w-md mx-auto p-4">
        <Card className="cyberpunk-card">
          <CardHeader>
            <CardTitle className="text-xl text-faircut-text">Search City</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search for your city"
                  className="border-faircut/30 bg-black/30 text-faircut-text pl-10"
                />
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-faircut-text/50"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              
              <div className="mt-4 space-y-2">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <Button
                      key={city}
                      variant="ghost"
                      onClick={() => handleSelectCity(city)}
                      className="w-full justify-start text-faircut-text hover:bg-faircut-accent/50 hover:text-faircut-light"
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
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {city}
                    </Button>
                  ))
                ) : (
                  <p className="text-center text-faircut-text/70 py-4">
                    No cities found matching "{searchTerm}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CitySearchPage;
