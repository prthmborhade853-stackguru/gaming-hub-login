"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setTimeout(
      () => setResendSeconds((seconds) => seconds - 1),
      1000
    );
    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  const passwordStrength =
    password.length === 0 ? 0 :
    password.length < 8 ? 1 :
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password) ? 3 : 2;

  async function requestOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setError("Password must contain between 8 and 72 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/auth/send-registration-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to send verification code.");
      }

      setStep("otp");
      setResendSeconds(60);
      setSuccess("Verification code sent. Check your email inbox.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const verifyResponse = await fetch(
        `${API}/auth/verify-registration-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp,
          }),
        }
      );
      const verifyData = await verifyResponse.json().catch(() => ({}));

      if (!verifyResponse.ok || !verifyData.verificationToken) {
        throw new Error(verifyData.message || "OTP verification failed.");
      }

      setVerificationToken(verifyData.verificationToken);

      const registerResponse = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          verificationToken: verifyData.verificationToken,
        }),
      });
      const registerData = await registerResponse.json().catch(() => ({}));

      if (!registerResponse.ok) {
        throw new Error(registerData.message || "Registration failed.");
      }

      setSuccess("Email verified and account created! Redirecting to login...");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setVerificationToken("");

      window.setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to complete registration."
      );
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (resendSeconds > 0 || loading) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/send-registration-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to resend OTP.");
      }

      setOtp("");
      setResendSeconds(60);
      setSuccess("A new verification code has been sent.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to resend verification code."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <Link href="/" className="brand">
        <span>GAMING</span> HUB<span className="brand-dot">.</span>
      </Link>

      <div className="register-layout">
        <section className="register-promo">
          <span className="eyebrow">JOIN THE PLAYER COMMUNITY</span>
          <h1>
            LEVEL UP
            <br />
            YOUR <span>GAME.</span>
          </h1>
          <p>
            Create your Gaming Hub account and explore gaming controllers,
            keyboards, headsets and more.
          </p>
          <div className="gaming-art">🎮</div>
          <div className="promo-caption">YOUR GAMING JOURNEY STARTS HERE</div>
        </section>

        <section className="register-card">
          <div className="card-icon">✦</div>
          <span className="eyebrow">
            {step === "details" ? "PLAYER REGISTRATION" : "EMAIL VERIFICATION"}
          </span>
          <h2>{step === "details" ? "Create Account" : "Verify Your Email"}</h2>
          <p className="subtitle">
            {step === "details"
              ? "Fill in your details to join Gaming Hub."
              : `Enter the 6-digit code sent to ${email}.`}
          </p>

          {step === "details" ? (
            <form onSubmit={requestOtp} className="register-form">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                minLength={2}
                required
              />

              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  required
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {password.length > 0 && (
                <div className="strength">
                  <div className="strength-bars">
                    {[1, 2, 3].map((level) => (
                      <span
                        key={level}
                        className={passwordStrength >= level ? "filled" : ""}
                      />
                    ))}
                  </div>
                  <small>
                    {passwordStrength === 1
                      ? "Weak password"
                      : passwordStrength === 2
                      ? "Moderate password"
                      : "Strong password"}
                  </small>
                </div>
              )}

              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-field">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>

              {error && <p className="error-message" role="alert">{error}</p>}
              {success && <p className="success-message" role="status">{success}</p>}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Sending OTP..." : "Send Verification Code →"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="register-form">
              <label htmlFor="otp">6-Digit Verification Code</label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                required
              />

              {error && <p className="error-message" role="alert">{error}</p>}
              {success && <p className="success-message" role="status">{success}</p>}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Create Account →"}
              </button>

              <button
                type="button"
                className="resend-button"
                onClick={resendOtp}
                disabled={loading || resendSeconds > 0}
              >
                {resendSeconds > 0
                  ? `Resend code in ${resendSeconds}s`
                  : "Resend verification code"}
              </button>

              <button
                type="button"
                className="back-link-button"
                onClick={() => {
                  setStep("details");
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
              >
                ← Edit registration details
              </button>
            </form>
          )}

          <p className="login-note">
            Already registered? <Link href="/login">Sign In</Link>
          </p>
          <Link href="/" className="back-link">← Back to Home</Link>
        </section>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          padding: 90px 6% 55px;
          background: #090d18;
          color: #f8fafc;
        }
        .brand {
          display: inline-block;
          margin-bottom: 35px;
          color: white;
          text-decoration: none;
          font-size: 23px;
          font-weight: 900;
          letter-spacing: 1px;
        }
        .brand span:first-child { color: #a78bfa; }
        .brand-dot { color: #60a5fa; }
        .register-layout {
          max-width: 1100px;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 450px;
          gap: 65px;
          align-items: center;
        }
        .eyebrow {
          color: #a78bfa;
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: bold;
        }
        .register-promo h1 {
          font-size: clamp(38px, 5vw, 62px);
          line-height: 1.15;
          margin: 20px 0;
          font-weight: 900;
        }
        .register-promo h1 span { color: #a78bfa; }
        .register-promo > p {
          max-width: 450px;
          color: #94a3b8;
          line-height: 1.8;
          font-size: 15px;
        }
        .gaming-art {
          margin-top: 35px;
          font-size: 100px;
          filter: drop-shadow(0 0 25px #8b5cf655);
        }
        .promo-caption {
          color: #64748b;
          letter-spacing: 3px;
          font-size: 11px;
          margin-top: 10px;
        }
        .register-card {
          padding: 35px;
          background: #111a2a;
          border: 1px solid #29364c;
          border-radius: 20px;
          box-shadow: 0 20px 60px #00000033;
        }
        .card-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #30205a;
          color: #c4b5fd;
          font-size: 25px;
          margin-bottom: 20px;
        }
        .register-card h2 { font-size: 28px; margin: 12px 0 8px; }
        .subtitle { color: #94a3b8; font-size: 13px; margin-bottom: 25px; }
        .register-form { display: flex; flex-direction: column; gap: 11px; }
        .register-form label {
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 600;
          margin-top: 5px;
        }
        .register-form input {
          width: 100%;
          padding: 13px;
          background: #0b1220;
          border: 1px solid #334155;
          border-radius: 9px;
          outline: none;
          color: white;
          font-size: 14px;
        }
        .register-form input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 2px #8b5cf622;
        }
        .password-field { position: relative; }
        .password-field input { padding-right: 65px; }
        .show-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #a78bfa;
          cursor: pointer;
          font-size: 12px;
        }
        .strength { display: flex; align-items: center; gap: 10px; }
        .strength-bars { display: flex; gap: 4px; flex: 1; }
        .strength-bars span {
          height: 4px;
          flex: 1;
          border-radius: 5px;
          background: #334155;
        }
        .strength-bars span.filled { background: #a78bfa; }
        .strength small { color: #94a3b8; font-size: 10px; }
        .error-message, .success-message {
          padding: 11px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.5;
        }
        .error-message { background: #3b1724; color: #fda4af; }
        .success-message { background: #12372b; color: #86efac; }
        .submit-button {
          width: 100%;
          margin-top: 12px;
          padding: 15px;
          border: none;
          border-radius: 9px;
          background: linear-gradient(90deg, #7c3aed, #6366f1);
          color: white;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s;
        }
        .submit-button:hover { opacity: 0.88; transform: translateY(-2px); }
        .submit-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .resend-button, .back-link-button {
          background: transparent;
          border: none;
          color: #a78bfa;
          cursor: pointer;
          padding: 9px;
          font-size: 12px;
        }
        .resend-button:disabled { color: #64748b; cursor: not-allowed; }
        .back-link-button { color: #94a3b8; }
        .login-note {
          text-align: center;
          margin-top: 25px;
          color: #94a3b8;
          font-size: 13px;
        }
        .login-note a, .back-link {
          color: #a78bfa;
          text-decoration: none;
          font-weight: 600;
        }
        .back-link {
          display: block;
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
        }
        @media (max-width: 850px) {
          .register-layout {
            grid-template-columns: 1fr;
            max-width: 500px;
            gap: 35px;
          }
          .register-promo { text-align: center; }
          .register-promo > p { margin: auto; }
          .gaming-art { font-size: 65px; }
        }
        @media (max-width: 500px) {
          .register-page { padding: 85px 16px 40px; }
          .register-card { padding: 24px 19px; }
        }
      `}</style>
    </main>
  );
}
