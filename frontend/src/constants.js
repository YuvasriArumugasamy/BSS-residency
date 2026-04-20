// Shared constants: contact info, rooms, pricing, location

export const CONTACT = {
  phonePrimary: '+91 88385 99755',
  phoneSecondary: '+91 93449 89393',
  whatsapp: '918838599755', // for wa.me links
  addressLine1: 'Bus Stand, Near Anna Statue',
  addressLine2: 'Courtallam, Tamil Nadu – 627 802',
  checkIn: '11:00 AM',
  checkOut: '10:00 AM',
};

export const MAP = {
  // Google Maps embed URL for BSS Residency, Courtallam
  embedSrc:
    'https://www.google.com/maps?q=BSS%20Residency%20Courtallam&output=embed',
  directUrl: 'https://maps.app.goo.gl/HoVrP5LYitnw8qJ1A',
};

// Nearby places list (similar to reference screenshot)
export const NEARBY_PLACES = [
  { name: 'Tiger Falls', distance: '0.38 km' },
  { name: 'குற்றாலம் சாரல்', distance: '0.76 km' },
  { name: 'Raghu don Courtrallam', distance: '1.14 km' },
  { name: 'Arulmigu Thiru Kuttralanathar Temple', distance: '1.31 km' },
  { name: 'Thendral Cottage', distance: '1.32 km' },
  { name: 'Courtallam Main Waterfalls', distance: '1.38 km' },
  { name: 'Main Falls Arch', distance: '1.39 km' },
];

// Room types with pricing
export const ROOMS = [
  {
    key: 'double-bed',
    icon: '🛏️',
    name: 'Double Bed',
    type: 'Non-A/C',
    price: 1300,
    desc:
      "Comfortable double bed room with natural ventilation — ideal for couples and small families visiting Courtallam.",
    features: [
      'Double bed with premium mattress',
      'Ceiling fan',
      '24hr hot water',
      'LED TV',
      'Attached bathroom',
      'Daily housekeeping',
    ],
  },
  {
    key: 'double-bed-ac',
    icon: '❄️',
    name: 'Double Bed A/C',
    type: 'A/C',
    price: 1600,
    desc:
      'Air-conditioned double bed room for a cool, restful stay. Modern interiors and all essential amenities.',
    features: [
      'Double bed with premium mattress',
      'DC Inverter A/C',
      '24hr hot water',
      'LED TV',
      'Attached bathroom',
      'Daily housekeeping',
    ],
  },
  {
    key: 'four-bed',
    icon: '👨‍👩‍👧‍👦',
    name: 'Four Bed',
    type: 'Non-A/C',
    price: 2500,
    desc:
      'Spacious four-bed room — perfect for families and small groups travelling together.',
    features: [
      'Four beds with premium mattresses',
      'Ceiling fans',
      '24hr hot water',
      'LED TV',
      'Attached bathroom',
      'Roomy layout for families',
    ],
  },
  {
    key: 'four-bed-ac',
    icon: '👑',
    name: 'Four Bed A/C',
    type: 'A/C',
    price: 2800,
    desc:
      'Our premium family choice. Large four-bed A/C room with modern furnishings and top-tier comfort.',
    features: [
      'Four beds with premium mattresses',
      'DC Inverter A/C',
      '24hr hot water',
      'LED TV',
      'Attached bathroom',
      'Priority housekeeping',
    ],
  },
];

export const AMENITIES = [
  { icon: '❄️', label: 'A/C Rooms Available' },
  { icon: '🅿️', label: 'Parking Available' },
  { icon: '💧', label: '100 mt by Courtallam' },
  { icon: '🔒', label: 'CCTV Security' },
  { icon: '📶', label: 'Free Wi-Fi' },
  { icon: '🚿', label: '24hr Hot Water' },
];

export const waLink = (text = 'Hello BSS Residency!') =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
