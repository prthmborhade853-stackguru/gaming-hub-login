
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside
        className={`gaming-navbar ${open ? "open" : ""}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <span>🎮</span>
        </button>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${
                pathname === item.href ? "active" : ""
              }`}
              onClick={() => setOpen(false)}
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
          width: 58px;
          height: 58px;
          padding: 6px;
          background: rgba(12, 15, 35, 0.97);
          border: 1px solid #00d9ff;
          border-radius: 50px;
          box-shadow: 0 0 15px #00d9ff88;
          z-index: 9999;
          overflow: hidden;
          transition: width 0.4s ease, height 0.4s ease,
            border-radius 0.4s ease, box-shadow 0.3s ease;
        }

        .gaming-navbar.open {
          width: 225px;
          height: min(550px, 85vh);
          border-radius: 18px;
          box-shadow: 0 0 25px #00d9ff, 0 0 45px #8a2be255;
        }

        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 50%;
          background: #101a35;
          color: white;
          cursor: pointer;
          font-size: 25px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .menu-toggle:hover {
          transform: scale(1.12);
          box-shadow: 0 0 18px #00d9ff;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 15px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-20px);
          transition: all 0.3s ease;
        }

        .gaming-navbar.open .nav-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 42px;
          padding: 9px;
          border-radius: 11px;
          color: #c9d5e8;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .nav-icon {
          min-width: 27px;
          text-align: center;
          font-size: 20px;
        }

        .nav-label {
          font-size: 14px;
        }

        .nav-item:hover {
          color: white;
          background: #00d9ff25;
          transform: scale(1.06);
          box-shadow: 0 0 12px #00d9ff99;
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
          }
        }
      `}</style>
    </>
  );
}
