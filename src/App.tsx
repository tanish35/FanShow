import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import Navbar from "./components/Navbar";
import ArtistDetailsPage from "./pages/ArtistDetails";
import ConcertBooking from "./pages/BookingPage";
import SpotifyLogin from "./pages/SpotifyLogin";

const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;
const NotFound = () => <h1>404: Page Not Found</h1>;

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/artist" element={<ArtistDetailsPage />} />
          <Route path="/booking/:id" element={<ConcertBooking />} />
          <Route path="/spotify-login" element={<SpotifyLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
