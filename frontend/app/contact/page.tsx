
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Temporary local confirmation.
    // Backend integration will be added separately.
    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="contact-page">
      <div className="contact-container">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>

        <header className="contact-heading">
          <span className="heading-icon">📞</span>
          <p className="eyebrow">WE ARE HERE TO HELP</p>
          <h1>CONTACT <span>US</span></h1>
          <p>
            Have questions about Gaming Hub? Send us a message.
            We would love to hear from you!
          </p>
        </header>

        <section className="contact-layout">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p className="info-description">
              Contact our team for product enquiries, order assistance
              or general support.
            </p>

            <div className="info-item">
              <span>📧</span>
              <div>
                <h3>Email</h3>
                <p>support@gaminghub.com</p>
              </div>
            </div>

            <div className="info-item">
              <span>📞</span>
              <div>
                <h3>Phone</h3>
                <p>+91 XXXXX XXXXX</p>
              </div>
            </div>

            <div className="info-item">
              <span>📍</span>
              <div>
                <h3>Location</h3>
                <p>India</p>
              </div>
            </div>

            <div className="info-item">
              <span>⏰</span>
              <div>
                <h3>Support Hours</h3>
                <p>Monday – Saturday</p>
              </div>
            </div>

            <div className="social-section">
              <h3>Gaming Hub Support</h3>
              <p>We are always ready to assist gaming enthusiasts.</p>
            </div>
          </div>

          <div className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p>Fill in the details below.</p>

            {submitted && (
              <div className="success-message">
                ✓ Message submitted successfully!
                <br />
                <small>
                  This is a demo confirmation. Backend submission is not
                  connected yet.
                </small>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <label>Subject</label>
              <input
                type="text"
                placeholder="Enter subject"
                required
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              />

              <label>Your Message</label>
              <textarea
                placeholder="Write your message here..."
                rows={5}
                required
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />

              <button type="submit">
                Send Message →
              </button>
            </form>
          </div>
        </section>
      </div>

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          padding: 45px 25px;
          background: #080d1c;
          color: white;
        }

        .contact-container {
          max-width: 1100px;
          margin: auto;
        }

        .back-link {
          color: #00eaff;
          text-decoration: none;
        }

        .contact-heading {
          text-align: center;
          margin: 35px 0 55px;
        }

        .heading-icon {
          font-size: 48px;
        }

        .eyebrow {
          color: #00eaff;
          letter-spacing: 3px;
          font-size: 12px;
          font-weight: bold;
        }

        .contact-heading h1 {
          font-size: clamp(32px, 5vw, 48px);
          margin: 12px 0;
        }

        .contact-heading h1 span {
          color: #00eaff;
          text-shadow: 0 0 18px #00d9ff88;
        }

        .contact-heading > p:last-child {
          color: #aebbd2;
          line-height: 1.7;
        }

        .contact-layout {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 25px;
          align-items: stretch;
        }

        .contact-info,
        .contact-form-card {
          padding: 30px;
          border: 1px solid #00d9ff55;
          border-radius: 20px;
          background: #111a30;
          box-shadow: 0 0 25px #00d9ff12;
        }

        .contact-info h2,
        .contact-form-card h2 {
          color: #00eaff;
          margin-top: 0;
        }

        .info-description,
        .contact-form-card > p {
          color: #aebbd2;
          line-height: 1.7;
          font-size: 14px;
          margin-bottom: 25px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }

        .info-item > span {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: #00d9ff18;
          font-size: 23px;
        }

        .info-item h3 {
          margin: 0 0 6px;
          font-size: 15px;
          color: #00eaff;
        }

        .info-item p {
          margin: 0;
          color: #c0cce0;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .social-section {
          border-top: 1px solid #ffffff20;
          padding-top: 20px;
          margin-top: 30px;
        }

        .social-section h3 {
          color: #a78bfa;
        }

        .social-section p {
          color: #aebbd2;
          font-size: 13px;
        }

        .contact-form-card form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-form-card label {
          color: #cbd5e1;
          font-size: 13px;
          margin-top: 5px;
        }

        .contact-form-card input,
        .contact-form-card textarea {
          width: 100%;
          padding: 13px;
          color: white;
          background: #0a1328;
          border: 1px solid #34445f;
          border-radius: 9px;
          font: inherit;
          font-size: 14px;
          resize: vertical;
        }

        .contact-form-card input:focus,
        .contact-form-card textarea:focus {
          outline: none;
          border-color: #00eaff;
          box-shadow: 0 0 12px #00d9ff44;
        }

        .contact-form-card button {
          margin-top: 12px;
          padding: 14px;
          color: #07101e;
          background: linear-gradient(90deg, #00d9ff, #8b5cf6);
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        .contact-form-card button:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px #00d9ff88;
        }

        .success-message {
          padding: 14px;
          margin-bottom: 18px;
          border: 1px solid #4ade80;
          border-radius: 9px;
          color: #4ade80;
          background: #4ade8015;
          line-height: 1.7;
        }

        @media (max-width: 750px) {
          .contact-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 500px) {
          .contact-page {
            padding: 30px 15px;
          }

          .contact-info,
          .contact-form-card {
            padding: 22px;
          }
        }
      `}</style>
    </main>
  );
}
