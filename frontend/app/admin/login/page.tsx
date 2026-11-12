
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your admin email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Admin login failed.");
      }

      if (!data.token || data.admin?.role !== "admin") {
        throw new Error("Invalid admin authentication response.");
      }

      localStorage.setItem("gamingHubAdminToken", data.token);
      localStorage.setItem(
        "gamingHubAdmin",
        JSON.stringify(data.admin)
      );

      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <section className="login-card">
        <Link href="/" className="back-link">
          ← Back to Gaming Hub
        </Link>

        <div className="brand-icon">🎮</div>

        <p className="eyebrow">GAMING HUB CONTROL CENTER</p>

        <h1>
          ADMIN <span>LOGIN</span>
        </h1>

        <p className="subtitle">
          Sign in to manage products, orders and customers.
        </p>

        <div className="admin-badge">
          <span className="status-dot" />
          Authorized Administrators Only
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-email">Admin Email</label>

          <input
            id="admin-email"
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>

          <div className="password-wrapper">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "AUTHENTICATING..." : "ENTER ADMIN PANEL →"}
          </button>
        </form>

        <div className="security-note">
          🔒 Secure administrator authentication
        </div>

        <p className="footer-text">
          Gaming Hub © {new Date().getFullYear()}
        </p>
      </section>

      <style jsx>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px 15px;
          position: relative;
          overflow: hidden;
          background: #070b18;
          color: white;
        }

        .background-glow {
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.25;
          pointer-events: none;
        }

        .glow-one {
          background: #00d9ff;
          top: -100px;
          left: -100px;
        }

        .glow-two {
          background: #8b5cf6;
          bottom: -100px;
          right: -100px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
          padding: 38px;
          border: 1px solid #00d9ff55;
          border-radius: 22px;
          background: linear-gradient(145deg, #131e36, #0c1225);
          box-shadow: 0 0 45px #00d9ff18;
        }

        .back-link {
          display: inline-block;
          color: #00eaff;
          text-decoration: none;
          font-size: 13px;
          margin-bottom: 25px;
        }

        .brand-icon {
          font-size: 52px;
          text-align: center;
          margin-bottom: 12px;
        }

        .eyebrow {
          text-align: center;
          color: #00eaff;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 3px;
        }

        h1 {
          text-align: center;
          font-size: 34px;
          font-weight: 900;
          margin: 12px 0;
        }

        h1 span {
          color: #00eaff;
          text-shadow: 0 0 15px #00d9ff66;
        }

        .subtitle {
          text-align: center;
          color: #aebbd2;
          font-size: 13px;
          line-height: 1.7;
          margin-bottom: 22px;
        }

        .admin-badge {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          padding: 11px;
          margin-bottom: 25px;
          background: #00d9ff12;
          border: 1px solid #00d9ff33;
          border-radius: 9px;
          color: #9deeff;
          font-size: 11px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 9px #4ade80;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        label {
          color: #d1dbea;
          font-size: 13px;
          margin-top: 5px;
        }

        input {
          width: 100%;
          padding: 14px;
          background: #080f21;
          color: white;
          border: 1px solid #34445f;
          border-radius: 9px;
          outline: none;
          font-size: 14px;
        }

        input:focus {
          border-color: #00eaff;
          box-shadow: 0 0 12px #00d9ff30;
        }

        input::placeholder {
          color: #718096;
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper input {
          padding-right: 55px;
        }

        .toggle-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }

        .login-button {
          margin-top: 15px;
          padding: 15px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #00d9ff, #8b5cf6);
          color: #07101e;
          font-weight: 900;
          letter-spacing: 1px;
          cursor: pointer;
          transition: 0.3s;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 0 22px #00d9ff66;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          padding: 12px;
          margin-bottom: 18px;
          background: #ef444418;
          border: 1px solid #ef4444;
          border-radius: 8px;
          color: #fca5a5;
          font-size: 13px;
        }

        .security-note {
          margin-top: 25px;
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
        }

        .footer-text {
          text-align: center;
          color: #64748b;
          font-size: 11px;
          margin: 25px 0 0;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 27px 20px;
          }

          h1 {
            font-size: 29px;
          }
        }
      `}</style>
    </main>
  );
}
