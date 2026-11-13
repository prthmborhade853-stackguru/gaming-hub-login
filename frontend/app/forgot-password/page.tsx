
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
).replace(/\/$/, "");

type Stage = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setTimeout(
      () => setCountdown((value) => value - 1),
      1000
    );

    return () => window.clearTimeout(timer);
  }, [countdown]);

  function clearMessages() {
    setMessage("");
    setError("");
  }

  async function sendOtp() {
    clearMessages();

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/send-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send OTP.");
      }

      setStage("otp");
      setCountdown(60);
      setMessage(data.message || "OTP sent. Please check your email.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    clearMessages();

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed.");
      }

      if (!data.verificationToken) {
        throw new Error("Verification token was not received.");
      }

      setVerificationToken(data.verificationToken);
      setStage("password");
      setMessage("Email verified successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    clearMessages();

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword,
          verificationToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed.");
      }

      setMessage("Password changed successfully! Redirecting to login...");

      window.setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="forgot-page">
      <section className="forgot-card">
        <Link href="/" className="brand">
          GAMING<span>HUB.</span>
        </Link>

        <div className="lock-icon">
          {stage === "email" ? "🔐" : stage === "otp" ? "📩" : "🔑"}
        </div>

        <span className="eyebrow">ACCOUNT RECOVERY</span>

        <h1>
          {stage === "email"
            ? "Forgot Password?"
            : stage === "otp"
            ? "Verify Your Email"
            : "Create New Password"}
        </h1>

        <p className="description">
          {stage === "email"
            ? "Enter your registered email address. We will send you a verification code."
            : stage === "otp"
            ? `Enter the 6-digit OTP sent to ${email}.`
            : "Your email has been verified. Create a strong new password."}
        </p>

        {stage === "email" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendOtp();
            }}
          >
            <label htmlFor="email">Registered Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send Verification OTP →"}
            </button>
          </form>
        )}

        {stage === "otp" && (
          <div className="form-area">
            <label htmlFor="otp">Enter 6-Digit OTP</label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              autoComplete="one-time-code"
            />

            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={sendOtp}
              disabled={loading || countdown > 0}
            >
              {countdown > 0
                ? `Resend OTP in ${countdown}s`
                : "Resend OTP"}
            </button>

            <button
              type="button"
              className="text-button"
              onClick={() => {
                setStage("email");
                setOtp("");
                clearMessages();
              }}
            >
              Change Email Address
            </button>
          </div>
        )}

        {stage === "password" && (
          <form onSubmit={resetPassword}>
            <label htmlFor="newPassword">New Password</label>

            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <label htmlFor="confirmPassword">Confirm New Password</label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Updating Password..." : "Reset Password →"}
            </button>
          </form>
        )}

        {message && (
          <p className="message" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <Link href="/login" className="back-link">
          ← Back to Login
        </Link>
      </section>

      <style jsx>{`
        .forgot-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 90px 18px 40px;
          background: #090d18;
          color: white;
        }

        .forgot-card {
          width: 100%;
          max-width: 460px;
          padding: 38px;
          background: #111a2a;
          border: 1px solid #29364c;
          border-radius: 20px;
          text-align: center;
        }

        .brand {
          display: block;
          margin-bottom: 35px;
          font-size: 23px;
          font-weight: 900;
          color: white;
          text-decoration: none;
        }

        .brand span {
          color: #a78bfa;
        }

        .lock-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .eyebrow {
          color: #a78bfa;
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        h1 {
          font-size: 29px;
          margin: 15px 0;
        }

        .description {
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.8;
          margin-bottom: 28px;
          overflow-wrap: anywhere;
        }

        form,
        .form-area {
          display: flex;
          flex-direction: column;
          text-align: left;
          gap: 12px;
        }

        label {
          font-size: 13px;
          color: #cbd5e1;
        }

        input {
          width: 100%;
          box-sizing: border-box;
          padding: 14px;
          background: #0b1220;
          border: 1px solid #334155;
          border-radius: 9px;
          color: white;
          outline: none;
        }

        input:focus {
          border-color: #8b5cf6;
        }

        button {
          padding: 14px;
          margin-top: 10px;
          background: linear-gradient(90deg, #7c3aed, #6366f1);
          color: white;
          border: none;
          border-radius: 9px;
          font-weight: bold;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .secondary-button {
          margin-top: 0;
          background: #202c42;
          border: 1px solid #3b4a64;
        }

        .text-button {
          margin-top: 0;
          padding: 8px;
          background: transparent;
          color: #a78bfa;
        }

        .message,
        .error {
          margin-top: 20px;
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .message {
          background: #172b28;
          color: #86efac;
        }

        .error {
          background: #351d2a;
          color: #fca5a5;
        }

        .back-link {
          display: block;
          margin-top: 25px;
          color: #a78bfa;
          text-decoration: none;
          font-size: 13px;
        }

        @media (max-width: 500px) {
          .forgot-card {
            padding: 25px 19px;
          }
        }
      `}</style>
    </main>
  );
}
