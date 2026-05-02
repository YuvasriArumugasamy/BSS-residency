// Shared constants: contact info, rooms, pricing, location

export const CONTACT = {
  phonePrimary: '+91 88385 99755',
  phoneSecondary: '+91 93449 89393',
  whatsapp1: '918838599755', // Primary
  whatsapp2: '919344989393', // Secondary
  whatsapp: '919344989393', // Updated to 9344989393 as per user request
  instagram: 'coutrallam_bss_residency',
  addressLine1: 'Bus Stand, Near Anna Statue',
  addressLine2: 'Courtallam, Tamil Nadu – 627 802',
  checkIn: 'Flexible',
  checkOut: 'Flexible',
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
  { name: 'Main Falls', distance: '1.2 km' },
  { name: 'Old Courtallam Falls', distance: '2.1 km' },
  { name: 'Five Falls', distance: '2.8 km' },
  { name: 'Peraruvi', distance: '3.5 km' },
  { name: 'Shenbagadevi', distance: '4.2 km' },
  { name: 'Honey Falls', distance: '5.1 km' },
];

// Room types with pricing
export const ROOMS = [
  {
    key: 'double-bed',
    icon: '🛏️',
    name: 'Double Bed',
    type: 'Non-A/C',
    seasonPrice: 1300,
    nonSeasonPrice: 1000,
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
    seasonPrice: 1600,
    nonSeasonPrice: 1300,
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
    seasonPrice: 2500,
    nonSeasonPrice: 2000,
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
    seasonPrice: 2800,
    nonSeasonPrice: 2300,
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
  { icon: '❄️', label: 'A/C Rooms' },
  { icon: '🅿️', label: 'Limited Parking' },
  { icon: '💧', label: '100m to Falls' },
  { icon: '🔒', label: 'CCTV Security' },
  { icon: '📶', label: 'Free Wi-Fi' },
  { icon: '🚿', label: '24hr Hot Water' },
  { icon: '🛏️', label: 'Extra Bed Available' },
  { icon: '👨‍👩‍👧‍👦', label: 'Family Friendly' },
];

export const waLink = (text = 'Hello BSS Residency!', num = CONTACT.whatsapp) =>
  `https://wa.me/${num}?text=${encodeURIComponent(text)}`;

// WhatsApp Automation Helpers
export const WA_TEMPLATES = {
  getWelcome: (num) => waLink('Hi! I want to know more about room details and availability. 🙏', num),
  getLocation: (num) => waLink(`Hello BSS Residency! 🙏\nPlease send me the exact location of the lodge.\n\nOur Address:\n${CONTACT.addressLine1}, ${CONTACT.addressLine2}\nMap: ${MAP.directUrl}`, num),
  getRoomInfo: (roomName, price, num) => waLink(`Hello BSS Residency! 🙏\n\nI am interested in the *${roomName}* room.\nPrice: ₹${price}/night\n\nPlease let me know the availability!`, num),
  getBookingHelp: (num) => waLink('Hi! I need help with my booking. Can you please assist?', num),
};
