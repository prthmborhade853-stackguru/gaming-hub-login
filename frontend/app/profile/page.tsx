
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const defaultProfile: Profile = {
  name: "Gaming User",
  email: "",
  phone: "",
  address: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [form, setForm] = useState<Profile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("gamingHubProfile");
      const storedUser = localStorage.getItem("gamingHubUser");

      let user: Partial<Profile> = {};
      let savedProfile: Partial<Profile> = {};

      if (storedUser) {
        user = JSON.parse(storedUser);
      }

      if (storedProfile) {
        savedProfile = JSON.parse(storedProfile);
      }

      const loaded: Profile = {
        name: savedProfile.name || user.name || defaultProfile.name,
        email: savedProfile.email || user.email || "",
        phone: savedProfile.phone || "",
        address: savedProfile.address || "",
      };

      setProfile(loaded);
      setForm(loaded);
    } catch {
      console.error("Unable to load profile");
    }
  }, []);

  const initials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("") || "GH";

  const handleChange = (field: keyof Profile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const saveProfile = () => {
    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (
      form.phone &&
      !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))
    ) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    const updated: Profile = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    localStorage.setItem("gamingHubProfile", JSON.stringify(updated));

    setProfile(updated);
    setForm(updated);
    setEditing(false);
    setSaved(true);
    setError("");

    setTimeout(() => setSaved(false), 2500);
  };

  const cancelEdit = () => {
    setForm(profile);
    setEditing(false);
    setError("");
  };

  const completionFields = [
    profile.name,
    profile.email,
    profile.phone,
    profile.address,
  ];

  const completion =
    Math.round(
      (completionFields.filter((value) => value.trim()).length / 4) * 100
    );

  return (
    <main className="profile-page">
      <div className="profile-container">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>

        <header className="profile-heading">
          <span className="heading-icon">👤</span>
          <h1>MY PROFILE</h1>
          <p>Manage your Gaming Hub account</p>
        </header>

        <section className="profile-card">
          <div className="profile-top">
            <div className="avatar">
              {initials(profile.name)}
            </div>

            <div className="user-info">
              <h2>{profile.name || "Gaming User"}</h2>
              <p>{profile.email || "No email added"}</p>
              <span className="member-tag">
                🎮 GAMING HUB MEMBER
              </span>
            </div>
          </div>

          <div className="completion">
            <div className="completion-heading">
              <span>Profile Completion</span>
              <strong>{completion}%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="section-title">
            <h3>Personal Information</h3>

            {!editing && (
              <button
                className="edit-button"
                onClick={() => {
                  setEditing(true);
                  setSaved(false);
                }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <div className="profile-fields">
            {(
              [
                ["name", "Full Name"],
                ["email", "Email Address"],
                ["phone", "Phone Number"],
                ["address", "Delivery Address"],
              ] as [keyof Profile, string][]
            ).map(([field, label]) => (
              <div className="field" key={field}>
                <label>{label}</label>

                {editing ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={form[field]}
                    onChange={(e) =>
                      handleChange(field, e.target.value)
                    }
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                ) : (
                  <div className="field-value">
                    {profile[field] || "Not provided"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && <p className="error-message">{error}</p>}

          {editing && (
            <div className="actions">
              <button className="save-button" onClick={saveProfile}>
                Save Changes
              </button>

              <button className="cancel-button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          )}

          {saved && (
            <p className="success-message">
              ✓ Profile saved successfully!
            </p>
          )}
        </section>

        <section className="account-section">
          <h3>My Account</h3>

          <div className="profile-shortcuts">
            <Link href="/orders">
              <span>📦</span>
              <strong>My Orders</strong>
              <small>Track your purchases</small>
            </Link>

            <Link href="/wishlist">
              <span>❤️</span>
              <strong>My Wishlist</strong>
              <small>Your favourite products</small>
            </Link>

            <Link href="/cart">
              <span>🛒</span>
              <strong>My Cart</strong>
              <small>View your cart items</small>
            </Link>
          </div>
        </section>

        <p className="footer-note">
          Gaming Hub – Your Ultimate Gaming Destination 🎮
        </p>
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          padding: 45px 25px;
          background: #080d1c;
          color: white;
        }

        .profile-container {
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
        }

        .back-link {
          color: #00eaff;
          text-decoration: none;
        }

        .profile-heading {
          text-align: center;
          margin: 35px 0;
        }

        .heading-icon {
          font-size: 42px;
        }

        .profile-heading h1 {
          color: #00eaff;
          font-size: 34px;
          letter-spacing: 3px;
          margin: 10px 0;
        }

        .profile-heading p,
        .profile-top p {
          color: #9baac5;
        }

        .profile-card {
          padding: 30px;
          border: 1px solid #00d9ff55;
          border-radius: 20px;
          background: #111a30;
          box-shadow: 0 0 25px #00d9ff15;
        }

        .profile-top {
          display: flex;
          align-items: center;
          gap: 22px;
          padding-bottom: 25px;
          border-bottom: 1px solid #ffffff20;
        }

        .avatar {
          width: 95px;
          height: 95px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          font-size: 30px;
          font-weight: bold;
          border-radius: 50%;
          background: #172c4d;
          border: 2px solid #00eaff;
          color: #00eaff;
          box-shadow: 0 0 20px #00d9ff66;
        }

        .profile-top h2 {
          margin: 0 0 8px;
          font-size: 23px;
        }

        .profile-top p {
          margin: 0 0 10px;
          overflow-wrap: anywhere;
        }

        .member-tag {
          color: #00eaff;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .completion {
          margin-top: 25px;
        }

        .completion-heading {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #b8c7dc;
          font-size: 13px;
        }

        .completion-heading strong {
          color: #00eaff;
        }

        .progress-track {
          height: 8px;
          background: #26354c;
          border-radius: 20px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d9ff, #8b5cf6);
          border-radius: 20px;
          transition: width 0.3s;
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin: 28px 0 22px;
        }

        .section-title h3,
        .account-section h3 {
          color: #00eaff;
          margin: 0;
        }

        .edit-button,
        .save-button,
        .cancel-button {
          padding: 10px 17px;
          border-radius: 9px;
          cursor: pointer;
          transition: 0.3s;
          font-weight: bold;
        }

        .edit-button,
        .save-button {
          background: #00d9ff;
          color: #07101e;
          border: none;
        }

        .edit-button:hover,
        .save-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 15px #00d9ff;
        }

        .profile-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .field label {
          display: block;
          color: #9baac5;
          font-size: 13px;
          margin-bottom: 9px;
        }

        .field-value,
        .field input {
          width: 100%;
          min-height: 44px;
          padding: 12px;
          border: 1px solid #33445e;
          border-radius: 9px;
          background: #0b1427;
          color: white;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .field input:focus {
          outline: none;
          border-color: #00eaff;
          box-shadow: 0 0 10px #00d9ff55;
        }

        .actions {
          display: flex;
          gap: 12px;
          margin-top: 25px;
        }

        .cancel-button {
          background: transparent;
          color: white;
          border: 1px solid #718096;
        }

        .error-message {
          color: #fb7185;
          margin-top: 18px;
        }

        .success-message {
          color: #4ade80;
          margin-top: 18px;
        }

        .account-section {
          margin-top: 30px;
        }

        .account-section h3 {
          margin-bottom: 15px;
        }

        .profile-shortcuts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .profile-shortcuts a {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 20px 15px;
          text-align: center;
          border: 1px solid #00d9ff55;
          border-radius: 12px;
          color: #00eaff;
          text-decoration: none;
          background: #111a30;
          transition: 0.3s;
        }

        .profile-shortcuts a:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 15px #00d9ff66;
        }

        .profile-shortcuts a span {
          font-size: 25px;
        }

        .profile-shortcuts small {
          color: #9baac5;
        }

        .footer-note {
          text-align: center;
          color: #718096;
          font-size: 12px;
          margin-top: 30px;
        }

        @media (max-width: 600px) {
          .profile-page {
            padding: 35px 15px;
          }

          .profile-card {
            padding: 20px;
          }

          .profile-fields,
          .profile-shortcuts {
            grid-template-columns: 1fr;
          }

          .profile-top {
            align-items: flex-start;
          }

          .avatar {
            width: 70px;
            height: 70px;
            font-size: 24px;
          }

          .section-title {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
