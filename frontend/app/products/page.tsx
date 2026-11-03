
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
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

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

  function addToWishlist(productId: number) {
    const wishlist: number[] = JSON.parse(
      localStorage.getItem("gamingHubWishlist") || "[]"
    );

    if (wishlist.includes(productId)) {
      alert("Product is already in your wishlist!");
      return;
    }

    wishlist.push(productId);

    localStorage.setItem(
      "gamingHubWishlist",
      JSON.stringify(wishlist)
    );

    alert("Product added to wishlist!");
  }

  return (
    <main className="products-page">

      <style jsx>{`
        .products-page {
          min-height: 100vh;
          padding: 35px 7%;
          background: #080b14;
          color: #f5f7ff;
        }

        .page-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 55px;
          gap: 15px;
        }

        .brand {
          color: #f5f7ff;
          font-size: 23px;
          font-weight: 800;
          text-decoration: none;
        }

        .brand span:first-child {
          color: #38e8f5;
        }

        .brand-dot {
          color: #9b78ff;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .back-link,
        .cart-button {
          color: #f5f7ff;
          text-decoration: none;
          padding: 10px 16px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 9px;
        }

        .cart-button {
          background: #171f30;
        }

        .eyebrow {
          color: #38e8f5;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        .page-title {
          font-size: clamp(32px, 5vw, 48px);
          margin: 15px 0;
        }

        .page-description {
          color: #9ba6bb;
          line-height: 1.7;
          max-width: 650px;
        }

        .page-category-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 35px 0 20px;
        }

        .category-chip {
          padding: 10px 18px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 30px;
          background: #111725;
          color: #f5f7ff;
          cursor: pointer;
          transition: .2s;
        }

        .category-chip:hover,
        .category-chip.active {
          background: #38e8f5;
          color: #080b14;
          border-color: #38e8f5;
        }

        .page-search {
          width: 100%;
          max-width: 500px;
          padding: 15px 18px;
          margin: 10px 0 35px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 10px;
          background: #111725;
          color: white;
          outline: none;
          font-size: 15px;
        }

        .page-search:focus {
          border-color: #38e8f5;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 25px;
        }

        .product-card {
          overflow: hidden;
          background: #111725;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 17px;
          transition: transform .25s, border-color .25s;
        }

        .product-card:hover {
          transform: translateY(-5px);
          border-color: #38e8f5;
        }

        .product-art {
          height: 210px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #171f30, #252044);
        }

        .product-tag {
          position: absolute;
          top: 15px;
          left: 15px;
          padding: 6px 10px;
          border-radius: 5px;
          background: #38e8f5;
          color: #080b14;
          font-size: 10px;
          font-weight: bold;
        }

        .product-emoji {
          font-size: 75px;
        }

        .art-label {
          position: absolute;
          bottom: 12px;
          right: 15px;
          color: rgba(255,255,255,.3);
          font-size: 10px;
          letter-spacing: 2px;
        }

        .product-info {
          padding: 20px;
        }

        .product-category {
          color: #38e8f5;
          font-size: 12px;
        }

        .product-info h3 {
          min-height: 45px;
          margin: 10px 0;
          font-size: 17px;
        }

        .product-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-top: 15px;
        }

        .product-price {
          font-size: 19px;
          white-space: nowrap;
        }

        .add-button {
          padding: 10px 13px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(90deg, #38e8f5, #9b78ff);
          color: #080b14;
          font-weight: bold;
          cursor: pointer;
        }

        .product-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 15px;
        }

        .view-button,
        .wishlist-button {
          padding: 11px 8px;
          border-radius: 8px;
          text-align: center;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
        }

        .view-button {
          color: #38e8f5;
          border: 1px solid #38e8f5;
          background: transparent;
        }

        .wishlist-button {
          color: #ff8299;
          border: 1px solid #ff8299;
          background: transparent;
        }

        .view-button:hover {
          background: #172e38;
        }

        .wishlist-button:hover {
          background: #30202c;
        }

        .empty-state {
          padding: 50px 15px;
          text-align: center;
          color: #9ba6bb;
          background: #111725;
          border-radius: 12px;
        }

        @media (max-width: 600px) {
          .products-page {
            padding: 25px 5%;
          }

          .page-topbar {
            flex-wrap: wrap;
            margin-bottom: 35px;
          }

          .brand {
            font-size: 20px;
          }

          .nav-actions {
            gap: 7px;
          }

          .back-link,
          .cart-button {
            padding: 8px 10px;
            font-size: 13px;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          }
        }
      `}</style>

      <div className="page-topbar">
        <Link href="/" className="brand">
          <span>GAMING</span> HUB<span className="brand-dot">.</span>
        </Link>

        <div className="nav-actions">
          <Link href="/" className="back-link">← Home</Link>
          <Link href="/wishlist" className="back-link">❤️ Wishlist</Link>
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

              <div className="product-actions">
                <Link
                  href={`/products/${product.id}`}
                  className="view-button"
                >
                  👁️ View Details
                </Link>

                <button
                  className="wishlist-button"
                  onClick={() => addToWishlist(product.id)}
                >
                  ❤️ Wishlist
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <p className="empty-state">
          No products found. Try another search or category.
        </p>
      )}

    </main>
  );
}
