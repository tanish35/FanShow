import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ArtistDetailsPage from "./pages/ArtistDetails";
import Navbar from "./components/Navbar";

// Placeholder components for other routes
const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;
const NotFound = () => <h1>404: Page Not Found</h1>;

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/artist" element={<ArtistDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
