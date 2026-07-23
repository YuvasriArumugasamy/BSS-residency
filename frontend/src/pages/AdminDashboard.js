import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  LayoutDashboard, Bed, CalendarCheck, Users, CreditCard, PieChart, Settings, MessageSquare, Bell, LogOut, ExternalLink, RefreshCcw, Plus, Trash2, Edit3, CheckCircle, XCircle, Clock, X, MessageCircle, ClipboardCheck, Calendar, Image, Lock, Eye, EyeOff, Globe
} from 'lucide-react';
import api, { API_BASE_URL } from '../api/axios';
import { setAppBadgeCount, clearAppBadge } from '../utils/appBadge';
import './Admin.css';

// --- TRANSLATIONS ---
const ADMIN_TEXT = {
  en: {
    dashboard: 'Dashboard', rooms: 'Rooms', bookings: 'Bookings', calendar: 'Calendar',
    guests: 'Guests', payments: 'Payments', reports: 'Reports', settings: 'Settings',
    reviews: 'Reviews', gallery: 'Gallery', notifications: 'Notifications',
    logout: 'Logout', administrator: 'Administrator',
    refresh: 'Refresh', viewSite: 'View Site',
    workWith: 'Work with real occupancy and data logs',
  },
  ta: {
    dashboard: 'அடுக்கல் பலகை', rooms: 'அறைகள்', bookings: 'முன்பதிவுகள்', calendar: 'நாட்காட்டம்',
    guests: 'விருந்தினர்', payments: 'கொடுப்புகள்', reports: 'அறிக்கைகள்', settings: 'அமைப்புகள்',
    reviews: 'மதிப்பீடுகள்', gallery: 'படங்கள்', notifications: 'அறிவிப்புகள்',
    logout: 'வெளியேறு', administrator: 'நிர்வாகி',
    refresh: 'புதுப்பிக்கவும்', viewSite: 'தளம் பார்க்கவும்',
    workWith: 'மைய்மையான தகவல்களுடன் பணியாற்றுகிறீர்கள்',
  }
};



// --- TRANSLATIONS FOR VIEWS ---
const DASHBOARD_LANG = {
  en: {
    totalRooms: 'Total Rooms',
    totalBookings: 'Total Bookings',
    availableRooms: 'Available Rooms',
    checkinsToday: 'Today Check-ins',
    checkoutsToday: 'Today Check-outs',
    realtime: 'Real-time update',
    revenueSummary: 'Revenue Summary',
    recentBookings: 'Recent Bookings',
    guest: 'Guest',
    room: 'Room',
    status: 'Status',
    booked: 'Booked',
    stay: 'Stay',
    monthView: 'Month View',
    allTime: 'All Time',
    manageInventory: 'Manage your inventory and pricing',
    resetLayout: 'Reset Layout',
    addRoom: 'Add Room',
    noRooms: 'No rooms added yet.',
    priceNight: 'price/night',
    weekday: 'Weekday',
    weekend: 'Weekend',
    peak: 'Peak',
    bookingManagement: 'Booking Management',
    addOfflineBooking: 'Add Offline Booking',
    filterAll: 'All',
    filterPending: 'Pending',
    filterConfirmed: 'Confirmed',
    filterCheckedOut: 'Checked-out',
    filterCancelled: 'Cancelled',
    showingBookings: 'Showing',
    bookingsFound: 'bookings',
    assignRoom: 'Assign Room',
    onlineCIDone: 'Online CI Done',
    noBookingsFound: 'No bookings found.',
    actionConfirm: 'Confirm Booking',
    actionCheckout: 'Check-out',
    actionWhatsapp: 'WhatsApp Guest',
    actionCancel: 'Cancel Booking',
    actionViewCheckin: 'View Check-in',
    actionAddPayment: 'Add Payment',
    actionDelete: 'Delete',
    transactionHistory: 'Transaction History',
    activePayments: 'Active Payments',
    noPayments: 'No payment records.',
    date: 'Date',
    amount: 'Amount',
    method: 'Method',
    occupancyByType: 'Occupancy by Room Type',
    keyMetrics: 'Key Metrics',
    avgRev: 'Avg Rev / Booking',
    confRate: 'Confirmation Rate',
    systemSettings: 'System Settings',
    manageLodge: "Manage your lodge's global configuration and seasonal pricing.",
    pushNotif: 'Push Notifications',
    receiveAlerts: 'Receive instant alerts on this device when a new booking is requested or paid.',
    enableAlerts: 'Enable Alerts',
    resyncAlerts: 'Resync Alerts',
    peakSeasonPricing: 'Peak Season Pricing',
    peakSeasonDesc: 'When activated, the website will automatically transition to peak season rates (₹1300 / ₹2500).',
    weekendPricing: 'Weekend Pricing (Fri–Sun)',
    weekendDesc: 'When activated, the website automatically applies higher weekend rates on Friday, Saturday, and Sunday.',
    peakRatesLive: 'PEAK SEASON RATES ARE LIVE',
    regularRatesLive: 'REGULAR RATES ARE LIVE',
    weekendRatesEnabled: 'WEEKEND RATES (FRI–SUN) ARE ENABLED',
    weekendRatesDisabled: 'WEEKEND RATES ARE DISABLED (WEEKDAY RATES APPLY)',
    loginCredentials: 'Login Credentials',
    updateLoginDesc: 'Update your admin credentials. You will be logged out after changing these.',
    newUsername: 'New Username',
    newPassword: 'New Password',
    currentPassword: 'Current Password (Required to Save)',
    updateLoginBtn: 'Update Login Details',
    noReviews: 'No guest reviews yet for this period.',
    uploadPhoto: 'Upload New Photo',
    titleCaption: 'Title / Caption',
    selectImage: 'Select Image File',
    uploadBtn: 'Upload to Gallery',
    uploading: 'Uploading...',
    clearAll: 'Clear All',
    noNotifications: 'No notifications yet for this period.',
    prev14: '◀ Prev 14 Days',
    next14: 'Next 14 Days ▶',
    todayBtn: 'Today',
    startDateLabel: 'Start Date:',
    allRoomTypes: 'All Room Types',
    doubleBed: 'Double Bed',
    doubleBedAc: 'Double Bed A/C',
    threeBed: 'Three Bed',
    fourBedAc: 'Four Bed A/C',
    roomAllocations: 'Room Allocations',
    allocationsDesc: 'Bookings in this 14-day window that are confirmed but do not have an assigned physical room number. Assign them below:',
    allAssigned: 'All Bookings Assigned!',
    noPendingAlloc: 'No pending room allocations.',
    availableRoomsCalendar: 'Available Rooms',
    selectRoomCalendar: '-- Select a Room --',
    noRoomsFoundCalendar: 'No matching free rooms found!',
    blocked: 'Blocked',
    bookCell: '+ Book',
    modalRoomTitleEdit: 'Edit Room',
    modalRoomTitleAdd: 'Add New Room',
    modalRoomNumber: 'Room Number',
    modalRoomType: 'Room Type',
    modalWeekdayPrice: 'Weekday Price (Mon-Thu) (₹)',
    modalWeekendPrice: 'Weekend Price (Fri-Sun) (₹)',
    modalPeakPrice: 'Peak Season Price (₹)',
    modalStatus: 'Status',
    modalAvailable: 'Available',
    modalOccupied: 'Occupied',
    modalMaintenance: 'Maintenance',
    modalUpdateRoomBtn: 'Update Room',
    modalCreateRoomBtn: 'Create Room',
    modalPaymentRecord: 'Record Payment',
    modalGuestName: 'Guest Name',
    modalPaymentAmount: 'Amount (₹)',
    modalPaymentMethod: 'Payment Method',
    modalPaymentStatus: 'Status',
    modalSavePayment: 'Record Payment',
    modalSaving: 'Saving...',
    modalOfflineTitle: 'Add Offline Booking',
    modalOfflineCustName: 'Customer Name *',
    modalOfflinePhone: 'Phone Number *',
    modalOfflineEmail: 'Email Address',
    modalOfflineNumRooms: 'Number of Rooms',
    modalOfflineCheckinDate: 'Check-In Date *',
    modalOfflineCheckinTime: 'Check-In Time *',
    modalOfflineCheckoutDate: 'Check-Out Date *',
    modalOfflineCheckoutTime: 'Check-Out Time *',
    modalOfflineGuests: 'Guests',
    modalOfflineAdvance: 'Advance Paid (₹)',
    modalOfflineSpecialNotes: 'Special Notes',
    modalOfflineConfirmBtn: 'Confirm Offline Booking',
    modalOfflineAdding: 'Adding Offline Booking...',
    modalCheckinDetailsTitle: 'Online Check-in Details',
    modalCheckinFullName: 'Full Name',
    modalCheckinAgeGender: 'Age / Gender',
    modalCheckinAddress: 'Address',
    modalCheckinIdProof: 'ID Proof',
    modalCheckinVehicle: 'Vehicle Number',
    modalCheckinAddGuests: 'Additional Guests',
    modalCheckinSpecialRequests: 'Special Requests',
    modalCheckinIdImage: 'ID Proof Image',
    modalCheckinClose: 'Close Details',
    phone: 'Phone',
    checkinCheckout: 'Check-in/out',
    actions: 'Actions',
    totalRevenue: 'Total Revenue',
    guestName: 'Guest Name',
    totalStays: 'Total Stays',
    level: 'Level',
    noGuests: 'No guest records.'
  },
  ta: {
    totalRooms: 'மொத்த அறைகள்',
    totalBookings: 'மொத்த முன்பதிவுகள்',
    availableRooms: 'கிடைக்கும் அறைகள்',
    checkinsToday: 'இன்றைய வருகைகள்',
    checkoutsToday: 'இன்றைய வெளியேற்றங்கள்',
    realtime: 'உடனடி புதுப்பிப்பு',
    revenueSummary: 'வருவாய் சுருக்கம்',
    recentBookings: 'சமீபத்திய முன்பதிவுகள்',
    guest: 'விருந்தினர்',
    room: 'அறை',
    status: 'நிலை',
    booked: 'பதிவு செய்யப்பட்டது',
    stay: 'தங்குதல்',
    monthView: 'மாதாந்திர பார்வை',
    allTime: 'அனைத்து காலம்',
    manageInventory: 'அறை இருப்பு மற்றும் விலையை நிர்வகிக்கவும்',
    resetLayout: 'அமைப்பை மீட்டமை',
    addRoom: 'அறை சேர்க்கவும்',
    noRooms: 'அறைகள் எதுவும் சேர்க்கப்படவில்லை.',
    priceNight: 'விலை/இரவு',
    weekday: 'வார நாட்கள்',
    weekend: 'வார இறுதி',
    peak: 'சீசன் காலம்',
    bookingManagement: 'முன்பதிவு மேலாண்மை',
    addOfflineBooking: 'ஆஃப்லைன் பதிவு சேர்க்க',
    filterAll: 'அனைத்தும்',
    filterPending: 'நிலுவையில்',
    filterConfirmed: 'உறுதி செய்யப்பட்டது',
    filterCheckedOut: 'வெளியேறியது',
    filterCancelled: 'ரத்து செய்யப்பட்டது',
    showingBookings: 'காண்பிக்கப்படுகிறது',
    bookingsFound: 'முன்பதிவுகள்',
    assignRoom: 'அறை ஒதுக்குக',
    onlineCIDone: 'ஆன்லைன் செக்-இன் முடிந்தது',
    noBookingsFound: 'முன்பதிவுகள் எதுவும் இல்லை.',
    actionConfirm: 'முன்பதிவை உறுதிசெய்',
    actionCheckout: 'செக்-அவுட்',
    actionWhatsapp: 'வாட்ஸ்அப் செய்தி',
    actionCancel: 'முன்பதிவை ரத்துசெய்',
    actionViewCheckin: 'செக்-இன் விபரம்',
    actionAddPayment: 'வருவாய் சேர்க்க',
    actionDelete: 'அழி',
    transactionHistory: 'பரிவர்த்தனை வரலாறு',
    activePayments: 'செயலில் உள்ள கொடுப்புகள்',
    noPayments: 'பரிவர்த்தனைகள் எதுவும் இல்லை.',
    date: 'தேதி',
    amount: 'தொகை',
    method: 'முறை',
    occupancyByType: 'அறை வகை வாரியாக பயன்பாடு',
    keyMetrics: 'முக்கிய அளவீடுகள்',
    avgRev: 'சராசரி வருவாய் / பதிவு',
    confRate: 'உறுதிப்படுத்தல் விகிதம்',
    systemSettings: 'அமைப்புகள்',
    manageLodge: 'விடுதியின் பொதுவான உள்ளமைவு மற்றும் விலையை நிர்வகிக்கவும்.',
    pushNotif: 'புஷ் அறிவிப்புகள்',
    receiveAlerts: 'புதிய முன்பதிவு அல்லது கட்டணம் செலுத்தப்படும் போது இந்த சாதனத்தில் உடனடி அறிவிப்புகளைப் பெறுங்கள்.',
    enableAlerts: 'அறிவிப்புகளை இயக்கு',
    resyncAlerts: 'மீண்டும் இணைக்கவும்',
    peakSeasonPricing: 'உச்ச சீசன் விலை',
    peakSeasonDesc: 'செயல்படுத்தப்படும் போது, இணையதளம் தானாகவே சீசன் விலைக்கு மாறும் (₹1300 / ₹2500).',
    weekendPricing: 'வார இறுதி விலை (வெள்ளி–ஞாயிறு)',
    weekendDesc: 'செயல்படுத்தப்படும் போது, இணையதளம் வெள்ளி, சனி மற்றும் ஞாயிற்றுக்கிழமைகளில் வார இறுதி விலையைப் பயன்படுத்தும்.',
    peakRatesLive: 'உச்ச சீசன் கட்டணங்கள் அமலில் உள்ளன',
    regularRatesLive: 'சாதாரண கட்டணங்கள் அமலில் உள்ளன',
    weekendRatesEnabled: 'வார இறுதி கட்டணங்கள் அனுமதிக்கப்பட்டுள்ளன',
    weekendRatesDisabled: 'வார இறுதி கட்டணங்கள் முடக்கப்பட்டுள்ளன (வார நாள் கட்டணங்கள் பொருந்தும்)',
    loginCredentials: 'உள்நுழைவு சான்றுகள்',
    updateLoginDesc: 'உங்கள் உள்நுழைவு விபரங்களை மாற்றவும். மாற்றிய பின் வெளியேற்றப்படுவீர்கள்.',
    newUsername: 'புதிய பயனர் பெயர்',
    newPassword: 'புதிய கடவுச்சொல்',
    currentPassword: 'தற்போதைய கடவுச்சொல் (சேமிக்க அவசியம்)',
    updateLoginBtn: 'விபரங்களை புதுப்பி',
    noReviews: 'இந்த காலத்தில் மதிப்பீடுகள் எதுவும் இல்லை.',
    uploadPhoto: 'புதிய படம் பதிவேற்றவும்',
    titleCaption: 'தலைப்பு / விபரம்',
    selectImage: 'படத்தைத் தேர்ந்தெடுக்கவும்',
    uploadBtn: 'பதிவேற்றவும்',
    uploading: 'பதிவேற்றப்படுகிறது...',
    clearAll: 'அனைத்தையும் அழி',
    noNotifications: 'இந்த காலத்தில் அறிவிப்புகள் எதுவும் இல்லை.',
    prev14: '◀ முந்தைய 14 நாட்கள்',
    next14: 'அடுத்த 14 நாட்கள் ▶',
    todayBtn: 'இன்று',
    startDateLabel: 'தொடக்க தேதி:',
    allRoomTypes: 'அனைத்து அறை வகைகள்',
    doubleBed: 'Double Bed',
    doubleBedAc: 'Double Bed A/C',
    threeBed: 'Three Bed',
    fourBedAc: 'Four Bed A/C',
    roomAllocations: 'அறை ஒதுக்கீடுகள்',
    allocationsDesc: 'இந்த 14 நாட்களில் உறுதி செய்யப்பட்டு அறை எண் ஒதுக்கப்படாத பட்டியல்கள் கீழே உள்ளன. அவற்றை ஒதுக்கவும்:',
    allAssigned: 'அனைத்து முன்பதிவுகளும் ஒதுக்கப்பட்டன!',
    noPendingAlloc: 'நிலுவையில் உள்ள ஒதுக்கீடுகள் எதுவும் இல்லை.',
    availableRoomsCalendar: 'கிடைக்கும் அறைகள்',
    selectRoomCalendar: '-- அறையைத் தேர்ந்தெடுக்கவும் --',
    noRoomsFoundCalendar: 'பொருந்தும் அறைகள் எதுவும் இல்லை!',
    blocked: 'முடக்கப்பட்டது',
    bookCell: '+ பதிவு செய்',
    modalRoomTitleEdit: 'அறையைத் திருத்து',
    modalRoomTitleAdd: 'புதிய அறை சேர்க்க',
    modalRoomNumber: 'அறை எண்',
    modalRoomType: 'அறை வகை',
    modalWeekdayPrice: 'வார நாள் கட்டணம் (திங்கள்-வியாழன்) (₹)',
    modalWeekendPrice: 'வார இறுதி கட்டணம் (வெள்ளி-ஞாயிறு) (₹)',
    modalPeakPrice: 'உச்ச சீசன் கட்டணம் (₹)',
    modalStatus: 'அறை நிலை',
    modalAvailable: 'கிடைக்கிறது',
    modalOccupied: 'நிறைந்துள்ளது',
    modalMaintenance: 'பராமரிப்பு',
    modalUpdateRoomBtn: 'அறையை புதுப்பி',
    modalCreateRoomBtn: 'அறையை உருவாக்கு',
    modalPaymentRecord: 'வருவாயை பதிவுசெய்',
    modalGuestName: 'விருந்தினர் பெயர்',
    modalPaymentAmount: 'தொகை (₹)',
    modalPaymentMethod: 'செலுத்தும் முறை',
    modalPaymentStatus: 'நிலை',
    modalSavePayment: 'பதிவு செய்',
    modalSaving: 'சேமிக்கப்படுகிறது...',
    modalOfflineTitle: 'ஆஃப்லைன் பதிவு சேர்க்க',
    modalOfflineCustName: 'விருந்தினர் பெயர் *',
    modalOfflinePhone: 'தொலைபேசி எண் *',
    modalOfflineEmail: 'மின்னஞ்சல் முகவரி',
    modalOfflineNumRooms: 'அறைகளின் எண்ணிக்கை',
    modalOfflineCheckinDate: 'செக்-இன் தேதி *',
    modalOfflineCheckinTime: 'செக்-இன் நேரம் *',
    modalOfflineCheckoutDate: 'செக்-அவுட் தேதி *',
    modalOfflineCheckoutTime: 'செக்-அவுட் நேரம் *',
    modalOfflineGuests: 'விருந்தினர்கள்',
    modalOfflineAdvance: 'முன்பணம் (₹)',
    modalOfflineSpecialNotes: 'குறிப்பு',
    modalOfflineConfirmBtn: 'முன்பதிவை உறுதிசெய்',
    modalOfflineAdding: 'முன்பதிவு செய்யப்படுகிறது...',
    modalCheckinDetailsTitle: 'ஆன்லைன் செக்-இன் விபரங்கள்',
    modalCheckinFullName: 'முழு பெயர்',
    modalCheckinAgeGender: 'வயது / பாலினம்',
    modalCheckinAddress: 'முகவரி',
    modalCheckinIdProof: 'அடையாளச் சான்று',
    modalCheckinVehicle: 'வாகன எண்',
    modalCheckinAddGuests: 'கூடுதல் விருந்தினர்கள்',
    modalCheckinSpecialRequests: 'சிறப்பு கோரிக்கைகள்',
    modalCheckinIdImage: 'அடையாளச் சான்று படம்',
    modalCheckinClose: 'மூடவும்',
    phone: 'தொலைபேசி எண்',
    checkinCheckout: 'செக்-இன் / செக்-அவுட்',
    actions: 'செயல்கள்',
    totalRevenue: 'மொத்த வருவாய்',
    guestName: 'விருந்தினர் பெயர்',
    totalStays: 'மொத்த தங்குதல்கள்',
    level: 'நிலை',
    noGuests: 'விருந்தினர் விபரங்கள் இல்லை.'
  }
};

