
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { movies, theatres } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { Movie } from '@/types';

const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const [newMovie, setNewMovie] = useState<Partial<Movie>>({
    title: '',
    posterUrl: '',
    description: '',
    duration: '',
  });

  const handleMovieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMovie(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.posterUrl) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success(`Movie "${newMovie.title}" added successfully`);
    
    // Reset form
    setNewMovie({
      title: '',
      posterUrl: '',
      description: '',
      duration: '',
    });
  };

  return (
    <div className="min-h-screen bg-faircut-bg flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-faircut/20 bg-faircut-accent/90 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-3xl font-bold tracking-tighter text-faircut-light">
                FAIR
                <span className="text-2xl font-light">-</span>
                <span className="text-3xl font-bold text-red-500">CUT</span>
              </span>
            </div>
            <h1 className="text-lg font-semibold tracking-wider text-faircut-text ml-4">
              Admin Dashboard
            </h1>
          </div>

          <Button
            variant="ghost"
            onClick={() => logout()}
            className="text-faircut-text hover:bg-faircut-dark/30"
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
              className="h-5 w-5 mr-2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="movies" className="data-[state=active]:bg-faircut data-[state=active]:text-white">Movies</TabsTrigger>
            <TabsTrigger value="showtimes" className="data-[state=active]:bg-faircut data-[state=active]:text-white">Showtimes</TabsTrigger>
            <TabsTrigger value="theatres" className="data-[state=active]:bg-faircut data-[state=active]:text-white">Theatres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="movies">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add New Movie Form */}
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="text-xl text-faircut-light">Add New Movie</CardTitle>
                  <CardDescription className="text-faircut-text/70">
                    Create a new movie listing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddMovie} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-faircut-text">Movie Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter movie title"
                        value={newMovie.title}
                        onChange={handleMovieChange}
                        className="border-faircut/30 bg-black/30 text-faircut-text"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="posterUrl" className="text-faircut-text">Poster URL</Label>
                      <Input
                        id="posterUrl"
                        name="posterUrl"
                        placeholder="Enter poster image URL"
                        value={newMovie.posterUrl}
                        onChange={handleMovieChange}
                        className="border-faircut/30 bg-black/30 text-faircut-text"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-faircut-text">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Enter movie description"
                        value={newMovie.description}
                        onChange={handleMovieChange}
                        className="border-faircut/30 bg-black/30 text-faircut-text"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-faircut-text">Duration</Label>
                      <Input
                        id="duration"
                        name="duration"
                        placeholder="e.g. 2h 15m"
                        value={newMovie.duration}
                        onChange={handleMovieChange}
                        className="border-faircut/30 bg-black/30 text-faircut-text"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-faircut hover:bg-faircut-light">
                      Add Movie
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Movie List */}
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="text-xl text-faircut-light">Current Movies</CardTitle>
                  <CardDescription className="text-faircut-text/70">
                    Manage existing movies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {movies.map((movie) => (
                      <div 
                        key={movie.id} 
                        className="flex items-center p-2 border border-faircut/20 rounded-md bg-faircut-accent/30"
                      >
                        <div className="w-12 h-16 overflow-hidden rounded mr-3">
                          <img 
                            src={movie.posterUrl} 
                            alt={movie.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-faircut-light truncate">{movie.title}</h4>
                          <p className="text-xs text-faircut-text/70 truncate">{movie.duration}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="ml-2 text-faircut-text/70 hover:text-red-400 hover:bg-red-900/20"
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
                            className="h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="showtimes">
            <Card className="cyberpunk-card">
              <CardHeader>
                <CardTitle className="text-xl text-faircut-light">Showtimes Management</CardTitle>
                <CardDescription className="text-faircut-text/70">
                  Add and edit movie showtimes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="movie" className="text-faircut-text">Select Movie</Label>
                      <Select>
                        <SelectTrigger className="border-faircut/30 bg-black/30 text-faircut-text">
                          <SelectValue placeholder="Select movie" />
                        </SelectTrigger>
                        <SelectContent className="bg-faircut-accent border-faircut/30">
                          {movies.map(movie => (
                            <SelectItem key={movie.id} value={movie.id} className="text-faircut-text">
                              {movie.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="theatre" className="text-faircut-text">Select Theatre</Label>
                      <Select>
                        <SelectTrigger className="border-faircut/30 bg-black/30 text-faircut-text">
                          <SelectValue placeholder="Select theatre" />
                        </SelectTrigger>
                        <SelectContent className="bg-faircut-accent border-faircut/30">
                          {theatres.map(theatre => (
                            <SelectItem key={theatre.id} value={theatre.id} className="text-faircut-text">
                              {theatre.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="screen" className="text-faircut-text">Screen</Label>
                      <Select>
                        <SelectTrigger className="border-faircut/30 bg-black/30 text-faircut-text">
                          <SelectValue placeholder="Select screen" />
                        </SelectTrigger>
                        <SelectContent className="bg-faircut-accent border-faircut/30">
                          <SelectItem value="1" className="text-faircut-text">Screen 1</SelectItem>
                          <SelectItem value="2" className="text-faircut-text">Screen 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="time" className="text-faircut-text">Show Time</Label>
                      <Input
                        id="time"
                        placeholder="e.g. 10:00 AM"
                        className="border-faircut/30 bg-black/30 text-faircut-text"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="date" className="text-faircut-text">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        className="border-faircut/30 bg-black/30 text-faircut-text"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-faircut hover:bg-faircut-light">
                    Add Showtime
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="theatres">
            <Card className="cyberpunk-card">
              <CardHeader>
                <CardTitle className="text-xl text-faircut-light">Theatre Management</CardTitle>
                <CardDescription className="text-faircut-text/70">
                  View and manage theatres
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {theatres.map((theatre) => (
                    <div 
                      key={theatre.id} 
                      className="flex items-center p-3 border border-faircut/20 rounded-md bg-faircut-accent/30"
                    >
                      <div className="w-16 h-16 overflow-hidden rounded mr-4">
                        <img 
                          src={theatre.image} 
                          alt={theatre.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-faircut-light">{theatre.name}</h4>
                        <p className="text-sm text-faircut-text/70">{theatre.location}</p>
                        <p className="text-xs text-faircut-text/50">{theatre.city}</p>
                      </div>
                      <div className="ml-4">
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
