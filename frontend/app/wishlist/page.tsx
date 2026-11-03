
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const products = [
  { id: "1", name: "Wireless Gaming Controller", category: "Controllers", price: 2499, icon: "🎮" },
  { id: "2", name: "RGB Mechanical Keyboard", category: "Keyboards", price: 1999, icon: "⌨️" },
  { id: "3", name: "Pro Gaming Headset", category: "Headsets", price: 1799, icon: "🎧" },
  { id: "4", name: "Precision Gaming Mouse", category: "Mice", price: 999, icon: "🖱️" },
  { id: "5", name: "RGB Gaming Mousepad", category: "Accessories", price: 699, icon: "🟪" },
  { id: "6", name: "Pro Wireless Controller", category: "Controllers", price: 3299, icon: "🕹️" },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("gamingHubWishlist") || "[]"
    );
    setWishlist(saved);
    setLoaded(true);
  }, []);

  function updateWishlist(updated: string[]) {
    setWishlist(updated);
    localStorage.setItem("gamingHubWishlist", JSON.stringify(updated));
  }

  function removeFromWishlist(id: string) {
    updateWishlist(wishlist.filter((item) => item !== id));
  }

  function addToCart(id: string) {
    const cart = JSON.parse(
      localStorage.getItem("gamingHubCart") || "[]"
    );
    cart.push(id);
    localStorage.setItem("gamingHubCart", JSON.stringify(cart));
    alert("Product added to cart!");
  }

  const savedProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  if (!loaded) return null;

  return (
    <main className="wishlist-page">
      <style jsx>{`
        .wishlist-page {
          min-height: 100vh;
          padding: 45px 7%;
          background: #080b14;
          color: #f5f7ff;
        }

        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 35px;
        }

        h1 {
          font-size: 34px;
          margin: 0 0 10px;
        }

        .subtitle {
          color: #9ba6bb;
        }

        .nav-links {
          display: flex;
          gap: 12px;
        }

        .nav-links a {
          color: #38e8f5;
          text-decoration: none;
          border: 1px solid #38e8f5;
          padding: 10px 15px;
          border-radius: 8px;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 22px;
        }

        .wishlist-card {
          background: #111725;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          padding: 20px;
        }

        .product-icon {
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 75px;
          background: #171f30;
          border-radius: 12px;
          margin-bottom: 18px;
        }

        .category {
          color: #38e8f5;
          font-size: 13px;
        }

        h3 {
          margin: 10px 0;
        }

        .price {
          color: #38e8f5;
          font-size: 21px;
          font-weight: bold;
          margin: 15px 0;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .actions button {
          flex: 1;
          padding: 11px 8px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }

        .add-button {
          background: linear-gradient(90deg, #38e8f5, #9b78ff);
          color: #080b14;
        }

        .remove-button {
          background: #30202c;
          color: #ff8299;
        }

        .empty {
          text-align: center;
          padding: 75px 20px;
          background: #111725;
          border-radius: 16px;
        }

        .empty-icon {
          font-size: 65px;
        }

        .empty a {
          display: inline-block;
          margin-top: 15px;
          padding: 12px 22px;
          background: #38e8f5;
          color: #080b14;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        }

        @media (max-width: 500px) {
          h1 {
            font-size: 27px;
          }

          .wishlist-page {
            padding: 30px 5%;
          }
        }
      `}</style>

      <header className="wishlist-header">
        <div>
          <h1>❤️ My Wishlist</h1>
          <p className="subtitle">
            Your favourite gaming gear in one place.
          </p>
        </div>

        <nav className="nav-links">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </header>

      {savedProducts.length === 0 ? (
        <section className="empty">
          <div className="empty-icon">💔</div>
          <h2>Your Wishlist is Empty</h2>
          <p className="subtitle">
            Save your favourite gaming products here.
          </p>
          <Link href="/products">Explore Products</Link>
        </section>
      ) : (
        <section className="wishlist-grid">
          {savedProducts.map((product) => (
            <article className="wishlist-card" key={product.id}>
              <div className="product-icon">{product.icon}</div>

              <span className="category">{product.category}</span>
              <h3>{product.name}</h3>

              <div className="price">
                ₹{product.price.toLocaleString("en-IN")}
              </div>

              <div className="actions">
                <button
                  className="add-button"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </button>

                <button
                  className="remove-button"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