// --- SHARED COMPONENTS ---

const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, onLogout, username, unreadCount = 0, unreadReviewCount = 0, lang, onToggleLang }) => {
  const t = ADMIN_TEXT[lang];
  const navItems = [
    { id: 'overview', label: t.dashboard, icon: <LayoutDashboard size={20} /> },
    { id: 'rooms', label: t.rooms, icon: <Bed size={20} /> },
    { id: 'bookings', label: t.bookings, icon: <CalendarCheck size={20} /> },
    { id: 'calendar', label: t.calendar, icon: <Calendar size={20} /> },
    { id: 'guests', label: t.guests, icon: <Users size={20} /> },
    { id: 'payments', label: t.payments, icon: <CreditCard size={20} /> },
    { id: 'reports', label: t.reports, icon: <PieChart size={20} /> },
    { id: 'settings', label: t.settings, icon: <Settings size={20} /> },
    { id: 'reviews', label: t.reviews, icon: <MessageSquare size={20} />, count: unreadReviewCount },
    { id: 'gallery', label: t.gallery, icon: <Image size={20} /> },
    { id: 'notifications', label: t.notifications, icon: <Bell size={20} />, count: unreadCount },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span className="logo-bss">BSS</span> <span>Residency</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(item.id);
              document.body.classList.remove('sidebar-open');
            }}
          >
            <div style={{ position: 'relative', display: 'flex' }}>
              {item.icon}
              {item.count > 0 && (
                <span className="notif-badge">{item.count}</span>
              )}
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        {/* Language Toggle */}
        <div
          onClick={onToggleLang}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
            background: 'rgba(212, 168, 87, 0.12)', border: '1px solid rgba(212, 168, 87, 0.3)',
            marginBottom: '0.75rem', color: '#d4a857', fontSize: '0.8rem', fontWeight: 700,
            transition: 'all 0.2s'
          }}
        >
          <Globe size={15} />
          <span>{lang === 'en' ? 'தமிழில் காட்டு' : 'Show in English'}</span>
        </div>
        <div className="user-snippet">
          <div className="user-avatar">{username?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{username}</div>
            <div className="user-role">{t.administrator}</div>
          </div>
        </div>
        <div className="nav-item" onClick={onLogout} style={{ marginTop: '1rem', color: '#ff4d4d' }}>
          <LogOut size={18} />
          <span>{t.logout}</span>
        </div>
      </div>
    </div>
  );
};


// --- VIEWS ---

