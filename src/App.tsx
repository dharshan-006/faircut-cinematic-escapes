
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { BookingProvider } from "@/context/BookingContext";

import LoginPage from "./pages/LoginPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import LocationAccessPage from "./pages/LocationAccessPage";
import CitySearchPage from "./pages/CitySearchPage";
import TheatreListPage from "./pages/TheatreListPage";
import MovieListPage from "./pages/MovieListPage";
import ShowtimePage from "./pages/ShowtimePage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import TicketPage from "./pages/TicketPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <BookingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-center" />
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/verify-otp" element={<OtpVerificationPage />} />
                
                <Route path="/admin" element={<AdminRoute />}>
                  <Route path="" element={<AdminDashboardPage />} />
                </Route>

                <Route path="/" element={<ProtectedRoute />}>
                  <Route path="location-access" element={<LocationAccessPage />} />
                  <Route path="search-city" element={<CitySearchPage />} />
                  <Route path="theatres" element={<TheatreListPage />} />
                  <Route path="theatres/:theatreId/movies" element={<MovieListPage />} />
                  <Route path="movies/:movieId/showtimes" element={<ShowtimePage />} />
                  <Route path="showtimes/:showtimeId/seats" element={<SeatSelectionPage />} />
                  <Route path="payment" element={<PaymentPage />} />
                  <Route path="ticket" element={<TicketPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BookingProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
