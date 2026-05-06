import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import ScrollObserver from './components/ScrollObserver';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

// ✅ Code Splitting — pages load only when visited
const Home          = lazy(() => import('./pages/Home'));
const Rooms         = lazy(() => import('./pages/Rooms'));
const Gallery       = lazy(() => import('./pages/Gallery'));
const Booking       = lazy(() => import('./pages/Booking'));
const Contact       = lazy(() => import('./pages/Contact'));
const FAQ           = lazy(() => import('./pages/FAQ'));
const BookingStatus = lazy(() => import('./pages/BookingStatus'));
const AdminLogin    = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard= lazy(() => import('./pages/AdminDashboard'));
const CheckIn       = lazy(() => import('./pages/CheckIn'));

// Lightweight page-transition spinner
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F5EDE6'
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid #EAEAEA',
        borderTopColor: '#D4A857',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite'
      }} />
    </div>
  );
}

ReactGA.initialize('G-9BB0MG8X0X');

function Analytics() {
  const location = useLocation();
  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
  return null;
}

function App() {
  React.useEffect(() => {
    const handleOffline = () => alert('⚠️ Internet connection lost! Please check your network.');
    const handleOnline = () => alert('✅ Back online! You can continue.');

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <Analytics />
        <ScrollObserver />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin routes - no navbar/footer */}
            <Route path="/admin/login"      element={<AdminLogin />} />
            <Route path="/admin/dashboard"  element={<AdminDashboard />} />

            {/* Public routes */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/"                   element={<Home />} />
                  <Route path="/rooms"              element={<Rooms />} />
                  <Route path="/gallery"            element={<Gallery />} />
                  <Route path="/booking"            element={<Booking />} />
                  <Route path="/booking/status"     element={<BookingStatus />} />
                  <Route path="/booking/status/:id" element={<BookingStatus />} />
                  <Route path="/contact"            element={<Contact />} />
                  <Route path="/faq"                element={<FAQ />} />
                  <Route path="/checkin"            element={<CheckIn />} />
                  <Route path="/checkin/:id"        element={<CheckIn />} />
                </Routes>
                <Footer />
                <FloatingContact />
              </>
            } />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
