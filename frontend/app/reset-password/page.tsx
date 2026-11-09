
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Reset token is missing. Please request a new password reset link.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setMessage("Password must contain between 8 and 72 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Demo UI only. Actual token verification and password update
    // will be implemented in the backend phase.
    setTimeout(() => {
      setMessage(
        "Reset form validated. Password updating will be enabled after backend integration."
      );
      setLoading(false);
    }, 700);
  }

  return (
    <main className="reset-page">
      <section className="reset-card">
        <Link href="/" className="brand">
          GAMING<span>HUB.</span>
        </Link>

        <div className="lock-icon">🔑</div>

        <span className="eyebrow">SECURE YOUR ACCOUNT</span>

        <h1>Reset Password</h1>

        <p className="description">
          Create a new password for your Gaming Hub account.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="password">New Password</label>

          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              maxLength={72}
              required
            />

            <button
              type="button"
              className="show-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="confirmPassword">Confirm New Password</label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            maxLength={72}
            required
          />

          {message && (
            <p className="message" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Processing..." : "Update Password →"}
          </button>
        </form>

        <Link href="/login" className="back-link">
          ← Back to Login
        </Link>
      </section>

      <style jsx>{`
        .reset-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 90px 18px 40px;
          background: #090d18;
          color: white;
        }

        .reset-card {
          width: 100%;
          max-width: 460px;
          padding: 38px;
          background: #111a2a;
          border: 1px solid #29364c;
          border-radius: 20px;
        }

        .brand {
          display: block;
          text-align: center;
          margin-bottom: 35px;
          color: white;
          font-size: 23px;
          font-weight: 900;
          text-decoration: none;
        }

        .brand span {
          color: #a78bfa;
        }

        .lock-icon {
          text-align: center;
          font-size: 48px;
          margin-bottom: 20px;
        }

        .eyebrow {
          display: block;
          text-align: center;
          color: #a78bfa;
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        h1 {
          text-align: center;
          font-size: 29px;
          margin: 15px 0;
        }

        .description {
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.8;
          margin-bottom: 28px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        label {
          color: #cbd5e1;
          font-size: 13px;
        }

        input {
          width: 100%;
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

        .password-field {
          position: relative;
        }

        .password-field input {
          padding-right: 65px;
        }

        .show-button {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #a78bfa;
          cursor: pointer;
        }

        .message {
          padding: 12px;
          background: #30205a;
          color: #c4b5fd;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.6;
        }

        .submit-button {
          padding: 14px;
          margin-top: 10px;
          background: linear-gradient(90deg, #7c3aed, #6366f1);
          color: white;
          border: none;
          border-radius: 9px;
          font-weight: bold;
          cursor: pointer;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-link {
          display: block;
          text-align: center;
          margin-top: 25px;
          color: #a78bfa;
          text-decoration: none;
          font-size: 13px;
        }

        @media (max-width: 500px) {
          .reset-card {
            padding: 25px 19px;
          }
        }
      `}</style>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main style={{ background: "#090d18", color: "white", padding: 100 }}>
          Loading...
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
