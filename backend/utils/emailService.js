const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email not configured. Set EMAIL_USER and EMAIL_PASS in .env');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });
};

// Format date nicely
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ============================================
// HTML Email Templates
// ============================================

const getBaseStyle = () => `
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0c0b0a; }
    .container { max-width: 600px; margin: 0 auto; background: #151411; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3); border: 1px solid rgba(212, 175, 55, 0.15); }
    .header { background: linear-gradient(135deg, #11100d 0%, #070706 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #d4af37; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
    .header p { color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }
    .body { padding: 32px 24px; color: #e2e8f0; }
    .greeting { font-size: 18px; color: #d4af37; margin-bottom: 16px; }
    .message { font-size: 14px; color: #a0aec0; line-height: 1.7; margin-bottom: 24px; }
    .details-card { background: #1a1915; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px; padding: 20px; margin-bottom: 24px; }
    .details-card h3 { margin: 0 0 16px; color: #d4af37; font-size: 16px; border-bottom: 2px solid #d4af37; padding-bottom: 8px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed rgba(212, 175, 55, 0.15); font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #718096; }
    .detail-value { color: #e2e8f0; font-weight: 600; }
    .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; }
    .status-pending { background: rgba(212, 175, 55, 0.1); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.3); }
    .status-confirmed { background: rgba(72, 187, 120, 0.1); color: #48bb78; border: 1px solid rgba(72, 187, 120, 0.3); }
    .status-cancelled { background: rgba(245, 101, 101, 0.1); color: #f56565; border: 1px solid rgba(245, 101, 101, 0.3); }
    .cta-btn { display: inline-block; background: #d4af37; color: #070706; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 8px; }
    .footer { background: #0c0b0a; padding: 24px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.5); font-size: 12px; margin: 4px 0; }
    .footer a { color: #d4af37; text-decoration: none; }
    .divider { height: 3px; background: linear-gradient(90deg, #d4af37, #f6e05e, #d4af37); margin: 0; }
    .highlight-box { background: linear-gradient(135deg, #d4af37 0%, #b7791f 100%); color: #070706; padding: 16px 20px; border-radius: 10px; text-align: center; margin-bottom: 24px; }
    .highlight-box h2 { margin: 0; font-size: 20px; }
    .highlight-box p { margin: 4px 0 0; font-size: 13px; opacity: 0.8; }
  </style>
`;

