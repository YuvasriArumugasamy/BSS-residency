import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import BookingStatus from './pages/BookingStatus';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CheckIn from './pages/CheckIn';
import ScrollObserver from './components/ScrollObserver';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

// Initialize GA4 - Replace with your actual Measurement ID (e.g., 'G-XXXXXXXXXX')
ReactGA.initialize('G-9BB0MG8X0X');

function Analytics() {
  const location = useLocation();
  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
  return null;
}

function App() {
  return (
    <Router>
      <Analytics />
      <ScrollObserver />
      <Routes>
        {/* Admin routes - no navbar/footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Public routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking/status" element={<BookingStatus />} />
              <Route path="/booking/status/:id" element={<BookingStatus />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkin" element={<CheckIn />} />
              <Route path="/checkin/:id" element={<CheckIn />} />
            </Routes>
            <Footer />
            <FloatingContact />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
