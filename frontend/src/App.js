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
import ScrollObserver from './components/ScrollObserver';

function App() {
  return (
    <Router>
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
