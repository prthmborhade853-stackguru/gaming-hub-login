
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/", icon: "🏠" },
  { name: "Products", href: "/products", icon: "🎮" },
  { name: "Wishlist", href: "/wishlist", icon: "❤️" },
  { name: "My Cart", href: "/cart", icon: "🛒" },
  { name: "My Orders", href: "/orders", icon: "📦" },
  { name: "My Profile", href: "/profile", icon: "👤" },
  { name: "About Us", href: "/about", icon: "ℹ️" },
  { name: "Contact Us", href: "/contact", icon: "📞" },
  { name: "Login", href: "/login", icon: "🔐" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className={`gaming-navbar ${mobileOpen ? "mobile-open" : ""}`}>
        <button
          className="nav-logo"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="nav-logo-icon">🎮</span>
          <span className="nav-logo-text">GAMING HUB</span>
        </button>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${
                pathname === item.href ? "active" : ""
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <style jsx global>{`
        .gaming-navbar {
          position: fixed;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          width: 68px;
          max-height: 90vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 14px 10px;
          background: rgba(12, 15, 35, 0.97);
          border: 1px solid #00d9ff;
          border-radius: 18px;
          box-shadow: 0 0 15px #00d9ff55;
          z-index: 9999;
          transition: width 0.35s ease, box-shadow 0.3s ease;
        }

        .gaming-navbar:hover,
        .gaming-navbar:focus-within,
        .gaming-navbar.mobile-open {
          width: 225px;
          box-shadow: 0 0 25px #00d9ff, 0 0 40px #8a2be255;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 10px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          white-space: nowrap;
        }

        .nav-logo-icon {
          min-width: 28px;
          font-size: 25px;
        }

        .nav-logo-text,
        .nav-label {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .nav-logo-text {
          color: #00eaff;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .gaming-navbar:hover .nav-logo-text,
        .gaming-navbar:focus-within .nav-logo-text,
        .gaming-navbar.mobile-open .nav-logo-text,
        .gaming-navbar:hover .nav-label,
        .gaming-navbar:focus-within .nav-label,
        .gaming-navbar.mobile-open .nav-label {
          opacity: 1;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 15px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 15px;
          min-height: 44px;
          padding: 10px;
          border-radius: 12px;
          color: #c9d5e8;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .nav-icon {
          min-width: 28px;
          text-align: center;
          font-size: 21px;
          transition: transform 0.3s ease;
        }

        .nav-label {
          font-size: 14px;
        }

        .nav-item:hover {
          color: white;
          background: #00d9ff25;
          transform: scale(1.06);
          box-shadow: 0 0 14px #00d9ff99;
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.2);
        }

        .nav-item.active {
          color: #00eaff;
          background: #00d9ff20;
          box-shadow: inset 0 0 10px #00d9ff44;
        }

        @media (max-width: 700px) {
          .gaming-navbar {
            top: 15px;
            left: 15px;
            transform: none;
            max-height: calc(100vh - 30px);
          }

          .gaming-navbar.mobile-open {
            width: 225px;
          }
        }
      `}</style>
    </>
  );
}
