
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

  useEffect(() => {
    const stored = localStorage.getItem("gamingHubProfile");

    if (stored) {
      try {
        const parsed = { ...defaultProfile, ...JSON.parse(stored) };
        setProfile(parsed);
        setForm(parsed);
      } catch {
        console.error("Unable to load profile");
      }
    }
  }, []);

  const handleChange = (field: keyof Profile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    localStorage.setItem("gamingHubProfile", JSON.stringify(form));
    setProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cancelEdit = () => {
    setForm(profile);
    setEditing(false);
  };

  return (
    <main className="profile-page">
      <div className="profile-container">
        <Link href="/" className="back-link">← Back to Home</Link>

        <div className="profile-heading">
          <span className="heading-icon">👤</span>
          <h1>MY PROFILE</h1>
          <p>Manage your Gaming Hub account</p>
        </div>

        <section className="profile-card">
          <div className="profile-top">
            <div className="avatar">🎮</div>
            <div>
              <h2>{profile.name || "Gaming User"}</h2>
              <p>{profile.email || "No email added"}</p>
              <span className="member-tag">GAMING HUB MEMBER</span>
            </div>
          </div>

          <div className="section-title">
            <h3>Personal Information</h3>
            {!editing && (
              <button
                className="edit-button"
                onClick={() => setEditing(true)}
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
                ["address", "Address"],
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

        <div className="profile-shortcuts">
          <Link href="/orders">📦 My Orders</Link>
          <Link href="/wishlist">❤️ My Wishlist</Link>
          <Link href="/cart">🛒 My Cart</Link>
        </div>
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

        .profile-heading p {
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
          font-size: 45px;
          border-radius: 50%;
          background: #172c4d;
          border: 2px solid #00eaff;
          box-shadow: 0 0 20px #00d9ff66;
        }

        .profile-top h2 {
          margin: 0 0 8px;
          font-size: 23px;
        }

        .profile-top p {
          color: #9baac5;
          margin: 0 0 10px;
        }

        .member-tag {
          color: #00eaff;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin: 25px 0;
        }

        .section-title h3 {
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
          transform: scale(1.05);
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

        .success-message {
          color: #4ade80;
          margin-top: 18px;
        }

        .profile-shortcuts {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 22px;
        }

        .profile-shortcuts a {
          flex: 1;
          min-width: 150px;
          padding: 17px;
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

        @media (max-width: 600px) {
          .profile-page {
            padding: 35px 15px;
          }

          .profile-card {
            padding: 20px;
          }

          .profile-fields {
            grid-template-columns: 1fr;
          }

          .profile-top {
            align-items: flex-start;
          }

          .avatar {
            width: 70px;
            height: 70px;
            font-size: 35px;
            flex-shrink: 0;
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

