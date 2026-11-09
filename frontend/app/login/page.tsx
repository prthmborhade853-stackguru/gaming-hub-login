
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Invalid email or password."
        );
      }

      const token = data.token || data.accessToken;

      if (!token) {
        throw new Error("Login response did not contain an authentication token.");
      }

      // Save JWT token
      localStorage.setItem("gamingHubToken", token);

      // Save basic user information
      if (data.user) {
        localStorage.setItem(
          "gamingHubUser",
          JSON.stringify(data.user)
        );
      }

      // Redirect after successful login
      router.push("/");
      router.refresh();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">

      <Link href="/" className="brand">
        <span>GAMING</span> HUB<span className="brand-dot">.</span>
      </Link>

      <div className="login-layout">

        <section className="login-promo">
          <span className="eyebrow">WELCOME BACK, GAMER</span>

          <h1>
            YOUR NEXT
            <br />
            VICTORY <span>AWAITS.</span>
          </h1>

          <p>
            Sign in to explore your gaming gear and get your
            setup ready for the next level.
          </p>

          <div className="login-promo-art">🎮</div>

          <div className="promo-caption">
            PLAY HARD. PLAY SMART.
          </div>
        </section>

        <section className="login-card">

          <div className="login-card-icon">✦</div>

          <span className="eyebrow">PLAYER ACCESS</span>

          <h2>Welcome back</h2>

          <p className="muted">
            Enter your details to sign in to your account.
          </p>

          <form onSubmit={handleLogin} className="login-form">

            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <div className="password-heading">
              <label htmlFor="password">Password</label>

              <Link href="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

          </form>

          <p className="signup-note">
            New to Gaming Hub?{" "}
            <Link href="/register">Create an account</Link>
          </p>

          <Link href="/" className="back-link">
            ← Back to Home
          </Link>

        </section>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          padding: 95px 6% 55px;
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

        .brand span:first-child {
          color: #a78bfa;
        }

        .brand-dot {
          color: #60a5fa;
        }

        .login-layout {
          max-width: 1100px;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 440px;
          gap: 65px;
          align-items: center;
        }

        .eyebrow {
          color: #a78bfa;
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        .login-promo h1 {
          font-size: clamp(38px, 5vw, 62px);
          line-height: 1.15;
          margin: 20px 0;
          font-weight: 900;
        }

        .login-promo h1 span {
          color: #a78bfa;
        }

        .login-promo > p {
          max-width: 450px;
          color: #94a3b8;
          line-height: 1.8;
          font-size: 15px;
        }

        .login-promo-art {
          margin-top: 35px;
          font-size: 100px;
          filter: drop-shadow(0 0 25px #8b5cf655);
        }

        .promo-caption {
          color: #64748b;
          letter-spacing: 4px;
          font-size: 11px;
          margin-top: 10px;
        }

        .login-card {
          padding: 38px;
          background: #111a2a;
          border: 1px solid #29364c;
          border-radius: 20px;
          box-shadow: 0 20px 60px #00000033;
        }

        .login-card-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #30205a;
          color: #c4b5fd;
          font-size: 26px;
          margin-bottom: 22px;
        }

        .login-card h2 {
          font-size: 29px;
          margin: 12px 0 8px;
        }

        .muted {
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 30px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .login-form label {
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 600;
        }

        .login-form input {
          width: 100%;
          padding: 14px;
          background: #0b1220;
          border: 1px solid #334155;
          border-radius: 9px;
          outline: none;
          color: white;
          font-size: 14px;
        }

        .login-form input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 2px #8b5cf622;
        }

        .password-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        .password-heading a {
          color: #a78bfa;
          font-size: 12px;
          text-decoration: none;
        }

        .password-field {
          position: relative;
        }

        .password-field input {
          padding-right: 65px;
        }

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

        .form-error {
          padding: 11px;
          border-radius: 8px;
          background: #3b1724;
          color: #fda4af;
          font-size: 12px;
          line-height: 1.5;
        }

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

        .submit-button:hover {
          opacity: 0.88;
          transform: translateY(-2px);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .signup-note {
          text-align: center;
          margin-top: 27px;
          color: #94a3b8;
          font-size: 13px;
        }

        .signup-note a,
        .back-link {
          color: #a78bfa;
          text-decoration: none;
          font-weight: 600;
        }

        .back-link {
          display: block;
          text-align: center;
          margin-top: 22px;
          font-size: 13px;
        }

        @media (max-width: 850px) {
          .login-layout {
            grid-template-columns: 1fr;
            max-width: 500px;
            gap: 35px;
          }

          .login-promo {
            text-align: center;
          }

          .login-promo > p {
            margin: auto;
          }

          .login-promo-art {
            font-size: 65px;
          }
        }

        @media (max-width: 500px) {
          .login-page {
            padding: 85px 16px 40px;
          }

          .login-card {
            padding: 25px 20px;
          }
        }
      `}</style>

    </main>
  );
}
