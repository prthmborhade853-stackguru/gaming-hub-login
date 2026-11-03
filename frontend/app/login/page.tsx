
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
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed. Check your credentials.");
      }

      // Adjust these fields to match the response returned by your backend.
      const token = data.token || data.accessToken;

      if (token) {
        localStorage.setItem("gamingHubToken", token);
      }

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <Link href="/" className="brand login-brand">
        <span>GAMING</span> HUB<span className="brand-dot">.</span>
      </Link>

      <div className="login-layout">
        <section className="login-promo">
          <span className="eyebrow">WELCOME BACK, GAMER</span>
          <h1>YOUR NEXT<br />VICTORY <span>AWAITS.</span></h1>
          <p>Sign in to explore your gaming gear and get your setup ready for the next level.</p>
          <div className="login-promo-art">🎮</div>
          <div className="promo-caption">PLAY HARD. PLAY SMART.</div>
        </section>

        <section className="login-card">
          <div className="login-card-icon">✦</div>
          <span className="eyebrow">PLAYER ACCESS</span>
          <h2>Welcome back</h2>
          <p className="muted">Enter your details to sign in to your account.</p>

          <form onSubmit={handleLogin} className="login-form">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
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

            {error && <p className="form-error" role="alert">{error}</p>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="signup-note">
            New to Gaming Hub? <Link href="/register">Create an account</Link>
          </p>
          <Link href="/" className="back-link">← Back to Home</Link>
        </section>
      </div>
    </main>
  );
}
