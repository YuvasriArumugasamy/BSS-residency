const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // Only create if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email not configured. Set EMAIL_USER and EMAIL_PASS in .env');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (NOT your Gmail password)
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
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f1eb; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #d4a857; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
    .header p { color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }
    .body { padding: 32px 24px; }
    .greeting { font-size: 18px; color: #1a1a2e; margin-bottom: 16px; }
    .message { font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 24px; }
    .details-card { background: #faf8f4; border: 1px solid #e8e0d0; border-radius: 10px; padding: 20px; margin-bottom: 24px; }
    .details-card h3 { margin: 0 0 16px; color: #1a1a2e; font-size: 16px; border-bottom: 2px solid #d4a857; padding-bottom: 8px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e8e0d0; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #888; }
    .detail-value { color: #1a1a2e; font-weight: 600; }
    .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-confirmed { background: #d4edda; color: #155724; }
    .status-cancelled { background: #f8d7da; color: #721c24; }
    .cta-btn { display: inline-block; background: #d4a857; color: #1a1a2e; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 8px; }
    .footer { background: #1a1a2e; padding: 24px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.5); font-size: 12px; margin: 4px 0; }
    .footer a { color: #d4a857; text-decoration: none; }
    .divider { height: 3px; background: linear-gradient(90deg, #d4a857, #f0d890, #d4a857); margin: 0; }
    .highlight-box { background: linear-gradient(135deg, #d4a857 0%, #c49a3c 100%); color: #1a1a2e; padding: 16px 20px; border-radius: 10px; text-align: center; margin-bottom: 24px; }
    .highlight-box h2 { margin: 0; font-size: 20px; }
    .highlight-box p { margin: 4px 0 0; font-size: 13px; opacity: 0.8; }
  </style>
`;

// 1. NEW BOOKING — Email to Customer
const bookingReceivedCustomer = (booking) => {
  const bookingId = booking.bookingId || booking._id;
  return {
    subject: `🏨 BSS Residency — Booking Received #${bookingId}`,
    html: `
    <!DOCTYPE html><html><head>${getBaseStyle()}</head><body>
      <div class="container">
        <div class="header">
          <h1>🏨 BSS Residency</h1>
          <p>Premium Guesthouse — Courtallam</p>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="highlight-box">
            <h2>⏳ Booking Received!</h2>
            <p>We'll confirm your booking shortly via WhatsApp</p>
          </div>
          <p class="greeting">Dear <strong>${booking.name}</strong>,</p>
          <p class="message">
            Thank you for choosing BSS Residency! Your booking request has been received. 
            Our team will review and confirm your booking within a few minutes.
          </p>
          <div class="details-card">
            <h3>📋 Booking Details</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr><td style="padding:8px 0;color:#888;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#d4a857;">#${bookingId}</td></tr>
              <tr style="border-bottom:1px dashed #e8e0d0;"><td style="padding:8px 0;color:#888;">Room Type</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1a2e;">${booking.roomType}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Check-in</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1a2e;">📅 ${formatDate(booking.checkIn)}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Check-out</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1a2e;">📅 ${formatDate(booking.checkOut)}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Guests</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1a2e;">👥 ${booking.guests}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Rooms</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1a2e;">🛏️ ${booking.rooms || 1}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Status</td><td style="padding:8px 0;text-align:right;"><span class="status-badge status-pending">⏳ Pending</span></td></tr>
            </table>
          </div>
          <div style="background:#f0f9ff;border:1px solid #b8daff;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="margin:0;font-size:14px;color:#004085;">
              <strong>📌 Next Steps:</strong><br>
              1. Pay advance ₹500 via UPI<br>
              2. Share screenshot on WhatsApp<br>
              3. Get instant confirmation!
            </p>
          </div>
          <div style="text-align:center;">
            <a href="https://wa.me/918838599755?text=${encodeURIComponent(`Hi BSS Residency! My Booking ID is #${bookingId}. I have paid the advance.`)}" class="cta-btn" style="color:#1a1a2e;">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
        <div class="footer">
          <p><strong>BSS Residency</strong></p>
          <p>Bus Stand, Near Anna Statue, Courtallam – 627 802</p>
          <p>📞 <a href="tel:+918838599755">+91 88385 99755</a> | <a href="tel:+919344989393">+91 93449 89393</a></p>
          <p style="margin-top:12px;">📍 <a href="https://maps.app.goo.gl/HoVrP5LYitnw8qJ1A">Get Directions</a></p>
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
    subject: `✅ BSS Residency — Booking Confirmed! #${bookingId}`,
    html: `
    <!DOCTYPE html><html><head>${getBaseStyle()}</head><body>
      <div class="container">
        <div class="header">
          <h1>🏨 BSS Residency</h1>
          <p>Premium Guesthouse — Courtallam</p>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="highlight-box" style="background:linear-gradient(135deg,#28a745 0%,#20c997 100%);color:white;">
            <h2>✅ Booking Confirmed!</h2>
            <p>Your stay is confirmed. Welcome to BSS Residency!</p>
          </div>
          <p class="greeting">Dear <strong>${booking.name}</strong>,</p>
          <p class="message">
            Great news! Your booking at BSS Residency has been <strong>confirmed</strong>. 
            We are excited to welcome you. Please find your booking details below.
          </p>
          <div class="details-card">
            <h3>📋 Confirmed Booking</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr><td style="padding:8px 0;color:#888;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#d4a857;">#${bookingId}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Room Type</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.roomType}${booking.roomNumber ? ` (Room #${booking.roomNumber})` : ''}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Check-in</td><td style="padding:8px 0;text-align:right;font-weight:600;">📅 ${formatDate(booking.checkIn)} — 11:00 AM</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Check-out</td><td style="padding:8px 0;text-align:right;font-weight:600;">📅 ${formatDate(booking.checkOut)} — 10:00 AM</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Guests</td><td style="padding:8px 0;text-align:right;font-weight:600;">👥 ${booking.guests}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Status</td><td style="padding:8px 0;text-align:right;"><span class="status-badge status-confirmed">✅ Confirmed</span></td></tr>
            </table>
          </div>
          <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="margin:0;font-size:14px;color:#856404;">
              <strong>📌 Reminders:</strong><br>
              ✅ Check-in: From <strong>11:00 AM</strong><br>
              ✅ Check-out: Before <strong>10:00 AM</strong><br>
              ✅ Carry valid <strong>ID proof</strong> (Aadhaar/Driving License)<br>
              ✅ Balance payment at property
            </p>
          </div>
          <div style="text-align:center;">
            <a href="https://maps.app.goo.gl/HoVrP5LYitnw8qJ1A" class="cta-btn" style="color:#1a1a2e;">
              📍 Get Directions
            </a>
          </div>
        </div>
        <div class="footer">
          <p><strong>BSS Residency</strong></p>
          <p>Bus Stand, Near Anna Statue, Courtallam – 627 802</p>
          <p>📞 <a href="tel:+918838599755">+91 88385 99755</a> | <a href="tel:+919344989393">+91 93449 89393</a></p>
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
    subject: `❌ BSS Residency — Booking Cancelled #${bookingId}`,
    html: `
    <!DOCTYPE html><html><head>${getBaseStyle()}</head><body>
      <div class="container">
        <div class="header">
          <h1>🏨 BSS Residency</h1>
          <p>Premium Guesthouse — Courtallam</p>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="highlight-box" style="background:linear-gradient(135deg,#dc3545 0%,#c82333 100%);color:white;">
            <h2>❌ Booking Cancelled</h2>
            <p>Your booking has been cancelled</p>
          </div>
          <p class="greeting">Dear <strong>${booking.name}</strong>,</p>
          <p class="message">
            We're sorry to inform you that your booking at BSS Residency has been <strong>cancelled</strong>.
            ${reason ? `<br><br><strong>Reason:</strong> ${reason}` : ''}
          </p>
          <div class="details-card">
            <h3>📋 Cancelled Booking</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr><td style="padding:8px 0;color:#888;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#d4a857;">#${bookingId}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Room Type</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.roomType}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Status</td><td style="padding:8px 0;text-align:right;"><span class="status-badge status-cancelled">❌ Cancelled</span></td></tr>
            </table>
          </div>
          <p class="message">
            We'd love to have you as our guest in the future. Feel free to make a new booking anytime!
          </p>
          <div style="text-align:center;">
            <a href="https://wa.me/918838599755?text=${encodeURIComponent('Hi BSS Residency! I would like to rebook.')}" class="cta-btn" style="color:#1a1a2e;">
              🔄 Rebook on WhatsApp
            </a>
          </div>
        </div>
        <div class="footer">
          <p><strong>BSS Residency</strong></p>
          <p>Bus Stand, Near Anna Statue, Courtallam – 627 802</p>
          <p>📞 <a href="tel:+918838599755">+91 88385 99755</a></p>
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
    subject: `🔔 New Booking Alert — ${booking.name} | ${booking.roomType}`,
    html: `
    <!DOCTYPE html><html><head>${getBaseStyle()}</head><body>
      <div class="container">
        <div class="header" style="background:linear-gradient(135deg,#ff6b35 0%,#f7931e 100%);">
          <h1>🔔 New Booking Alert!</h1>
          <p>BSS Residency Admin</p>
        </div>
        <div class="body">
          <p class="greeting"><strong>${booking.name}</strong> has made a new booking!</p>
          <div class="details-card">
            <h3>📋 Booking Details</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr><td style="padding:8px 0;color:#888;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#d4a857;">#${bookingId}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Guest Name</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.name}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;text-align:right;font-weight:600;">📞 ${booking.phone}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.email || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Room</td><td style="padding:8px 0;text-align:right;font-weight:600;">🛏️ ${booking.roomType}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Check-in</td><td style="padding:8px 0;text-align:right;font-weight:600;">${formatDate(booking.checkIn)}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Check-out</td><td style="padding:8px 0;text-align:right;font-weight:600;">${formatDate(booking.checkOut)}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Guests × Rooms</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.guests} × ${booking.rooms || 1}</td></tr>
              ${booking.message ? `<tr><td style="padding:8px 0;color:#888;">Special Request</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.message}</td></tr>` : ''}
            </table>
          </div>
          <div style="text-align:center;">
            <a href="https://bss-residency.vercel.app/admin/login" class="cta-btn" style="color:#1a1a2e;background:#ff6b35;">
              🖥️ Open Admin Dashboard
            </a>
          </div>
        </div>
        <div class="footer">
          <p>BSS Residency Admin Notification</p>
          <p>This is an automated email.</p>
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
      from: `"BSS Residency" <${process.env.EMAIL_USER}>`,
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
  // Send booking received email to customer
  sendBookingReceivedEmail: async (booking) => {
    if (!booking.email) return { success: false, reason: 'No email provided' };
    return sendEmail(booking.email, bookingReceivedCustomer(booking));
  },

  // Send booking confirmed email to customer
  sendBookingConfirmedEmail: async (booking) => {
    if (!booking.email) return { success: false, reason: 'No email provided' };
    return sendEmail(booking.email, bookingConfirmedCustomer(booking));
  },

  // Send booking cancelled email to customer
  sendBookingCancelledEmail: async (booking, reason) => {
    if (!booking.email) return { success: false, reason: 'No email provided' };
    return sendEmail(booking.email, bookingCancelledCustomer(booking, reason));
  },

  // Send new booking alert to admin
  sendNewBookingAdminAlert: async (booking) => {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (!adminEmail) return { success: false, reason: 'No admin email configured' };
    return sendEmail(adminEmail, newBookingAdmin(booking));
  },
};
