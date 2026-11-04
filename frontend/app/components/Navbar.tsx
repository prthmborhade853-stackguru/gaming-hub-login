
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
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <span className={open ? "line line1 active" : "line line1"} />
        <span className={open ? "line line2 active" : "line line2"} />
        <span className={open ? "line line3 active" : "line line3"} />
      </button>

      <aside className={`gaming-navbar ${open ? "open" : ""}`}>
        <div className="nav-heading">
          <span>🎮</span>
          <strong>GAMING HUB</strong>
        </div>

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
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {open && (
        <button
          className="nav-overlay"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}

      <style jsx global>{`
        .menu-toggle {
          position: fixed;
          top: 20px;
          left: 20px;
          width: 52px;
          height: 52px;
          z-index: 10002;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px solid #00d9ff;
          border-radius: 13px;
          background: #10152d;
          cursor: pointer;
          box-shadow: 0 0 15px #00d9ff66;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .menu-toggle:hover {
          transform: scale(1.08);
          box-shadow: 0 0 22px #00d9ff;
        }

        .line {
          display: block;
          width: 24px;
          height: 2.5px;
          border-radius: 5px;
          background: #00eaff;
          transition: all 0.3s ease;
        }

        .line1.active {
          transform: translateY(8.5px) rotate(45deg);
        }

        .line2.active {
          opacity: 0;
        }

        .line3.active {
          transform: translateY(-8.5px) rotate(-45deg);
        }

        .gaming-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 270px;
          height: 100vh;
          padding: 90px 18px 25px;
          background: rgba(10, 14, 34, 0.98);
          border-right: 1px solid #00d9ff;
          box-shadow: 5px 0 30px #00d9ff33;
          z-index: 10000;
          overflow-y: auto;
          transform: translateX(-110%);
          transition: transform 0.4s ease;
        }

        .gaming-navbar.open {
          transform: translateX(0);
        }

        .nav-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          margin-bottom: 20px;
          color: #00eaff;
          font-size: 18px;
          letter-spacing: 1px;
        }

        .nav-heading span {
          font-size: 26px;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 13px;
          color: #d0d9ec;
          border: 1px solid transparent;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .nav-icon {
          font-size: 21px;
        }

        .nav-item:hover {
          color: white;
          background: #00d9ff20;
          border-color: #00d9ff;
          transform: scale(1.04);
          box-shadow: 0 0 14px #00d9ff88;
        }

        .nav-item.active {
          color: #00eaff;
          background: #00d9ff20;
          border-color: #00d9ff88;
        }

        .nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 9998;
          border: none;
          background: rgba(0, 0, 0, 0.35);
          cursor: pointer;
        }

        @media (max-width: 600px) {
          .gaming-navbar {
            width: min(270px, 82vw);
          }
        }
      `}</style>
    </>
  );
}
