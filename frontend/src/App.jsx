import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import BookingStatus from './pages/BookingStatus';
import CheckIn from './pages/CheckIn';
import About from './pages/About';
import Activities from './pages/Activities';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import FAQ from './pages/FAQ';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking/status/:id" element={<BookingStatus />} />
            <Route path="/booking/status" element={<BookingStatus />} />
            <Route path="/booking/checkin/:id" element={<CheckIn />} />
            <Route path="/booking/checkin" element={<CheckIn />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
