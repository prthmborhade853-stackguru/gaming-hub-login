
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const products = [
  { id: 1, name: "Wireless Gaming Controller", category: "Controllers", price: 2499, icon: "🎮", tag: "BESTSELLER" },
  { id: 2, name: "RGB Mechanical Keyboard", category: "Keyboards", price: 1999, icon: "⌨️", tag: "POPULAR" },
  { id: 3, name: "Pro Gaming Headset", category: "Headsets", price: 1799, icon: "🎧", tag: "NEW" },
  { id: 4, name: "Precision Gaming Mouse", category: "Mice", price: 999, icon: "🖱️", tag: "HOT" },
  { id: 5, name: "RGB Gaming Mousepad", category: "Accessories", price: 699, icon: "🟪", tag: "TRENDING" },
  { id: 6, name: "Pro Wireless Controller", category: "Controllers", price: 3299, icon: "🕹️", tag: "PRO" },
];

const categories = ["All", "Controllers", "Keyboards", "Headsets", "Mice", "Accessories"];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<number[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <main className="site">
      <header className="navbar">
        <Link href="/" className="brand">
          <span>GAMING</span> HUB<span className="brand-dot">.</span>
        </Link>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#products">Products</a>
        </nav>

        <div className="nav-actions">
          <Link href="/login" className="login-button">Login</Link>
          <button
            className="cart-button"
            onClick={() => alert(`Your cart contains ${cart.length} item(s).`)}
          >
            🛒 Cart ({cart.length})
          </button>
        </div>
      </header>

      <section id="home" className="hero">
        <div className="hero-copy">
          <span className="eyebrow">⚡ THE ULTIMATE GAMING STORE</span>
          <h1>
            LEVEL UP<br />
            YOUR <span>GAME.</span>
          </h1>
          <p>
            Discover powerful controllers, precision peripherals and
            next-level gaming accessories. Your next victory starts here.
          </p>
          <a href="#products" className="primary-button">Explore Gear ↗</a>

          <div className="hero-stats">
            <div><strong>50+</strong><small>Gaming products</small></div>
            <div><strong>Pro</strong><small>Gaming essentials</small></div>
            <div><strong>24/7</strong><small>Gaming mode</small></div>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-glow" />
          <span className="hero-controller">🎮</span>
          <span className="floating-chip chip-one">⚡ PERFORMANCE</span>
          <span className="floating-chip chip-two">✦ LEVEL UP</span>
          <div className="hero-art-caption">BUILT FOR THE NEXT LEVEL</div>
        </div>
      </section>

      <section id="categories" className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR EDGE</span>
            <h2>Shop by Category</h2>
          </div>
        </div>

        <div className="category-list">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => {
                setCategory(item);
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`category-chip ${category === item ? "active" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section id="products" className="section products-section">
        <div className="section-heading products-heading">
          <div>
            <span className="eyebrow">UPGRADE YOUR SETUP</span>
            <h2>Featured Products<span className="brand-dot">.</span></h2>
            <p className="muted">{filteredProducts.length} products available</p>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="⌕  Search gaming gear..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-art">
                <span className="product-tag">{product.tag}</span>
                <span className="product-emoji">{product.icon}</span>
                <span className="art-label">GAMING HUB</span>
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <div className="product-bottom">
                  <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                  <button
                    className="add-button"
                    onClick={() => setCart((current) => [...current, product.id])}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="empty-state">No products found. Try another search.</p>
        )}
      </section>

      <section className="cta-section">
        <span className="eyebrow">READY PLAYER ONE?</span>
        <h2>Your setup. Your rules.</h2>
        <p>Find your next favourite piece of gaming gear.</p>
        <Link href="/login" className="primary-button">Join Gaming Hub ↗</Link>
      </section>

      <footer className="footer">
        <Link href="/" className="brand"><span>GAMING</span> HUB.</Link>
        <p>© 2026 Gaming Hub · Built for gamers.</p>
        <Link href="/login">Sign in</Link>
      </footer>
    </main>
  );
}
