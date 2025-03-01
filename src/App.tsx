import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ArtistDetailsPage from "./pages/ArtistDetails";

// Placeholder components for other routes
const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;
const NotFound = () => <h1>404: Page Not Found</h1>;

function App() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/artist">Artist Details</Link>
            </li>
          </ul>
        </nav> */}

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