const DashboardOverview = ({ stats, bookings, period, setPeriod, selectedMonth, setSelectedMonth, lang }) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  if (!stats) return <div className="spinner" />;

  const statCards = [
    { label: d_t('totalRooms'), value: stats.totalRooms, color: 'purple' },
    { label: d_t('totalBookings'), value: stats.totalBookings, color: 'blue' },
    { label: d_t('availableRooms'), value: stats.availableRooms, color: 'green' },
    { label: d_t('checkinsToday'), value: stats.checkInsToday, color: 'orange' },
    { label: d_t('checkoutsToday'), value: stats.checkOutsToday, color: 'red' },
  ];

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

  return (
    <div className="view-content fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Calendar size={16} color="#64748b" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="month">{d_t('monthView')}</option>
            <option value="all">{d_t('allTime')}</option>
          </select>
          {period === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.5rem', fontWeight: 600, color: 'var(--admin-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
          )}
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map(s => (
          <div key={s.label} className="stat-card">
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
            <div style={{ fontSize: '0.75rem', color: '#68d391' }}>{d_t('realtime')}</div>
          </div>
        ))}
      </div>

      <div className="dash-layout">
        <div className="card">
          <div className="card-header">
            <h3>{d_t('revenueSummary')}</h3>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-primary)' }}>
              ₹{stats.totalRevenue?.toLocaleString('en-IN')}
            </span>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.revenueHistory}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, angle: -30, textAnchor: 'end' }} 
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--admin-primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>{d_t('recentBookings')}</h3>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{d_t('guest')}</th>
                  <th>{d_t('room')}</th>
                  <th>{d_t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {[...bookings]
                  .sort((a, b) => new Date(b.createdAt || b.checkIn) - new Date(a.createdAt || a.checkIn))
                  .slice(0, 5)
                  .map(b => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#888' }}>{d_t('booked')} {formatDate(b.createdAt || b.checkIn)} · {d_t('stay')} {formatDate(b.checkIn)}</div>
                    </td>
                    <td>{b.roomType}</td>
                    <td><span className={`status-pill status-${b.status}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomManagement = ({ rooms, onAddClick, onDeleteRoom, onUpdateRoom, auth, fetchData, lang }) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  return (
    <div className="view-content fade-in">
      <div className="card-header" style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#666' }}>{d_t('manageInventory')}</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="admin-btn admin-btn-outline" 
            onClick={async () => {
              const confirmMsg = lang === 'ta' 
                ? 'இயல்புநிலை 20-அறை அமைப்பை (101-307) மீட்டமைக்கவா? இது இருக்கும் அறை தரவை அழிக்கும்!' 
                : 'Reset to default 20-room layout (101-307)? This will wipe existing room data!';
              if(!window.confirm(confirmMsg)) return;
              try {
                const headers = { username: auth.username, password: auth.password };
                await api.post('/api/admin/rooms/reset-layout', {}, { headers });
                alert(lang === 'ta' ? 'அறைகள் வெற்றிகரமாக மீட்டமைக்கப்பட்டன!' : 'Rooms reset successfully!');
                fetchData();
              } catch(e) { alert((lang === 'ta' ? 'மீட்டமைக்கப்படவில்லை: ' : 'Reset failed: ') + e.message); }
            }}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            {d_t('resetLayout')}
          </button>
          <button onClick={onAddClick} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> {d_t('addRoom')}
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {rooms.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>{d_t('noRooms')}</div>
        ) : rooms.map(room => (
          <div key={room._id} className="card room-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>#{room.roomNumber}</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{room.type}</div>
              </div>
              <span className={`status-pill status-${room.status}`}>{room.status}</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--admin-primary)', marginBottom: '1rem' }}>
              ₹{room.price}/{d_t('priceNight')}
              <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 400, marginTop: '2px' }}>
                ({d_t('weekday')}: ₹{room.nonSeasonPrice} | {d_t('weekend')}: ₹{room.weekendPrice || room.nonSeasonPrice} | {d_t('peak')}: ₹{room.seasonPrice})
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => onUpdateRoom(room)}
                style={{ flex: 1, height: '36px', padding: 0 }}
              >
                <Edit3 size={16} />
              </button>
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => onDeleteRoom(room._id)}
                style={{ flex: 1, height: '36px', padding: 0, color: '#ff4d4d' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookingManagement = ({ bookings = [], rooms = [], period, setPeriod, onConfirm, onCancel, onWhatsApp, onCheckOut, onUpdateRoomNumber, onDelete, onAddPayment, onViewCheckin, formatDate, onAddOfflineBookingClick, lang }) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  const [filter, setFilter] = React.useState('All');

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const filteredBookings = filter === 'All'
    ? safeBookings
    : safeBookings.filter(b => b && b.status === filter);

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'All': return d_t('filterAll');
      case 'Pending': return d_t('filterPending');
      case 'Confirmed': return d_t('filterConfirmed');
      case 'Checked-out': return d_t('filterCheckedOut');
      case 'Cancelled': return d_t('filterCancelled');
      default: return tab;
    }
  };

  return (
    <div className="card">
      <div className="card-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{d_t('bookingManagement')}</h3>
        <button
          onClick={onAddOfflineBookingClick}
          className="admin-btn admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> <span>{d_t('addOfflineBooking')}</span>
        </button>
      </div>

      <div className="filter-tabs-row" style={{ marginBottom: '1.5rem', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="filter-tabs" style={{
          display: 'flex',
          gap: '0.6rem',
          background: '#f1f5f9',
          padding: '0.5rem',
          borderRadius: '10px',
          overflowX: 'auto',
          flexWrap: 'nowrap',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div style={{ minWidth: '30px', height: '1px' }} /> {/* Large Spacer */}
          {['All', 'Pending', 'Confirmed', 'Checked-out', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '0.5rem 1.4rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: filter === tab ? 'white' : 'transparent',
                color: filter === tab ? 'var(--admin-primary)' : '#64748b',
                boxShadow: filter === tab ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {getTabLabel(tab)}
            </button>
          ))}
          <div style={{ minWidth: '30px', height: '1px' }} />
        </div>
      </div>
      <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
        <div>{d_t('showingBookings')} <strong>{filteredBookings.length}</strong> {d_t('bookingsFound')}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer' }}
          >
            <option value="month">{d_t('monthView')}</option>
            <option value="all">{d_t('allTime')}</option>
          </select>

          {period === 'month' && (
            <input
              type="month"
              value={window.selectedMonthGlobal || ''}
              onChange={(e) => window.setSelectedMonthGlobal(e.target.value)}
              style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.5rem', fontWeight: 600, color: 'var(--admin-primary)', outline: 'none' }}
            />
          )}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{d_t('guest')}</th>
              <th>{d_t('phone')}</th>
              <th>{d_t('room')}</th>
              <th>{d_t('checkinCheckout')}</th>
              <th>{d_t('status')}</th>
              <th>{d_t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>{d_t('noBookingsFound')}</td></tr>
            ) : filteredBookings.map((b, i) => (
              <tr key={b._id}>
                <td data-label="#">{i + 1}</td>
                <td data-label={d_t('guest')}>
                  <div style={{ fontWeight: 600 }}>{b.name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-primary)', fontWeight: 600 }}>
                    #{b.bookingId || (b._id ? String(parseInt(b._id.toString().slice(-6), 16)).padStart(6, '0').slice(-6) : 'N/A')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>{b.email || ''}</div>
                </td>
                <td data-label={d_t('phone')}>{b.phone}</td>
                <td data-label={d_t('room')}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ fontWeight: 600 }}>{b.roomType}</div>
                    <select
                      value={b.roomNumber || ''}
                      onChange={(e) => onUpdateRoomNumber(b._id, e.target.value)}
                      style={{ width: '130px', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f9fafb', cursor: 'pointer' }}
                    >
                      <option value="">{d_t('assignRoom')}</option>
                      {rooms.map(r => (
                        <option key={r.roomNumber} value={r.roomNumber}>
                          {r.roomNumber} ({r.type.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td data-label={d_t('checkinCheckout')} style={{ fontSize: '0.85rem' }}>
                  {formatDate(b.checkIn)} {b.checkInTime ? ` (${b.checkInTime})` : ''} -<br />{formatDate(b.checkOut)} {b.checkOutTime ? ` (${b.checkOutTime})` : ''}
                </td>
                <td data-label={d_t('status')}>
                  <span className={`status-pill status-${b.status?.replace(' ', '-') || 'Pending'}`}>{b.status || 'Pending'}</span>
                  {b.checkedInOnline && (
                    <span style={{ display: 'block', marginTop: '4px', fontSize: '0.68rem', background: '#d1fae5', color: '#065f46', borderRadius: '4px', padding: '2px 6px', fontWeight: 700 }}>
                      🧾 {d_t('onlineCIDone')}
                    </span>
                  )}
                </td>
                <td data-label={d_t('actions')}>
                  <div className="admin-actions-container">
                    {/* Status Management */}
                    <div className="action-stack">
                      {b.status === 'Pending' && (
                        <button className="action-btn-main confirm" onClick={() => onConfirm(b._id, b)}>
                          <CheckCircle size={15} /> {d_t('actionConfirm')}
                        </button>
                      )}

                      {b.status === 'Confirmed' && (
                        <button className="action-btn-main confirm" onClick={() => onCheckOut(b._id, b)} style={{ background: '#6366f1', borderColor: '#6366f1', color: '#fff' }}>
                          <LogOut size={15} /> {d_t('actionCheckout')}
                        </button>
                      )}

                      <button className="action-btn-main whatsapp" onClick={() => onWhatsApp(b)}>
                        <MessageSquare size={15} /> {d_t('actionWhatsapp')}
                      </button>

                      {(b.status === 'Pending' || b.status === 'Confirmed') && (
                        <button className="action-btn-main cancel" onClick={() => onCancel(b._id, b)}>
                          <XCircle size={15} /> {d_t('actionCancel')}
                        </button>
                      )}
                    </div>

                    {/* Secondary Utilities */}
                    <div className="action-footer">
                      {b.checkedInOnline && (
                        <button className="action-btn-main checkin" onClick={() => onViewCheckin(b)} style={{ background: '#065f46', borderColor: '#065f46', color: '#fff' }}>
                          <ClipboardCheck size={15} /> {d_t('actionViewCheckin')}
                        </button>
                      )}
                      <button className="action-btn-main payment" onClick={() => onAddPayment(b)}>
                        <CreditCard size={15} /> {d_t('actionAddPayment')}
                      </button>
                      <button className="action-link delete" onClick={() => onDelete(b._id)}>
                        <Trash2 size={14} /> {d_t('actionDelete')}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Payments = ({ payments, totalRevenue, lang }) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  return (
    <div className="view-content fade-in">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">{d_t('totalRevenue')}</span>
          <span className="stat-value">₹{totalRevenue?.toLocaleString('en-IN') || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{d_t('activePayments')}</span>
          <span className="stat-value">{payments.length}</span>
        </div>
      </div>
      <div className="card">
        <h3>{d_t('transactionHistory')}</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{d_t('guest')}</th>
                <th>{d_t('date')}</th>
                <th>{d_t('amount')}</th>
                <th>{d_t('method')}</th>
                <th>{d_t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>{d_t('noPayments')}</td></tr>
              ) : payments.map(p => (
                <tr key={p._id}>
                  <td data-label={d_t('guest')} style={{ fontWeight: 600 }}>{p.guestName}</td>
                  <td data-label={d_t('date')}>{new Date(p.date).toLocaleDateString()}</td>
                  <td data-label={d_t('amount')} style={{ fontWeight: 700 }}>₹{p.amount}</td>
                  <td data-label={d_t('method')}>{p.method}</td>
                  <td data-label={d_t('status')}><span className={`status-pill status-${p.status === 'Paid' ? 'Confirmed' : (p.status === 'Pending' ? 'Pending' : 'Cancelled')}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Reports = ({ stats, period, setPeriod, selectedMonth, setSelectedMonth, lang }) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  return (
    <div className="view-content fade-in">
      <div className="card-header" style={{ marginBottom: '1.5rem', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#fff', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="month">{d_t('monthView')}</option>
            <option value="all">{d_t('allTime')}</option>
          </select>

          {period === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
          )}
        </div>
      </div>

      <div className="dash-layout">
        <div className="card">
          <div className="card-header">
            <h3>{d_t('occupancyByType')}</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {period === 'all' ? (lang === 'ta' ? 'அனைத்து முன்பதிவுகள்' : 'All bookings') : `${lang === 'ta' ? 'முன்பதிவுகள்: ' : 'Bookings in '} ${new Date(selectedMonth).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { month: 'long', year: 'numeric' })}`}
            </span>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={stats?.byRoom || []} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, angle: -30, textAnchor: 'end' }} 
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: 'rgba(212, 168, 87, 0.05)' }} />
                <Bar dataKey="count" fill="var(--admin-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>{d_t('keyMetrics')}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="stat-card">
              <span className="stat-label">{d_t('avgRev')}</span>
              <span className="stat-value">₹{(stats?.totalRevenue / (stats?.totalBookings || 1)).toFixed(0)}</span>
              <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>
                {lang === 'ta' ? `${stats?.totalBookings} முன்பதிவுகளின் அடிப்படையில்` : `Based on ${stats?.totalBookings} bookings`}
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-label">{d_t('confRate')}</span>
              <span className="stat-value">{((stats?.confirmed / (stats?.totalBookings || 1)) * 100).toFixed(1)}%</span>
              <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>
                {lang === 'ta' ? `${stats?.totalBookings}-ல் ${stats?.confirmed} உறுதி செய்யப்பட்டுள்ளது` : `${stats?.confirmed} of ${stats?.totalBookings} confirmed`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomBlockingCenter = ({ lang }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [blockedList, setBlockedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuth = () => JSON.parse(localStorage.getItem('bss_admin') || sessionStorage.getItem('bss_admin'));

  const getHeaders = () => {
    const auth = getAuth();
    return auth?.token
      ? { Authorization: `Bearer ${auth.token}` }
      : { username: auth?.username, password: auth?.password };
  };

  useEffect(() => {
    api.get('/api/admin/rooms', { headers: getHeaders() }).then(res => {
      if (res.data?.rooms) setRooms(res.data.rooms);
    }).catch(() => {});
    fetchBlocked();
  }, []);

  const fetchBlocked = async () => {
    try {
      const res = await api.get('/api/admin/blocked-dates', { headers: getHeaders() });
      if (res.data?.blocked) setBlockedList(res.data.blocked);
    } catch (e) {}
  };

  const handleBlock = async () => {
    if (!selectedRoom || !startDate || !endDate) return alert('Please fill all fields');
    setLoading(true);
    try {
      const res = await api.post('/api/admin/block-dates', {
        roomNumber: selectedRoom,
        startDate,
        endDate,
      }, { headers: getHeaders() });
      if (res.data?.success) {
        alert('✅ Room blocked successfully!');
        setSelectedRoom(''); setStartDate(''); setEndDate('');
        fetchBlocked();
      } else {
        alert('❌ ' + (res.data?.message || 'Failed'));
      }
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
    setLoading(false);
  };

  const handleUnblock = async (id) => {
    if (!window.confirm('Remove this block?')) return;
    try {
      await api.delete(`/api/admin/blocked-dates/${id}`, { headers: getHeaders() });
      fetchBlocked();
    } catch (e) { alert('Error: ' + e.message); }
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff5f5', borderRadius: '16px', border: '1px solid #fecaca' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fee2e2', borderRadius: '12px', padding: '0.75rem', display: 'flex' }}>
          <span style={{ fontSize: '1.5rem' }}>📅</span>
        </div>
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>Room Blocking Center</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Block rooms for maintenance or custom bookings</p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>SELECT ROOM</label>
        <select
          value={selectedRoom}
          onChange={e => setSelectedRoom(e.target.value)}
          style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', background: '#fff' }}
        >
          <option value="">-- Choose Room --</option>
          {rooms.map(r => (
            <option key={r._id} value={r.roomNumber}>Room {r.roomNumber} — {r.type}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>START DATE</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', background: '#fff', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>END DATE</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', background: '#fff', boxSizing: 'border-box' }} />
        </div>
      </div>

      <button
        onClick={handleBlock}
        disabled={loading}
        style={{ width: '100%', padding: '1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
      >
        {loading ? 'Blocking...' : '+ Block Room'}
      </button>

      <div style={{ marginTop: '1.5rem' }}>
        <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>BLOCKED DATES</h5>
        {blockedList.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No blocked dates currently.</p>
        ) : blockedList.map(b => (
          <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#fff', borderRadius: '8px', border: '1px solid #fee2e2', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Room {b.roomNumber} — {new Date(b.startDate).toLocaleDateString('en-IN')} to {new Date(b.endDate).toLocaleDateString('en-IN')}</span>
            <button onClick={() => handleUnblock(b._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsView = ({ isSeason, onToggleSeason, isWeekendActive, onToggleWeekend, lang }) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  const [fcmStatus, setFcmStatus] = useState('Checking...');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  useEffect(() => {
    if (!('Notification' in window)) {
      setFcmStatus('Unsupported');
    } else if (Notification.permission === 'granted') {
      setFcmStatus('Enabled');
    } else if (Notification.permission === 'denied') {
      setFcmStatus('Denied');
    } else {
      setFcmStatus('Not Requested');
    }
  }, []);

  const handleEnablePush = async () => {
    try {
      const { requestForToken } = await import('../firebase');
      const token = await requestForToken();
      if (token) {
        const auth = JSON.parse(localStorage.getItem('bss_admin') || sessionStorage.getItem('bss_admin'));
        const headers = { username: auth.username, password: auth.password };
        const saveRes = await api.post('/api/admin/fcm-token', { token }, { headers });
        if (!saveRes.data?.success) {
          throw new Error(saveRes.data?.message || 'Server did not save your device token');
        }
        setFcmStatus('Enabled');
        alert(lang === 'ta' ? 'புஷ் அறிவிப்புகள் வெற்றிகரமாக இயக்கப்பட்டது!' : 'Push notifications enabled successfully!');
      } else {
        alert(lang === 'ta' ? 'டோக்கன் பெறுவதில் தோல்வி.' : 'Failed to get token (empty).');
        setFcmStatus(Notification.permission === 'denied' ? 'Denied' : 'Not Requested');
      }
    } catch (e) {
      console.error(e);
      alert('Error: ' + e.message);
    }
  };

  return (
  <div className="view-content fade-in">
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{d_t('systemSettings')}</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>{d_t('manageLodge')}</p>
      </div>

      {/* Push Notifications Section */}
      <div className="settings-section" style={{ marginBottom: '2.5rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '16px', border: '1px solid #bae6fd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Bell size={20} color="#0284c7" />
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{d_t('pushNotif')}</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
              {d_t('receiveAlerts')}
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: fcmStatus === 'Enabled' ? '#16a34a' : (fcmStatus === 'Denied' ? '#dc2626' : '#ea580c') }}>
              Status: {fcmStatus}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              type="button"
              className="admin-btn admin-btn-primary"
              style={{ background: '#0284c7', padding: '0.5rem 1.5rem' }}
              onClick={handleEnablePush}
              disabled={fcmStatus === 'Unsupported'}
            >
              {fcmStatus === 'Enabled' ? d_t('resyncAlerts') : d_t('enableAlerts')}
            </button>
            <button
              type="button"
              className="admin-btn"
              style={{ background: '#16a34a', color: '#fff', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              onClick={async () => {
                try {
                  const auth = JSON.parse(localStorage.getItem('bss_admin') || sessionStorage.getItem('bss_admin'));
                  const token = auth?.token;
                  const headers = token 
                    ? { Authorization: `Bearer ${token}` }
                    : { username: auth?.username, password: auth?.password };
                  const res = await api.post('/api/admin/test-notification', {}, { headers });
                  if (res.data?.success) {
                    alert('✅ Test notification sent! Check your phone.');
                  } else {
                    alert('❌ Failed: ' + (res.data?.error || 'Unknown error'));
                  }
                } catch (e) {
                  alert('❌ Error: ' + e.message);
                }
              }}
              disabled={fcmStatus !== 'Enabled'}
            >
              🔔 Test Notification
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section" style={{ marginBottom: '2.5rem', padding: '1.5rem', background: isSeason ? '#fffbeb' : '#f8fafc', borderRadius: '16px', border: '1px solid', borderColor: isSeason ? '#fef3c7' : '#e2e8f0', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{isSeason ? '🔥' : '❄️'}</span>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{d_t('peakSeasonPricing')}</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
              {d_t('peakSeasonDesc')}
            </p>
          </div>
          <div
            onClick={() => onToggleSeason(!isSeason)}
            style={{
              width: '64px',
              height: '32px',
              background: isSeason ? '#d4a857' : '#cbd5e1',
              borderRadius: '20px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isSeason ? '0 4px 12px rgba(212, 168, 87, 0.3)' : 'none'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              background: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '3px',
              left: isSeason ? '35px' : '3px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }} />
          </div>
        </div>
        
        <div style={{ 
          marginTop: '1.25rem', 
          padding: '10px 15px', 
          background: isSeason ? 'rgba(212, 168, 87, 0.1)' : 'rgba(107, 114, 128, 0.05)', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSeason ? '#d4a857' : '#64748b', animation: isSeason ? 'pulse 2s infinite' : 'none' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSeason ? '#92400e' : '#475569' }}>
            {isSeason ? d_t('peakRatesLive') : d_t('regularRatesLive')}
          </span>
        </div>
      </div>

      <div className="settings-section" style={{ marginBottom: '2.5rem', padding: '1.5rem', background: isWeekendActive ? '#f0fdf4' : '#f8fafc', borderRadius: '16px', border: '1px solid', borderColor: isWeekendActive ? '#bbf7d0' : '#e2e8f0', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{isWeekendActive ? '📅' : '📆'}</span>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{d_t('weekendPricing')}</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
              {d_t('weekendDesc')}
            </p>
          </div>
          <div
            onClick={() => onToggleWeekend(!isWeekendActive)}
            style={{
              width: '64px',
              height: '32px',
              background: isWeekendActive ? '#16a34a' : '#cbd5e1',
              borderRadius: '20px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isWeekendActive ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              background: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '3px',
              left: isWeekendActive ? '35px' : '3px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }} />
          </div>
        </div>
        
        <div style={{ 
          marginTop: '1.25rem', 
          padding: '10px 15px', 
          background: isWeekendActive ? 'rgba(22, 163, 74, 0.1)' : 'rgba(107, 114, 128, 0.05)', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isWeekendActive ? '#16a34a' : '#64748b', animation: isWeekendActive ? 'pulse 2s infinite' : 'none' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isWeekendActive ? '#166534' : '#475569' }}>
            {isWeekendActive ? d_t('weekendRatesEnabled') : d_t('weekendRatesDisabled')}
          </span>
        </div>
      </div>

      <form className="settings-form" style={{ display: 'grid', gap: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Lock size={20} color="var(--admin-primary)" />
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{d_t('loginCredentials')}</h4>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{d_t('updateLoginDesc')}</p>
        
        <div className="form-row" style={{ marginBottom: 0 }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>{d_t('newUsername')}</label>
            <input 
              type="text" 
              id="new-username"
              placeholder={lang === 'ta' ? 'மாற்றாமல் இருக்க காலியாக விடவும்' : 'Leave blank to keep current'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.95rem' }} 
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>{d_t('newPassword')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showNewPassword ? "text" : "password"} 
                id="new-password"
                placeholder={lang === 'ta' ? 'குறைந்தது 6 எழுத்துக்கள்' : 'Minimum 6 characters'}
                style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.95rem' }} 
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#991b1b' }}>{d_t('currentPassword')}</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type={showCurrentPassword ? "text" : "password"} 
              id="current-password"
              required
              style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #fecaca', background: '#fff', fontSize: '0.95rem' }} 
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', display: 'flex', alignItems: 'center', padding: 0 }}
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button 
            type="button" 
            className="admin-btn admin-btn-primary" 
            style={{ padding: '0.75rem 2.5rem', background: '#1e293b', color: '#fff' }}
            onClick={async () => {
              const newU = document.getElementById('new-username').value;
              const newP = document.getElementById('new-password').value;
              const currP = document.getElementById('current-password').value;
              
              if (!newU && !newP) return;
              
              if (!currP) return alert(lang === 'ta' ? 'சேமிக்க தற்போதைய கடவுச்சொல் தேவை' : 'Current password is required to save changes');
              if (newP && newP.length < 6) return alert(lang === 'ta' ? 'புதிய கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துக்கள் இருக்க வேண்டும்' : 'New password must be at least 6 characters');
              
              const confirmMsg = lang === 'ta'
                ? 'உங்கள் உள்நுழைவு விபரங்களை மாற்ற விரும்புகிறீர்களா? நீங்கள் வெளியேற்றப்படுவீர்கள்.'
                : 'Are you sure you want to change your login credentials? You will be logged out.';
              if (!window.confirm(confirmMsg)) return;
              
              const auth = JSON.parse(localStorage.getItem('bss_admin') || sessionStorage.getItem('bss_admin'));
              try {
                const headers = { username: auth.username, password: auth.password };
                await api.patch('/api/admin/profile', {
                  oldUsername: auth.username,
                  oldPassword: currP,
                  newUsername: newU || undefined,
                  newPassword: newP || undefined
                }, { headers });
                
                alert(lang === 'ta' ? 'வெற்றி! புதிய விபரங்களுடன் உள்நுழையவும்.' : 'Success! Please login with your new credentials.');
                localStorage.removeItem('bss_admin');
                sessionStorage.removeItem('bss_admin');
                window.location.reload();
              } catch (err) {
                alert(err.response?.data?.message || (lang === 'ta' ? 'புதுப்பிப்பதில் தோல்வி' : 'Error updating profile'));
              }
            }}
          >
            {d_t('updateLoginBtn')}
          </button>
        </div>
      </form>

      {/* Room Blocking Center */}
      <RoomBlockingCenter lang={lang} />

    </div>
  </div>
  );
};

const ReviewsView = ({ reviews, onDeleteReview, period, setPeriod, selectedMonth, setSelectedMonth, lang }) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  return (
    <div className="view-content fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Calendar size={16} color="#64748b" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="month">{d_t('monthView')}</option>
            <option value="all">{d_t('allTime')}</option>
          </select>

          {period === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.5rem', fontWeight: 600, color: 'var(--admin-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="card">{d_t('noReviews')}</div>
      ) : reviews.map(r => (
        <div key={r._id} className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700 }}>{r.guestName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#d4a857' }}>{'★'.repeat(r.rating)}</span>
              <button
                onClick={() => onDeleteReview(r._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4d4d',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                  transition: 'background 0.2s'
                }}
                className="delete-review-btn"
                title={lang === 'ta' ? 'மதிப்பீட்டை நீக்கு' : 'Delete Review'}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>"{r.comment}"</p>
          <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>{new Date(r.date).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
};

const GalleryManagement = ({ auth, lang }) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Room', image: null });

  const fetchImages = useCallback(async () => {
    try {
      const res = await api.get('/api/gallery');
      if (res.data.success) setImages(res.data.images);
    } catch (err) {
      console.error('Fetch gallery error:', err);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.image) return alert(lang === 'ta' ? 'படத்தைத் தேர்ந்தெடுக்கவும்' : 'Select an image');
    setUploading(true);
    const formData = new FormData();
    formData.append('image', form.image);
    formData.append('title', form.title);
    formData.append('category', form.category);

    try {
      const headers = { 
        username: auth.username, 
        password: auth.password 
      };
      await api.post('/api/gallery/upload', formData, { headers });
      setForm({ title: '', category: 'Room', image: null });
      fetchImages();
      alert(lang === 'ta' ? 'வெற்றிகரமாக பதிவேற்றப்பட்டது!' : 'Uploaded successfully!');
    } catch (err) {
      alert((lang === 'ta' ? 'பதிவேற்றம் தோல்வி: ' : 'Upload failed: ') + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmMsg = lang === 'ta' ? 'படத்தை நீக்கவா?' : 'Delete image?';
    if (!window.confirm(confirmMsg)) return;
    try {
      const headers = { username: auth.username, password: auth.password };
      await api.delete(`/api/gallery/${id}`, { headers });
      fetchImages();
    } catch (err) {
      alert(lang === 'ta' ? 'நீக்குதல் தோல்வி' : 'Delete failed');
    }
  };

  return (
    <div className="view-content fade-in">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>{d_t('uploadPhoto')}</h3>
        <form onSubmit={handleUpload} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <div className="form-row">
            <div className="form-group">
              <label>{d_t('titleCaption')}</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Deluxe Room View" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="Room">{d_t('rooms')}</option>
                <option value="Exterior">Exterior</option>
                <option value="Nearby">Nearby</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>{d_t('selectImage')}</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px' }} />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={uploading}>
            {uploading ? d_t('uploading') : d_t('uploadBtn')}
          </button>
        </form>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {images.map(img => (
          <div key={img._id} className="card" style={{ padding: '0.5rem', position: 'relative' }}>
            <img 
              src={`${process.env.REACT_APP_API_URL || 'https://bss-residency.onrender.com'}${img.imageUrl}`} 
              alt={img.title} 
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
            />
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{img.title || 'Untitled'}</div>
            <div style={{ fontSize: '0.7rem', color: '#666' }}>{img.category}</div>
            <button 
              onClick={() => handleDelete(img._id)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 77, 77, 0.9)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsView = ({ notifications, period, setPeriod, selectedMonth, setSelectedMonth, onDelete, onClearAll, fetchError, apiBase, lang }) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  return (
    <div className="view-content fade-in">
      {fetchError && (
        <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #ef4444', color: '#b91c1c' }}>
          {fetchError}
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#64748b' }}>API: {apiBase || 'unknown'}</div>
        </div>
      )}
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '1rem' }}>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll} 
            className="admin-btn admin-btn-outline" 
            style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Trash2 size={16} /> {d_t('clearAll')}
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Calendar size={16} color="#64748b" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="month">{d_t('monthView')}</option>
            <option value="all">{d_t('allTime')}</option>
          </select>

          {period === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.5rem', fontWeight: 600, color: 'var(--admin-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card">{d_t('noNotifications')}</div>
      ) : notifications.map(a => (
        <div key={a._id} className="notification-card-container" style={{ position: 'relative', marginBottom: '1rem' }}>
          <div 
            className="card notification-card" 
            style={{ 
              borderLeft: `4px solid ${a.type === 'booking' ? '#d4a857' : (a.type === 'wa' ? '#25D366' : '#64748b')}`, 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center' 
            }}
          >
            <div style={{ background: '#fdfaf4', padding: '0.75rem', borderRadius: '50%', color: 'var(--admin-primary)' }}>
              {a.type === 'booking' ? <CalendarCheck size={20} /> : (a.type === 'wa' ? <MessageSquare size={20} /> : <Clock size={20} />)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{a.message}</div>
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem' }}>{new Date(a.date).toLocaleString()}</div>
            </div>
            
            <button 
              className="delete-notif-btn"
              onClick={() => onDelete(a._id)}
              style={{ 
                background: '#fff1f1', 
                border: 'none', 
                color: '#ef4444', 
                padding: '10px', 
                borderRadius: '8px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title={lang === 'ta' ? 'அறிவிப்பை நீக்கு' : 'Delete Notification'}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- ROOM AVAILABILITY CALENDAR COMPONENT ---
const RoomAvailabilityCalendar = ({ 
  rooms, 
  bookings, 
  startDate, 
  setStartDate, 
  loading, 
  onRefresh, 
  onCellClick, 
  onUpdateRoomNumber, 
  formatDate,
  lang
}) => {
  const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
  const [selectedRoomType, setSelectedRoomType] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Generate 14 days starting from startDate
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }

  // Filter rooms by type if filter is active
  const filteredRooms = rooms.filter(r => selectedRoomType === 'All' || r.type === selectedRoomType);

  // Filter unassigned bookings that overlap with our 14 day window
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 14);

  const unassignedBookings = bookings.filter(b => {
    if (b.roomNumber) return false;
    if (b.status === 'Cancelled') return false;
    const checkIn = new Date(b.checkIn);
    const checkOut = new Date(b.checkOut);
    return checkIn < endDate && checkOut > startDate;
  });

  const navigateDays = (days) => {
    const nextD = new Date(startDate);
    nextD.setDate(nextD.getDate() + days);
    setStartDate(nextD);
  };

  const getDayLabel = (d) => {
    return d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { weekday: 'short' });
  };

  const getDateLabel = (d) => {
    return d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { day: '2-digit', month: 'short' });
  };

  const isToday = (d) => {
    const today = new Date();
    return d.getDate() === today.getDate() && 
           d.getMonth() === today.getMonth() && 
           d.getFullYear() === today.getFullYear();
  };

  // Find booking for a specific room and date
  const getBookingForCell = (roomNumber, date) => {
    const dTime = new Date(date).setHours(0, 0, 0, 0);
    return bookings.find(b => {
      if (b.roomNumber !== roomNumber) return false;
      if (b.status === 'Cancelled') return false;
      const checkInTime = new Date(b.checkIn).setHours(0, 0, 0, 0);
      const checkOutTime = new Date(b.checkOut).setHours(0, 0, 0, 0);
      return dTime >= checkInTime && dTime < checkOutTime;
    });
  };

  // Helper to find which rooms are free for a booking's dates
  const getAvailableRoomsForBooking = (b) => {
    const bStart = new Date(b.checkIn).setHours(0,0,0,0);
    const bEnd = new Date(b.checkOut).setHours(0,0,0,0);

    // Find rooms of requested type
    const candidateRooms = rooms.filter(r => r.type === b.roomType);

    // Filter out rooms that have overlapping bookings during this window (excluding this booking)
    return candidateRooms.filter(room => {
      const hasOverlap = bookings.some(ob => {
        if (ob._id === b._id) return false;
        if (ob.roomNumber !== room.roomNumber) return false;
        if (ob.status === 'Cancelled' || ob.status === 'Checked-out') return false;
        const obStart = new Date(ob.checkIn).setHours(0,0,0,0);
        const obEnd = new Date(ob.checkOut).setHours(0,0,0,0);
        return bStart < obEnd && bEnd > obStart;
      });
      return !hasOverlap;
    });
  };

  const auth = JSON.parse(localStorage.getItem('bss_admin') || sessionStorage.getItem('bss_admin') || '{}');

  return (
    <div className="calendar-view-container fade-in">
      <div className="calendar-layout-grid">
        
        {/* Main Grid Section */}
        <div className="calendar-main-section card">
          <div className="calendar-header-actions" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="navigation-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="admin-btn admin-btn-outline" onClick={() => navigateDays(-14)}>{d_t('prev14')}</button>
              <button className="admin-btn admin-btn-outline" onClick={() => {
                const today = new Date();
                today.setHours(0,0,0,0);
                setStartDate(today);
              }}>{d_t('todayBtn')}</button>
              <button className="admin-btn admin-btn-outline" onClick={() => navigateDays(14)}>{d_t('next14')}</button>
            </div>
            
            <div className="filter-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{d_t('startDateLabel')}</span>
                <input 
                  type="date" 
                  value={startDate.toISOString().split('T')[0]} 
                  onChange={(e) => {
                    if (e.target.value) {
                      const d = new Date(e.target.value);
                      d.setHours(0,0,0,0);
                      setStartDate(d);
                    }
                  }}
                  style={{ border: 'none', background: 'transparent', fontWeight: 700, outline: 'none', color: '#1e293b', fontSize: '0.85rem', cursor: 'pointer' }}
                />
              </div>

              <select 
                value={selectedRoomType} 
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="admin-select"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: 600, minWidth: '150px' }}
              >
                <option value="All">{d_t('allRoomTypes')}</option>
                <option value="Double Bed">{d_t('doubleBed')}</option>
                <option value="Double Bed A/C">{d_t('doubleBedAc')}</option>
                <option value="Three Bed">{d_t('threeBed')}</option>
                <option value="Four Bed A/C">{d_t('fourBedAc')}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
              <div className="spinner" />
            </div>
          ) : (
            <div className="calendar-grid-wrapper" style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
              <table className="calendar-grid-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th className="sticky-col header-cell" style={{ position: 'sticky', left: 0, zIndex: 11, background: '#f8fafc', padding: '1rem', borderBottom: '2px solid #e2e8f0', fontWeight: 700, color: '#475569', minWidth: '180px', borderRight: '2px solid #e2e8f0' }}>
                      {lang === 'ta' ? 'அறைகள்' : 'Rooms'} ({filteredRooms.length})
                    </th>
                    {dates.map((d, idx) => (
                      <th key={idx} className={`header-cell ${isToday(d) ? 'today-col' : ''}`} style={{ 
                        padding: '0.75rem 1rem', 
                        borderBottom: '2px solid #e2e8f0', 
                        borderRight: '1px solid #e2e8f0', 
                        minWidth: '100px', 
                        textAlign: 'center',
                        background: isToday(d) ? '#fffbeb' : '#f8fafc',
                        position: 'relative'
                      }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: isToday(d) ? '#d4a857' : '#94a3b8' }}>
                          {getDayLabel(d)}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isToday(d) ? '#b45309' : '#475569' }}>
                          {getDateLabel(d)}
                        </div>
                        {isToday(d) && (
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#d4a857' }} />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map(room => (
                    <tr key={room._id} className="room-row" style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td className="sticky-col room-info-cell" style={{ 
                        position: 'sticky', 
                        left: 0, 
                        zIndex: 10, 
                        background: '#ffffff', 
                        padding: '1rem', 
                        fontWeight: 700, 
                        borderRight: '2px solid #e2e8f0',
                        boxShadow: '4px 0 8px -4px rgba(0,0,0,0.08)'
                      }}>
                        <div style={{ fontSize: '1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🏢 {lang === 'ta' ? 'அறை' : 'Room'} {room.roomNumber}
                        </div>
                        <span style={{ 
                          display: 'inline-block', 
                          fontSize: '0.68rem', 
                          marginTop: '4px', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          background: room.type.includes('A/C') || room.type.includes('AC') ? '#eff6ff' : '#f4f4f5', 
                          color: room.type.includes('A/C') || room.type.includes('AC') ? '#2563eb' : '#71717a',
                          fontWeight: 600
                        }}>
                          {room.type}
                        </span>
                      </td>

                      {dates.map((date, idx) => {
                        const booking = getBookingForCell(room.roomNumber, date);
                        const isDateToday = isToday(date);
                        
                        if (booking) {
                          // Cell is booked
                          const isCheckinDay = new Date(booking.checkIn).toDateString() === date.toDateString();
                          const isCheckoutDay = new Date(booking.checkOut).toDateString() === date.toDateString();
                          
                          // Determine status styling
                          let bg = '#eff6ff'; // default blue (Confirmed)
                          let color = '#1d4ed8';
                          let border = '#bfdbfe';
                          let statusLabel = 'Confirmed';

                          if (booking.status === 'Pending') {
                            bg = '#fffbeb'; // amber
                            color = '#b45309';
                            border = '#fef3c7';
                            statusLabel = 'Pending';
                          } else if (booking.status === 'Checked-out') {
                            bg = '#f0fdf4'; // emerald
                            color = '#15803d';
                            border = '#bbf7d0';
                            statusLabel = 'Stay Completed';
                          }

                          return (
                            <td 
                              key={idx} 
                              className="booked-cell"
                              onClick={() => setSelectedBooking(booking)}
                              style={{ 
                                padding: '6px', 
                                borderRight: '1px solid #e2e8f0', 
                                background: isDateToday ? '#fffbeb' : '#ffffff',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <div style={{ 
                                background: bg, 
                                color: color, 
                                border: `1px solid ${border}`,
                                borderRadius: '6px', 
                                padding: '8px 6px', 
                                fontSize: '0.8rem', 
                                fontWeight: 600,
                                textAlign: 'center',
                                minHeight: '52px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                              }}
                               title={`${booking.name} (${statusLabel}) | Check-in: ${new Date(booking.checkIn).toLocaleDateString()} | Check-out: ${new Date(booking.checkOut).toLocaleDateString()}`}
                              >
                                <span style={{ fontSize: '0.82rem', display: 'block', fontWeight: 700 }}>{booking.name}</span>
                                <span style={{ fontSize: '0.62rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>
                                  {isCheckinDay ? (lang === 'ta' ? '📥 வருகை' : '📥 In') : (isCheckoutDay ? (lang === 'ta' ? '📤 வெளியேற்றம்' : '📤 Out') : (lang === 'ta' ? '🔑 தங்கியுள்ளார்' : '🔑 Occupied'))}
                                </span>
                              </div>
                            </td>
                          );
                        }

                        // Cell is free/maintenance
                        const isMaintenance = room.status === 'Maintenance';
                        
                        return (
                          <td 
                            key={idx} 
                            className="available-cell"
                            onClick={() => !isMaintenance && onCellClick(room, date)}
                            style={{ 
                                padding: '10px', 
                                borderRight: '1px solid #e2e8f0', 
                                background: isMaintenance ? '#f8fafc' : (isDateToday ? '#fffbeb' : '#ffffff'),
                                textAlign: 'center',
                                cursor: isMaintenance ? 'not-allowed' : 'pointer',
                                position: 'relative'
                            }}
                          >
                            {isMaintenance ? (
                              <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>
                                🛠️ {d_t('blocked')}
                              </div>
                            ) : (
                              <div className="hover-booking-badge" style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700, opacity: 0.2 }}>
                                {d_t('bookCell')}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Quick Active Booking Details Card */}
          {selectedBooking && (
            <div className="active-booking-details-card" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1.5rem', position: 'relative' }}>
              <button 
                onClick={() => setSelectedBooking(null)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
              
              <div style={{ minWidth: '220px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 700 }}>{selectedBooking.name}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.85rem' }}>📞 {selectedBooking.phone}</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '12px', fontWeight: 700, background: selectedBooking.status === 'Pending' ? '#fff9db' : '#e7f5ff', color: selectedBooking.status === 'Pending' ? '#f08c00' : '#228be6', textTransform: 'uppercase' }}>
                    {selectedBooking.status}
                  </span>
                  <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '12px', fontWeight: 700, background: '#f1f3f5', color: '#495057' }}>
                    {lang === 'ta' ? 'அறை #' : 'Room #'} {selectedBooking.roomNumber || (lang === 'ta' ? 'ஒதுக்கப்படவில்லை' : 'Unassigned')}
                  </span>
                </div>
              </div>

              <div style={{ minWidth: '200px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#64748b' }}>{lang === 'ta' ? 'தங்கும் காலம்' : 'Stay Duration'}</p>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  📅 {formatDate(selectedBooking.checkIn)} — {formatDate(selectedBooking.checkOut)}
                </p>
                <div style={{ marginTop: '8px', display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#888', fontSize: '0.7rem' }}>{lang === 'ta' ? 'வருகை நேரம்' : 'In Time'}</label>
                    <select
                      value={selectedBooking.checkInTime || '12:00 PM'}
                      onChange={async (e) => {
                        const headers = { username: auth.username, password: auth.password };
                        try {
                          await api.patch(`/api/admin/bookings/${selectedBooking._id}`, { checkInTime: e.target.value }, { headers });
                          onRefresh();
                          setSelectedBooking(prev => ({ ...prev, checkInTime: e.target.value }));
                        } catch (err) { alert(err.message); }
                      }}
                      style={{ padding: '2px 4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.75rem', outline: 'none' }}
                    >
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="06:00 AM">06:00 AM</option>
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                      <option value="08:00 PM">08:00 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                      <option value="12:00 AM">12:00 AM</option>
                      <option value="02:00 AM">02:00 AM</option>
                      <option value="04:00 AM">04:00 AM</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#888', fontSize: '0.7rem' }}>{lang === 'ta' ? 'வெளியேறும் நேரம்' : 'Out Time'}</label>
                    <select
                      value={selectedBooking.checkOutTime || '11:00 AM'}
                      onChange={async (e) => {
                        const headers = { username: auth.username, password: auth.password };
                        try {
                          await api.patch(`/api/admin/bookings/${selectedBooking._id}`, { checkOutTime: e.target.value }, { headers });
                          onRefresh();
                          setSelectedBooking(prev => ({ ...prev, checkOutTime: e.target.value }));
                        } catch (err) { alert(err.message); }
                      }}
                      style={{ padding: '2px 4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.75rem', outline: 'none' }}
                    >
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                      <option value="08:00 PM">08:00 PM</option>
                    </select>
                  </div>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#868e96' }}>
                  {lang === 'ta' ? 'கோரப்பட்டது: ' : 'Requested: '} {selectedBooking.roomType} | {selectedBooking.guests} {lang === 'ta' ? 'விருந்தினர்கள்' : 'Guests'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedBooking.status === 'Pending' && (
                  <button 
                    onClick={async () => {
                      const headers = { username: auth.username, password: auth.password };
                      const confirmMsg = lang === 'ta' ? `${selectedBooking.name}-க்கான பதிவை உறுதிப்படுத்தவா?` : `Confirm booking for ${selectedBooking.name}?`;
                      if (window.confirm(confirmMsg)) {
                        try {
                          const res = await api.patch(`/api/admin/bookings/${selectedBooking._id}`, { status: 'Confirmed' }, { headers });
                          if (res.data?.waLink) window.open(res.data.waLink, '_blank');
                          setSelectedBooking(null);
                          onRefresh();
                        } catch (e) { alert(e.message); }
                      }
                    }} 
                    className="admin-btn admin-btn-primary" 
                    style={{ background: '#10b981', color: 'white' }}
                  >
                    {d_t('actionConfirm')}
                  </button>
                )}
                {selectedBooking.status === 'Confirmed' && (
                  <button 
                    onClick={async () => {
                      const headers = { username: auth.username, password: auth.password };
                      const confirmMsg = lang === 'ta' ? `${selectedBooking.name} செக்-அவுட் செய்யவா?` : `Check-out guest ${selectedBooking.name}?`;
                      if (window.confirm(confirmMsg)) {
                        try {
                          await api.patch(`/api/admin/bookings/${selectedBooking._id}`, { status: 'Checked-out' }, { headers });
                          setSelectedBooking(null);
                          onRefresh();
                        } catch (e) { alert(e.message); }
                      }
                    }} 
                    className="admin-btn admin-btn-primary" 
                    style={{ background: '#0284c7', color: 'white' }}
                  >
                    {d_t('actionCheckout')}
                  </button>
                )}
                <button 
                  onClick={() => {
                    const checkIn = new Date(selectedBooking.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                    const checkOut = new Date(selectedBooking.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                    const msg = `Hello ${selectedBooking.name}! 👋\n\nThis is BSS Residency, Courtallam. Regarding your stay in *Room ${selectedBooking.roomNumber}* from *${checkIn}* to *${checkOut}*:\n\nPlease let us know if you need any assistance! 🙏`;
                    const guestPhone = selectedBooking.phone.replace(/[^0-9]/g, '');
                    const formatted = guestPhone.startsWith('91') ? guestPhone : `91${guestPhone}`;
                    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(msg)}`, '_blank');
                  }} 
                  className="admin-btn admin-btn-outline" 
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#25D366', color: '#25D366', background: '#fff' }}
                >
                  <MessageCircle size={16} /> {d_t('actionWhatsapp')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Panel for Room Assignment */}
        <div className="calendar-sidebar-section card">
          <h3 style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700 }}>
            📌 {d_t('roomAllocations')}
          </h3>

          <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '1.25rem' }}>
            {d_t('allocationsDesc')}
          </p>

          {unassignedBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
              <ClipboardCheck size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{d_t('allAssigned')}</div>
              <div style={{ fontSize: '0.75rem' }}>{d_t('noPendingAlloc')}</div>
            </div>
          ) : (
            <div className="unassigned-bookings-list" style={{ display: 'grid', gap: '1rem' }}>
              {unassignedBookings.map(b => {
                const freeRooms = getAvailableRoomsForBooking(b);
                return (
                  <div key={b._id} className="unassigned-booking-card" style={{ padding: '1rem', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{b.name}</div>
                      <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 700, background: '#eff6ff', color: '#2563eb', textTransform: 'uppercase' }}>
                        {b.roomType}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'grid', gap: '2px', marginBottom: '0.75rem' }}>
                      <div>📅 {getDateLabel(new Date(b.checkIn))} — {getDateLabel(new Date(b.checkOut))}</div>
                      <div>👥 {b.guests} {lang === 'ta' ? 'விருந்தினர்கள்' : 'Guests'}</div>
                      <div>📞 {b.phone}</div>
                    </div>

                    <div className="room-assign-row" style={{ display: 'grid', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{d_t('availableRoomsCalendar')}</label>
                      <select 
                        defaultValue=""
                        onChange={async (e) => {
                          const roomNum = e.target.value;
                          if (roomNum) {
                            const confirmMsg = lang === 'ta' ? `${b.name}-க்கு அறை #${roomNum} ஒதுக்கவா?` : `Assign Room #${roomNum} to ${b.name}?`;
                            if (window.confirm(confirmMsg)) {
                              await onUpdateRoomNumber(b._id, roomNum);
                              onRefresh();
                            }
                          }
                        }}
                        style={{ padding: '0.45rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="" disabled>{d_t('selectRoomCalendar')}</option>
                        {freeRooms.map(r => (
                          <option key={r.roomNumber} value={r.roomNumber}>
                            {lang === 'ta' ? 'அறை' : 'Room'} {r.roomNumber} ({d_t('modalAvailable')})
                          </option>
                        ))}
                        {freeRooms.length === 0 && (
                          <option disabled value="">{d_t('noRoomsFoundCalendar')}</option>
                        )}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lang, setLang] = useState(() => localStorage.getItem('bss_admin_lang') || 'en');
  const t = ADMIN_TEXT[lang];

  const toggleLang = () => {
    const next = lang === 'en' ? 'ta' : 'en';
    setLang(next);
    localStorage.setItem('bss_admin_lang', next);
  };

  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute('href', '/manifest-admin.json');
    }
    return () => {
      if (manifestLink) {
        manifestLink.setAttribute('href', '/manifest.json');
      }
    };
  }, []);

  // FCM push while dashboard is open → status bar alert + app icon badge
  useEffect(() => {
    if (!auth) return;
    let cancelled = false;

    const showPushAlert = async (title, body, badgeCount) => {
      await setAppBadgeCount(badgeCount);
      if (Notification.permission === 'granted') {
        new Notification(title || 'BSS Residency', {
          body: body || 'New booking received',
          icon: '/logo.webp',
          tag: 'bss-new-booking',
          renotify: true,
        });
      }
      audioRef.current?.play().catch(() => {});
    };

    const listen = async () => {
      while (!cancelled) {
        try {
          const { onMessageListener } = await import('../firebase');
          const payload = await onMessageListener();
          if (cancelled) break;
          const title = payload?.notification?.title || payload?.data?.title;
          const body = payload?.notification?.body || payload?.data?.body;
          if (!title && !body) continue;
          const seen = parseInt(localStorage.getItem('bss_seen_notifs_count') || '0', 10);
          await showPushAlert(title, body, seen + 1);
        } catch {
          break;
        }
      }
    };

    listen();
    return () => { cancelled = true; };
  }, [auth]);

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadReviewCount, setUnreadReviewCount] = useState(0);
  const [isSeason, setIsSeason] = useState(false);
  const [isWeekendActive, setIsWeekendActive] = useState(false);
  const [statsPeriod, setStatsPeriod] = useState('all');
  const [bookingsPeriod, setBookingsPeriod] = useState('month');
  const [reviewsPeriod, setReviewsPeriod] = useState('month');
  const [notificationsPeriod, setNotificationsPeriod] = useState('all');
  const [fetchError, setFetchError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [loading, setLoading] = useState(true);

  // Global access for shared components
  window.selectedMonthGlobal = selectedMonth;
  window.setSelectedMonthGlobal = setSelectedMonth;
  const prevBookingCountRef = useRef(0);
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({ roomNumber: '', type: 'Double Bed A/C', nonSeasonPrice: '', weekendPrice: '', seasonPrice: '', status: 'Available' });
  const [editingRoomId, setEditingRoomId] = useState(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ guestName: '', bookingId: '', amount: '', method: 'Cash', status: 'Paid' });
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Check-in Modal State
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);

  // Offline Booking Modal State
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [offlineForm, setOfflineForm] = useState({
    name: '',
    phone: '',
    email: '',
    roomType: 'Double Bed A/C',
    checkIn: '',
    checkOut: '',
    checkInTime: '',
    checkOutTime: '',
    guests: 2,
    rooms: 1,
    message: '',
    advancePaid: 0,
    paymentMethod: 'Cash'
  });
  const today = new Date().toISOString().split('T')[0];
  const [offlineLoading, setOfflineLoading] = useState(false);

  // Calendar State & Fetching
  const [calendarStartDate, setCalendarStartDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [calendarBookings, setCalendarBookings] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  const handleCellClick = (room, date) => {
    // Format check-in date correctly without timezone shifting
    const checkInDateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    
    // Set checkout date default to next day
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const checkOutDateStr = new Date(nextDay.getTime() - nextDay.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    setOfflineForm({
      name: '',
      phone: '',
      email: '',
      roomType: room.type,
      checkIn: checkInDateStr,
      checkOut: checkOutDateStr,
      checkInTime: '',
      checkOutTime: '',
      guests: room.type.includes('Four') ? 4 : (room.type.includes('Three') ? 3 : 2),
      rooms: 1,
      message: `Offline Booking pre-filled for Room #${room.roomNumber}`,
      advancePaid: 0,
      paymentMethod: 'Cash'
    });
    setIsOfflineModalOpen(true);
  };

  const fetchCalendarData = useCallback(async () => {
    if (!auth) return;
    setCalendarLoading(true);
    try {
      const headers = { username: auth.username, password: auth.password };
      const endDate = new Date(calendarStartDate);
      endDate.setDate(endDate.getDate() + 14); // 14 days view
      const res = await api.get('/api/admin/calendar-bookings', {
        headers,
        params: {
          startDate: calendarStartDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      if (res.data.success) {
        setCalendarBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Fetch calendar error:', err);
    } finally {
      setCalendarLoading(false);
    }
  }, [auth, calendarStartDate]);

  useEffect(() => {
    if (activeTab === 'calendar') {
      fetchCalendarData();
    }
  }, [activeTab, fetchCalendarData]);

  const fetchData = useCallback(async () => {
    if (!auth) return;
    // Only show loading spinner on initial load
    if (!stats) setLoading(true);
    const [year, month] = selectedMonth.split('-');
    const headers = { username: auth.username, password: auth.password };
    setFetchError('');
    try {
      const results = await Promise.allSettled([
        api.get('/api/admin/stats', { headers, params: { period: statsPeriod, month, year } }),
        api.get('/api/admin/bookings', { headers, params: { page: 1, limit: 100, period: bookingsPeriod, month, year } }),
        api.get('/api/admin/rooms', { headers }),
        api.get('/api/admin/guests', { headers }),
        api.get('/api/admin/payments', { headers }),
        api.get('/api/admin/reviews', { headers, params: { period: reviewsPeriod, month, year } }),
        api.get('/api/admin/notifications', { headers, params: { period: notificationsPeriod, month, year } }),
        api.get('/api/admin/settings', { headers })
      ]);

      const errMsg = results.find((r) => r.status === 'rejected');
      if (errMsg) {
        const e = errMsg.reason;
        const msg = e?.response?.status === 401
          ? 'Login expired or wrong password. Log out and login again (use Render ADMIN_USERNAME / ADMIN_PASSWORD).'
          : (e?.response?.data?.message || e?.message || 'Could not load data from server');
        setFetchError(msg);
      }

      const get = (i) => (results[i].status === 'fulfilled' ? results[i].value : null);

      const statsRes = get(0);
      const bookingsRes = get(1);
      const roomsRes = get(2);
      const guestsRes = get(3);
      const paymentsRes = get(4);
      const reviewsRes = get(5);
      const notifRes = get(6);
      const settingsRes = get(7);

      if (statsRes) setStats(statsRes.data.stats);
      if (bookingsRes) setBookings(bookingsRes.data.bookings);
      if (roomsRes) setRooms(roomsRes.data.rooms);
      if (guestsRes) setGuests(guestsRes.data.guests);
      if (paymentsRes) setPayments(paymentsRes.data.payments);
      if (settingsRes) {
        setIsSeason(settingsRes.data.settings.isSeason || false);
        setIsWeekendActive(settingsRes.data.settings.isWeekendActive !== false);
      }

      const finalReviews = reviewsRes?.data?.reviews || [];
      const seenReviews = parseInt(localStorage.getItem('bss_seen_reviews_count') || '0');
      if (activeTab !== 'reviews' && finalReviews.length > seenReviews) {
        setUnreadReviewCount(finalReviews.length - seenReviews);
      } else if (activeTab === 'reviews') {
        localStorage.setItem('bss_seen_reviews_count', finalReviews.length.toString());
      }
      setReviews(finalReviews);

      const finalNotifs = notifRes?.data?.notifications || [];
      if (!notifRes && errMsg) {
        console.error('[Notifications] failed to load', errMsg.reason);
      }
      const seenNotifs = parseInt(localStorage.getItem('bss_seen_notifs_count') || '0', 10);
      if (activeTab !== 'notifications' && finalNotifs.length > seenNotifs) {
        const newCount = finalNotifs.length - seenNotifs;
        setUnreadCount(newCount);
        await setAppBadgeCount(newCount);
        const latest = finalNotifs[0];
        if (Notification.permission === 'granted') {
          new Notification(latest?.title || 'New Booking 🔔', {
            body: latest?.message || 'A new booking was received.',
            icon: '/logo.webp',
            tag: 'bss-new-booking',
            renotify: true,
          });
        }
        audioRef.current?.play().catch(() => {});
      } else if (activeTab === 'notifications') {
        localStorage.setItem('bss_seen_notifs_count', finalNotifs.length.toString());
        await clearAppBadge();
      }

      setNotifications(finalNotifs);

      const currentCount = bookingsRes?.data?.bookings?.length || 0;
      if (prevBookingCountRef.current > 0 && currentCount > prevBookingCountRef.current) {
        const latestBooking = bookingsRes?.data?.bookings?.[0];
        await setAppBadgeCount(Math.max(1, finalNotifs.length - seenNotifs));
        audioRef.current?.play().catch(() => {});
        if (Notification.permission === 'granted') {
          new Notification('New Booking Received! 🔔', {
            body: `New booking from ${latestBooking?.name || 'a guest'}`,
            icon: '/logo.webp',
            tag: 'bss-new-booking',
            renotify: true,
          });
        }
      }
      prevBookingCountRef.current = currentCount;
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [auth, statsPeriod, bookingsPeriod, reviewsPeriod, notificationsPeriod, selectedMonth]);

  useEffect(() => {
    if (activeTab === 'notifications') {
      setUnreadCount(0);
      localStorage.setItem('bss_seen_notifs_count', notifications.length.toString());
      clearAppBadge();
    }
    if (activeTab === 'reviews') {
      setUnreadReviewCount(0);
      localStorage.setItem('bss_seen_reviews_count', reviews.length.toString());
    }
  }, [activeTab, notifications.length, reviews.length]);

  useEffect(() => {
    const stored = localStorage.getItem('bss_admin') || sessionStorage.getItem('bss_admin');
    if (!stored) { navigate('/admin/login'); return; }
    setAuth(JSON.parse(stored));
  }, [navigate]);

  // Request Notification Permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    const headers = { username: auth.username, password: auth.password };
    try {
      // Logic: If isSeason is ON, active price = seasonPrice, else nonSeasonPrice
      const activePrice = isSeason ? roomForm.seasonPrice : roomForm.nonSeasonPrice;
      const payload = { ...roomForm, price: activePrice };
      
      if (editingRoomId) {
        await api.patch(`/api/admin/rooms/${editingRoomId}`, payload, { headers });
      } else {
        await api.post('/api/admin/rooms', payload, { headers });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error saving room: ' + err.message);
    }
  };

  const openAddModal = () => {
    setRoomForm({ roomNumber: '', type: 'Double Bed A/C', nonSeasonPrice: '', weekendPrice: '', seasonPrice: '', status: 'Available' });
    setEditingRoomId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setRoomForm({ 
      roomNumber: room.roomNumber, 
      type: room.type, 
      nonSeasonPrice: room.nonSeasonPrice || room.price, 
      weekendPrice: room.weekendPrice || room.nonSeasonPrice || room.price,
      seasonPrice: room.seasonPrice || room.price, 
      status: room.status 
    });
    setEditingRoomId(room._id);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    const headers = { username: auth.username, password: auth.password };
    await api.delete(`/api/admin/rooms/${id}`, { headers });
    fetchData();
  };

  const handleUpdateStatus = async (id, status) => {
    const headers = { username: auth.username, password: auth.password };
    const res = await api.patch(`/api/admin/bookings/${id}`, { status }, { headers });
    // If backend returns a waLink (on confirm/cancel), open it automatically
    if (res.data?.waLink) {
      window.open(res.data.waLink, '_blank');
    }
    fetchData();
  };

  // Confirm a booking → update status + auto-open WhatsApp
  const handleConfirmBooking = async (id, booking) => {
    if (!window.confirm(`Confirm booking for ${booking.name}? WhatsApp will open to notify the guest.`)) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      const res = await api.patch(`/api/admin/bookings/${id}`, { status: 'Confirmed' }, { headers });
      if (res.data?.waLink) {
        window.open(res.data.waLink, '_blank');
      }
      fetchData();
    } catch (err) {
      alert('Error confirming booking: ' + err.message);
    }
  };

  // Cancel a booking → update status + auto-open WhatsApp
  const handleCancelBooking = async (id, booking) => {
    const reason = window.prompt(`Cancellation reason for ${booking.name} (optional):`, '') || '';
    if (reason === null) return; // user hit Cancel on prompt
    const headers = { username: auth.username, password: auth.password };
    try {
      const res = await api.patch(`/api/admin/bookings/${id}`, { status: 'Cancelled', cancellationReason: reason }, { headers });
      if (res.data?.waLink) {
        window.open(res.data.waLink, '_blank');
      }
      fetchData();
    } catch (err) {
      alert('Error cancelling booking: ' + err.message);
    }
  };

  // Open WhatsApp for a booking
  const handleWhatsAppBooking = (booking) => {
    const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const msg = 
      `✅ *BSS Residency – Booking Update*\n\n` +
      `Dear ${booking.name},\n\n` +
      `Regarding your booking (ID: *${booking.bookingId || booking._id}*):\n\n` +
      `🛏️ Room: *${booking.roomType}*${booking.roomNumber ? ` (Room #${booking.roomNumber})` : ''}\n` +
      `📅 Check-in: *${checkIn}*\n` +
      `📅 Check-out: *${checkOut}*\n` +
      `📊 Status: *${booking.status}*\n\n` +
      `📍 BSS Residency, Bus Stand, Near Anna Statue, Courtallam – 627 802\n\n` +
      `Thank you! 🙏`;
    const phone = booking.phone.replace(/[^0-9]/g, '');
    const formatted = phone.startsWith('91') ? phone : `91${phone}`;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Open Add Payment modal for a specific booking
  const openAddPaymentModal = (booking) => {
    setPaymentForm({
      guestName: booking.name,
      bookingId: booking._id,
      amount: '',
      method: 'Cash',
      status: 'Paid',
    });
    setIsPaymentModalOpen(true);
  };

  const openCheckinModal = (booking) => {
    setSelectedCheckin(booking);
    setIsCheckinModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    setPaymentLoading(true);
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.post('/api/admin/payments', paymentForm, { headers });
      setIsPaymentModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error recording payment: ' + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleOfflineBookingSubmit = async (e) => {
    e.preventDefault();
    if (!offlineForm.name || !offlineForm.phone || !offlineForm.checkIn || !offlineForm.checkOut) {
      alert('Please fill in all required fields.');
      return;
    }
    if (new Date(offlineForm.checkIn) >= new Date(offlineForm.checkOut)) {
      alert('Check-out date must be after check-in date.');
      return;
    }

    setOfflineLoading(true);
    const headers = { username: auth.username, password: auth.password };
    try {
      const res = await api.post('/api/admin/bookings/offline', offlineForm, { headers });
      if (res.data.success) {
        alert('Offline Booking Added Successfully!');
        setIsOfflineModalOpen(false);
        setOfflineForm({
          name: '',
          phone: '',
          email: '',
          roomType: 'Double Bed A/C',
          checkIn: '',
          checkOut: '',
          checkInTime: '',
          checkOutTime: '',
          guests: 2,
          rooms: 1,
          message: '',
          advancePaid: 0,
          paymentMethod: 'Cash'
        });
        fetchData();
      }
    } catch (err) {
      alert('Error creating offline booking: ' + (err.response?.data?.message || err.message));
    } finally {
      setOfflineLoading(false);
    }
  };

  const handleDeleteGuest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this guest record?')) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.delete(`/api/admin/guests/${id}`, { headers });
      fetchData();
    } catch (err) {
      console.error('Error deleting guest:', err);
      alert('Failed to delete guest record.');
    }
  };

  const handleUpdateRoomNumber = async (id, roomNumber) => {
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.patch(`/api/admin/bookings/${id}`, { roomNumber }, { headers });
      // Local update for better UX before refresh
      setBookings(prev => prev.map(b => b._id === id ? { ...b, roomNumber } : b));
    } catch (err) {
      alert('Error updating room assignment: ' + err.message);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.delete(`/api/admin/bookings/${id}`, { headers });
      fetchData();
    } catch (err) {
      alert('Error deleting booking: ' + err.message);
    }
  };

  const handleCheckOut = async (id, booking) => {
    if (!window.confirm(`Complete Check-out for ${booking.name}?`)) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.patch(`/api/admin/bookings/${id}`, { status: 'Checked-out' }, { headers });
      
      // WhatsApp Feedback Message Link
      const guestPhone = booking.phone.replace(/[^0-9]/g, '');
      const formattedPhone = guestPhone.startsWith('91') ? guestPhone : `91${guestPhone}`;
      const msg = `Hello ${booking.name}! 👋\n\nThank you for staying at *BSS Residency*. We hope you had a pleasant stay!\n\nWe would love to hear about your experience. Please share your valuable feedback/review here:\n🔗 https://maps.app.goo.gl/HoVrP5LYitnw8qJ1A\n\nWe look forward to hosting you again! 😊`;
      const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
      
      window.open(waUrl, '_blank');
      fetchData();
    } catch (err) {
      alert('Error during check-out: ' + err.message);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.delete(`/api/admin/reviews/${id}`, { headers });
      fetchData();
    } catch (err) {
      alert('Error deleting review: ' + err.message);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.delete(`/api/admin/notifications/${id}`, { headers });
      fetchData();
    } catch (err) {
      alert('Error deleting notification: ' + err.message);
    }
  };

  const handleClearAllNotifications = async () => {
    if (!window.confirm('Clear ALL notifications? This cannot be undone.')) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.delete(`/api/admin/notifications/all`, { headers });
      fetchData();
    } catch (err) {
      alert('Error clearing notifications: ' + err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('bss_admin');
    sessionStorage.removeItem('bss_admin');
    navigate('/admin/login');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const renderView = () => {
    const d_t = (key) => DASHBOARD_LANG[lang]?.[key] || DASHBOARD_LANG['en']?.[key] || key;
    switch (activeTab) {
      case 'overview': return <DashboardOverview 
        stats={stats} 
        bookings={bookings} 
        period={statsPeriod}
        setPeriod={setStatsPeriod}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        lang={lang}
      />;
      case 'rooms': return <RoomManagement rooms={rooms} onAddClick={openAddModal} onDeleteRoom={handleDeleteRoom} onUpdateRoom={openEditModal} auth={auth} fetchData={fetchData} lang={lang} />;
      case 'bookings': return <BookingManagement
        bookings={bookings}
        rooms={rooms}
        period={bookingsPeriod}
        setPeriod={setBookingsPeriod}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
        onWhatsApp={handleWhatsAppBooking}
        onCheckOut={handleCheckOut}
        onUpdateRoomNumber={handleUpdateRoomNumber}
        onDelete={handleDeleteBooking}
        onAddPayment={openAddPaymentModal}
        onViewCheckin={openCheckinModal}
        formatDate={formatDate}
        onAddOfflineBookingClick={() => setIsOfflineModalOpen(true)}
        lang={lang}
      />;
      case 'calendar':
        return (
          <RoomAvailabilityCalendar
            rooms={rooms}
            bookings={calendarBookings}
            startDate={calendarStartDate}
            setStartDate={setCalendarStartDate}
            loading={calendarLoading}
            onRefresh={fetchCalendarData}
            onCellClick={handleCellClick}
            onUpdateRoomNumber={handleUpdateRoomNumber}
            formatDate={formatDate}
            lang={lang}
          />
        );
      case 'guests':
        return (
          <div className="card fade-in">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{d_t('guestName')}</th>
                    <th>{d_t('phone')}</th>
                    <th>{d_t('totalStays')}</th>
                    <th>{d_t('level')}</th>
                    <th>{d_t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{d_t('noGuests')}</td></tr>
                  ) : guests.map(g => (
                    <tr key={g._id}>
                      <td data-label={d_t('guestName')} style={{ fontWeight: 600 }}>{g.name}</td>
                      <td data-label={d_t('phone')}>{g.phone}</td>
                      <td data-label={d_t('totalStays')}>{g.totalStays}</td>
                      <td data-label={d_t('level')}><span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--admin-primary)', fontWeight: 700 }}>{g.loyaltyLevel}</span></td>
                      <td data-label={d_t('actions')}>
                        <button
                          className="action-link delete"
                          onClick={() => handleDeleteGuest(g._id)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#e74c3c' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'payments': return <Payments payments={payments} totalRevenue={stats?.totalRevenue} lang={lang} />;
      case 'reports': return <Reports stats={stats} period={statsPeriod} setPeriod={setStatsPeriod} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} lang={lang} />;
      case 'settings': return <SettingsView 
        isSeason={isSeason} 
        onToggleSeason={async (val) => {
          const headers = { username: auth.username, password: auth.password };
          try {
            await api.patch('/api/admin/settings', { isSeason: val }, { headers });
            setIsSeason(val);
            fetchData();
          } catch (err) {
            alert('Error updating season mode');
          }
        }}
        isWeekendActive={isWeekendActive}
        onToggleWeekend={async (val) => {
          const headers = { username: auth.username, password: auth.password };
          try {
            await api.patch('/api/admin/settings', { isWeekendActive: val }, { headers });
            setIsWeekendActive(val);
            fetchData();
          } catch (err) {
            alert('Error updating weekend mode');
          }
        }}
        lang={lang}
      />;
      case 'reviews': return <ReviewsView 
        reviews={reviews} 
        onDeleteReview={handleDeleteReview} 
        period={reviewsPeriod}
        setPeriod={setReviewsPeriod}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        lang={lang}
      />;
      case 'notifications': return <NotificationsView
        notifications={notifications}
        fetchError={fetchError}
        apiBase={API_BASE_URL}
        period={notificationsPeriod}
        setPeriod={setNotificationsPeriod}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        onDelete={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
        lang={lang}
      />;
      case 'gallery': return <GalleryManagement auth={auth} lang={lang} />;
      default: return <div className="card">Coming Soon...</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar-backdrop" onClick={() => document.body.classList.remove('sidebar-open')}></div>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        username={auth?.username}
        unreadCount={unreadCount}
        unreadReviewCount={unreadReviewCount}
        lang={lang}
        onToggleLang={toggleLang}
      />

      <main className="admin-main">
        {/* Mobile Header */}
        <header className="admin-mobile-header">
          <div className="mobile-logo">BSS <span>Residency</span></div>
          <button className="mobile-menu-btn" onClick={() => document.body.classList.toggle('sidebar-open')}>
            <div className="hamburger"></div>
          </button>
        </header>

        <header className="view-header">
          <div className="view-header-flex">
            <div className="view-header-titles">
              <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
              <p>{t.workWith}</p>
            </div>
            <div className="view-header-actions">
              <button onClick={fetchData} className="admin-btn admin-btn-outline header-btn">
                <RefreshCcw size={16} /> <span>{t.refresh}</span>
              </button>
              <a href="/" target="_blank" rel="noreferrer" className="admin-btn admin-btn-primary header-btn">
                <ExternalLink size={16} /> <span>{t.viewSite}</span>
              </a>
            </div>
          </div>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <RefreshCcw size={40} className="spinner" />
          </div>
        ) : renderView()}
      </main>

      {/* Room Modal */}
      <Modal
        title={editingRoomId ? "Edit Room" : "Add New Room"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleRoomSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text" required
                value={roomForm.roomNumber}
                onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                placeholder="e.g. 101"
              />
            </div>
            <div className="form-group">
              <label>Room Type</label>
              <select value={roomForm.type} onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}>
                <option>Double Bed A/C</option>
                <option>Four Bed A/C</option>
                <option>Double Bed</option>
                <option>Three Bed</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Weekday Price (Mon-Thu) (₹)</label>
              <input
                type="number" required
                value={roomForm.nonSeasonPrice}
                onChange={e => setRoomForm({ ...roomForm, nonSeasonPrice: e.target.value })}
                placeholder="e.g. 1300"
              />
            </div>
            <div className="form-group">
              <label>Weekend Price (Fri-Sun) (₹)</label>
              <input
                type="number" required
                value={roomForm.weekendPrice}
                onChange={e => setRoomForm({ ...roomForm, weekendPrice: e.target.value })}
                placeholder="e.g. 1600"
              />
            </div>
            <div className="form-group">
              <label>Peak Season Price (₹)</label>
              <input
                type="number" required
                value={roomForm.seasonPrice}
                onChange={e => setRoomForm({ ...roomForm, seasonPrice: e.target.value })}
                placeholder="e.g. 1600"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={roomForm.status} onChange={e => setRoomForm({ ...roomForm, status: e.target.value })}>
              <option>Available</option>
              <option>Occupied</option>
              <option>Maintenance</option>
            </select>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
            {editingRoomId ? "Update Room" : "Create Room"}
          </button>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        title="Record Payment"
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      >
        <form onSubmit={handlePaymentSubmit}>
          <div className="form-group">
            <label>Guest Name</label>
            <input
              type="text" required
              value={paymentForm.guestName}
              onChange={e => setPaymentForm({ ...paymentForm, guestName: e.target.value })}
              placeholder="Guest full name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number" required min="1"
                value={paymentForm.amount}
                onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="e.g. 2600"
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={paymentForm.method}
                onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })}
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Net Banking</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={paymentForm.status}
              onChange={e => setPaymentForm({ ...paymentForm, status: e.target.value })}
            >
              <option>Paid</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }} disabled={paymentLoading}>
            {paymentLoading ? 'Saving...' : '💾 Record Payment'}
          </button>
        </form>
      </Modal>
      {/* Online Check-in Modal */}
      <Modal
        title="🧾 Online Check-in Details"
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
      >
        {selectedCheckin && selectedCheckin.checkinData && (
          <div className="checkin-details-modal">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Full Name</label>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedCheckin.checkinData.fullName}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Age / Gender</label>
                <div style={{ fontWeight: 600 }}>{selectedCheckin.checkinData.age || '—'} / {selectedCheckin.checkinData.gender || '—'}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Address</label>
                <div style={{ fontWeight: 600 }}>
                  {selectedCheckin.checkinData.address}, {selectedCheckin.checkinData.city}, {selectedCheckin.checkinData.state} - {selectedCheckin.checkinData.pincode}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>ID Proof ({selectedCheckin.checkinData.idType})</label>
                <div style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{selectedCheckin.checkinData.idNumber}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Vehicle Number</label>
                <div style={{ fontWeight: 600 }}>{selectedCheckin.checkinData.vehicleNumber || 'No vehicle'}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Additional Guests</label>
                <div style={{ fontWeight: 600 }}>
                  {selectedCheckin.checkinData.numberOfGuests} Guests Total
                  {selectedCheckin.checkinData.guestNames?.length > 0 && (
                    <div style={{ fontSize: '0.85rem', fontWeight: 400, color: '#666', marginTop: '4px' }}>
                      Names: {selectedCheckin.checkinData.guestNames.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Special Requests</label>
                <div style={{ fontStyle: 'italic', color: '#444' }}>{selectedCheckin.checkinData.specialRequests || 'None'}</div>
              </div>
            </div>

            {selectedCheckin.checkinData.idProofImage && (
              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>ID Proof Image</label>
                <img
                  src={selectedCheckin.checkinData.idProofImage}
                  alt="ID Proof"
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button className="admin-btn admin-btn-primary" onClick={() => setIsCheckinModalOpen(false)}>
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Offline Booking Modal */}
      <Modal
        title="➕ Add Offline Booking"
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
      >
        <form onSubmit={handleOfflineBookingSubmit}>
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              type="text" required
              value={offlineForm.name}
              onChange={e => setOfflineForm({ ...offlineForm, name: e.target.value })}
              placeholder="Name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text" required
                value={offlineForm.phone}
                onChange={e => setOfflineForm({ ...offlineForm, phone: e.target.value })}
                placeholder="e.g. 9876543210"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={offlineForm.email}
                onChange={e => setOfflineForm({ ...offlineForm, email: e.target.value })}
                placeholder="e.g. guest@example.com"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Room Type *</label>
              <select value={offlineForm.roomType} onChange={e => setOfflineForm({ ...offlineForm, roomType: e.target.value })}>
                <option>Double Bed</option>
                <option>Double Bed A/C</option>
                <option>Three Bed</option>
                <option>Four Bed A/C</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Rooms</label>
              <input
                type="number" min="1" max="10"
                value={offlineForm.rooms}
                onChange={e => setOfflineForm({ ...offlineForm, rooms: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Check-In Date *</label>
              <input
                type="date" required
                min={today}
                value={offlineForm.checkIn}
                onChange={e => setOfflineForm({ ...offlineForm, checkIn: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Check-In Time *</label>
              <input
                type="time" required
                value={offlineForm.checkInTime} 
                onChange={e => setOfflineForm({ ...offlineForm, checkInTime: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Check-Out Date *</label>
              <input
                type="date" required
                min={offlineForm.checkIn || today}
                value={offlineForm.checkOut}
                onChange={e => setOfflineForm({ ...offlineForm, checkOut: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Check-Out Time *</label>
              <input
                type="time" required
                value={offlineForm.checkOutTime} 
                onChange={e => setOfflineForm({ ...offlineForm, checkOutTime: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Guests</label>
              <input
                type="number" min="1" max="40"
                value={offlineForm.guests}
                onChange={e => setOfflineForm({ ...offlineForm, guests: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Advance Paid (₹)</label>
              <input
                type="number" min="0"
                value={offlineForm.advancePaid}
                onChange={e => setOfflineForm({ ...offlineForm, advancePaid: e.target.value })}
                placeholder="e.g. 510 or 1000"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Payment Method (for Advance)</label>
              <select value={offlineForm.paymentMethod} onChange={e => setOfflineForm({ ...offlineForm, paymentMethod: e.target.value })}>
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Net Banking</option>
              </select>
            </div>
            <div className="form-group">
              <label>Special Notes</label>
              <input
                type="text"
                value={offlineForm.message}
                onChange={e => setOfflineForm({ ...offlineForm, message: e.target.value })}
                placeholder="e.g. Early check-in requested"
              />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={offlineLoading}>
            {offlineLoading ? 'Adding Offline Booking...' : '💾 Confirm Offline Booking'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
