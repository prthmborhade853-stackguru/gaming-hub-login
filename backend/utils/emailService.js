
const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing from backend/.env");
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtpEmail(email, otp, purpose) {
  const isRegistration = purpose === "register";

  const subject = isRegistration
    ? "Verify your Gaming Hub email"
    : "Reset your Gaming Hub password";

  const heading = isRegistration
    ? "Welcome to Gaming Hub! 🎮"
    : "Password Reset Request";

  const message = isRegistration
    ? "Use the OTP below to verify your email address and complete your registration."
    : "Use the OTP below to verify your email address and reset your password.";

  const html = `
    <div style="font-family:Arial,sans-serif;background:#080d1c;padding:35px 15px;color:#ffffff;">
      <div style="max-width:500px;margin:auto;background:#111a30;border:1px solid #334155;border-radius:15px;padding:30px;text-align:center;">
        <h1 style="color:#00eaff;">🎮 GAMING HUB</h1>

        <h2>${heading}</h2>

        <p style="color:#cbd5e1;line-height:1.6;">
          ${message}
        </p>

        <div style="background:#0b1427;border:1px solid #7c3aed;border-radius:10px;padding:20px;margin:25px 0;">
          <p style="color:#94a3b8;font-size:12px;">YOUR VERIFICATION CODE</p>
          <h1 style="color:#c4b5fd;letter-spacing:10px;font-size:32px;">
            ${otp}
          </h1>
        </div>

        <p style="color:#94a3b8;font-size:13px;">
          This OTP expires in 5 minutes.
        </p>

        <p style="color:#94a3b8;font-size:12px;">
          If you did not request this code, please ignore this email.
        </p>
      </div>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [email],
    subject,
    html,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error("Unable to send verification email.");
  }

  return data;
}

module.exports = { sendOtpEmail };
