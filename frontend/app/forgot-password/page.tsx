
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    // Demo UI only. Backend email functionality comes later.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setMessage(
      "Password recovery screen is ready. Email verification will be enabled after backend integration."
    );

    setLoading(false);
  }

  return (
    <main className="forgot-page">
      <section className="forgot-card">
        <Link href="/" className="brand">
          GAMING<span>HUB.</span>
        </Link>

        <div className="lock-icon">🔐</div>

        <span className="eyebrow">ACCOUNT RECOVERY</span>

        <h1>Forgot Password?</h1>

        <p className="description">
          Don't worry! Enter your registered email address
          to begin the password recovery process.
        </p>

        <form onSubmit={handleSubmit}>
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
            {loading ? "Processing..." : "Continue →"}
          </button>
        </form>

        {message && (
          <p className="message" role="status">
            {message}
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
        }

        form {
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

        .message {
          margin-top: 20px;
          padding: 12px;
          background: #172b28;
          color: #86efac;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.6;
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
