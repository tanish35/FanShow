import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Toaster } from "sonner";
import "./App.css";
import { Navigation } from "./components/Navbar";
import ArtistDetailsPage from "./pages/ArtistDetails";
import ConcertBooking from "./pages/BookingPage";
import SpotifyLogin from "./pages/SpotifyLogin";
import ProtectedSpotifyRoute from "./routes/ProtectedSpotifyRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import TicketPage from "./pages/TicketPage";

// const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;
const NotFound = () => <h1>404: Page Not Found</h1>;

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/artist" element={<ArtistDetailsPage />} />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:id"
            element={
              <ProtectedSpotifyRoute>
                <ConcertBooking />
              </ProtectedSpotifyRoute>
            }
          />
          <Route
            path="/spotify"
            element={
              <ProtectedRoute>
                <SpotifyLogin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
