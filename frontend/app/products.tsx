
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

const categories = [
  "All", "Controllers", "Keyboards",
  "Headsets", "Mice", "Accessories"
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  function addToCart(productId: number) {
    const existing = JSON.parse(
      localStorage.getItem("gamingHubCart") || "[]"
    );

    existing.push(productId);

    localStorage.setItem(
      "gamingHubCart",
      JSON.stringify(existing)
    );

    alert("Product added to cart successfully!");
  }

  return (
    <main className="products-page">

      <div className="page-topbar">
        <Link href="/" className="brand">
          <span>GAMING</span> HUB<span className="brand-dot">.</span>
        </Link>

        <div className="nav-actions">
          <Link href="/" className="back-link">← Home</Link>
          <Link href="/cart" className="cart-button">
            🛒 My Cart
          </Link>
        </div>
      </div>

      <section>
        <span className="eyebrow">GAMING HUB STORE</span>

        <h1 className="page-title">
          Explore Gaming Gear<span className="brand-dot">.</span>
        </h1>

        <p className="page-description">
          Discover premium gaming controllers, keyboards,
          headsets and accessories for your ultimate setup.
        </p>
      </section>

      <div className="page-category-list">
        {categories.map((item) => (
          <button
            key={item}
            className={`category-chip ${
              category === item ? "active" : ""
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <input
        className="page-search"
        type="search"
        placeholder="⌕ Search gaming products..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>

            <div className="product-art">
              <span className="product-tag">{product.tag}</span>
              <span className="product-emoji">{product.icon}</span>
              <span className="art-label">GAMING HUB</span>
            </div>

            <div className="product-info">
              <span className="product-category">
                {product.category}
              </span>

              <h3>{product.name}</h3>

              <div className="product-details">
                <strong className="product-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>

                <button
                  className="add-button"
                  onClick={() => addToCart(product.id)}
                >
                  + Add to Cart
                </button>
              </div>
            </div>

          </article>
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <p className="empty-state">
          No products found. Try another search.
        </p>
      )}

    </main>
  );
}