// 1. NEW BOOKING — Email to Customer
const bookingReceivedCustomer = (booking) => {
  const bookingId = booking.bookingId || booking._id;
  return {
    subject: `🏨 SM Golden Resorts — Booking Received #${bookingId}`,
    html: `
    <!DOCTYPE html><html><head>${getBaseStyle()}</head><body>
      <div class="container">
        <div class="header">
          <h1>🏨 SM Golden Resorts</h1>
          <p>Luxury Nature Retreat — Courtallam</p>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="highlight-box">
            <h2>⏳ Booking Received!</h2>
            <p>We will contact you shortly to confirm your reservation.</p>
          </div>
          <p class="greeting">Dear <strong>${booking.name}</strong>,</p>
          <p class="message">
            Thank you for choosing SM Golden Resorts! Your booking request has been received. 
            Our team will review and confirm your stay shortly.
          </p>
          <div class="details-card">
            <h3>📋 Booking Details</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#e2e8f0;">
              <tr><td style="padding:8px 0;color:#718096;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#d4af37;">#${bookingId}</td></tr>
              <tr style="border-bottom:1px dashed rgba(212,175,55,0.15);"><td style="padding:8px 0;color:#718096;">Room Type</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#e2e8f0;text-transform:uppercase;">${booking.roomType}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Check-in</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#e2e8f0;">📅 ${formatDate(booking.checkIn)}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Check-out</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#e2e8f0;">📅 ${formatDate(booking.checkOut)}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Guests</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#e2e8f0;">👥 ${booking.guests}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Rooms</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#e2e8f0;">🛏️ ${booking.rooms || 1}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Status</td><td style="padding:8px 0;text-align:right;"><span class="status-badge status-pending">⏳ Pending</span></td></tr>
            </table>
          </div>
          <div style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="margin:0;font-size:14px;color:#d4af37;">
              <strong>📌 What's Next?</strong><br>
              We will contact you directly on ${booking.phone} to confirm availability and discuss advance payment details if applicable.
            </p>
          </div>
          <div style="text-align:center;">
            <a href="https://wa.me/919443710420?text=${encodeURIComponent(`Hi SM Golden Resorts! My Booking ID is #${bookingId}.`)}" class="cta-btn">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
        <div class="footer">
          <p><strong>SM Golden Resorts</strong></p>
          <p>Old Falls Main Road, Courtallam, Tamil Nadu</p>
          <p>📞 <a href="tel:+919443710420">+91 94437 10420</a> | <a href="tel:+919003549849">+91 90035 49849</a></p>
        </div>
      </div>
    </body></html>
    `,
  };
};

// 2. BOOKING CONFIRMED — Email to Customer
const bookingConfirmedCustomer = (booking) => {
  const bookingId = booking.bookingId || booking._id;
  return {
    subject: `✅ SM Golden Resorts — Booking Confirmed! #${bookingId}`,
    html: `
    <!DOCTYPE html><html><head>${getBaseStyle()}</head><body>
      <div class="container">
        <div class="header">
          <h1>🏨 SM Golden Resorts</h1>
          <p>Luxury Nature Retreat — Courtallam</p>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="highlight-box" style="background:linear-gradient(135deg,#48bb78 0%,#38a169 100%);color:white;">
            <h2>✅ Booking Confirmed!</h2>
            <p>Your stay is confirmed. Welcome to SM Golden Resorts!</p>
          </div>
          <p class="greeting">Dear <strong>${booking.name}</strong>,</p>
          <p class="message">
            Great news! Your booking at SM Golden Resorts has been <strong>confirmed</strong>. 
            We look forward to hosting you! Details are below.
          </p>
          <div class="details-card">
            <h3>📋 Confirmed Booking</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#e2e8f0;">
              <tr><td style="padding:8px 0;color:#718096;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#d4af37;">#${bookingId}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Room Type</td><td style="padding:8px 0;text-align:right;font-weight:600;text-transform:uppercase;">${booking.roomType}${booking.roomNumber ? ` (Room #${booking.roomNumber})` : ''}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Check-in</td><td style="padding:8px 0;text-align:right;font-weight:600;">📅 ${formatDate(booking.checkIn)} — 12:00 PM</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Check-out</td><td style="padding:8px 0;text-align:right;font-weight:600;">📅 ${formatDate(booking.checkOut)} — 11:00 AM</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Guests</td><td style="padding:8px 0;text-align:right;font-weight:600;">👥 ${booking.guests}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Status</td><td style="padding:8px 0;text-align:right;"><span class="status-badge status-confirmed">✅ Confirmed</span></td></tr>
            </table>
          </div>
          <div style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="margin:0;font-size:14px;color:#d4af37;">
              <strong>📌 Reminders:</strong><br>
              ✅ Check-in: From <strong>12:00 PM</strong><br>
              ✅ Check-out: Before <strong>11:00 AM</strong><br>
              ✅ Please complete your <strong>Online Check-in</strong> before arrival.<br>
              ✅ Carry a valid government ID proof.
            </p>
          </div>
          <div style="text-align:center;">
            <a href="https://maps.app.goo.gl/HoVrP5LYitnw8qJ1A" class="cta-btn">
              📍 Get Directions
            </a>
          </div>
        </div>
        <div class="footer">
          <p><strong>SM Golden Resorts</strong></p>
          <p>Old Falls Main Road, Courtallam, Tamil Nadu</p>
        </div>
      </div>
    </body></html>
    `,
  };
};

// 3. BOOKING CANCELLED — Email to Customer
const bookingCancelledCustomer = (booking, reason = '') => {
  const bookingId = booking.bookingId || booking._id;
  return {
    subject: `❌ SM Golden Resorts — Booking Cancelled #${bookingId}`,
    html: `
    <!DOCTYPE html><html><head>${getBaseStyle()}</head><body>
      <div class="container">
        <div class="header">
          <h1>🏨 SM Golden Resorts</h1>
          <p>Luxury Nature Retreat — Courtallam</p>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="highlight-box" style="background:linear-gradient(135deg,#e53e3e 0%,#c53030 100%);color:white;">
            <h2>❌ Booking Cancelled</h2>
            <p>Your booking has been cancelled</p>
          </div>
          <p class="greeting">Dear <strong>${booking.name}</strong>,</p>
          <p class="message">
            We regret to inform you that your booking at SM Golden Resorts has been <strong>cancelled</strong>.
            ${reason ? `<br><br><strong>Reason:</strong> ${reason}` : ''}
          </p>
          <div class="details-card">
            <h3>📋 Cancelled Booking</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#e2e8f0;">
              <tr><td style="padding:8px 0;color:#718096;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#d4af37;">#${bookingId}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Room Type</td><td style="padding:8px 0;text-align:right;font-weight:600;text-transform:uppercase;">${booking.roomType}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Status</td><td style="padding:8px 0;text-align:right;"><span class="status-badge status-cancelled">❌ Cancelled</span></td></tr>
            </table>
          </div>
          <p class="message">
            We hope to welcome you in the future. Feel free to rebook or call us for any custom booking needs!
          </p>
        </div>
        <div class="footer">
          <p><strong>SM Golden Resorts</strong></p>
          <p>Old Falls Main Road, Courtallam, Tamil Nadu</p>
        </div>
      </div>
    </body></html>
    `,
  };
};

// 4. NEW BOOKING ALERT — Email to Admin
const newBookingAdmin = (booking) => {
  const bookingId = booking.bookingId || booking._id;
  return {
    subject: `🔔 New Booking Alert — ${booking.name} | ${booking.roomType.toUpperCase()}`,
    html: `
    <!DOCTYPE html><html><head>${getBaseStyle()}</head><body>
      <div class="container">
        <div class="header" style="background:linear-gradient(135deg,#dd6b20 0%,#ed8936 100%);">
          <h1>🔔 New Booking Request</h1>
          <p>SM Golden Resorts Admin</p>
        </div>
        <div class="body">
          <p class="greeting"><strong>${booking.name}</strong> has submitted a booking request!</p>
          <div class="details-card">
            <h3>📋 Details</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#e2e8f0;">
              <tr><td style="padding:8px 0;color:#718096;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#d4af37;">#${bookingId}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Guest Name</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.name}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Phone</td><td style="padding:8px 0;text-align:right;font-weight:600;">📞 ${booking.phone}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Email</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.email || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Room</td><td style="padding:8px 0;text-align:right;font-weight:600;text-transform:uppercase;">🛏  ${booking.roomType}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Check-in</td><td style="padding:8px 0;text-align:right;font-weight:600;">${formatDate(booking.checkIn)}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Check-out</td><td style="padding:8px 0;text-align:right;font-weight:600;">${formatDate(booking.checkOut)}</td></tr>
              <tr><td style="padding:8px 0;color:#718096;">Guests × Rooms</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.guests} × ${booking.rooms || 1}</td></tr>
              ${booking.message ? `<tr><td style="padding:8px 0;color:#718096;">Special Request</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.message}</td></tr>` : ''}
            </table>
          </div>
        </div>
      </div>
    </body></html>
    `,
  };
};

// ============================================
// Send Email Function
// ============================================

const sendEmail = async (to, template) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('📧 Email skipped (not configured)');
    return { success: false, reason: 'Email not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"SM Golden Resorts" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

// ============================================
// Exported Helper Functions
// ============================================

module.exports = {
  sendBookingReceivedEmail: async (booking) => {
    if (!booking.email) return { success: false, reason: 'No email provided' };
    return sendEmail(booking.email, bookingReceivedCustomer(booking));
  },

  sendBookingConfirmedEmail: async (booking) => {
    if (!booking.email) return { success: false, reason: 'No email provided' };
    return sendEmail(booking.email, bookingConfirmedCustomer(booking));
  },

  sendBookingCancelledEmail: async (booking, reason) => {
    if (!booking.email) return { success: false, reason: 'No email provided' };
    return sendEmail(booking.email, bookingCancelledCustomer(booking, reason));
  },

  sendNewBookingAdminAlert: async (booking) => {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (!adminEmail) return { success: false, reason: 'No admin email configured' };
    return sendEmail(adminEmail, newBookingAdmin(booking));
  },
};
