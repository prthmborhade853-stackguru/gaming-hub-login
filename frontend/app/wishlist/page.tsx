
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  icon: string;
};

const products: Product[] = [
  { id: 1, name: "Wireless Gaming Controller", category: "Controllers", price: 2499, icon: "🎮" },
  { id: 2, name: "RGB Mechanical Keyboard", category: "Keyboards", price: 1999, icon: "⌨️" },
  { id: 3, name: "Pro Gaming Headset", category: "Headsets", price: 1799, icon: "🎧" },
  { id: 4, name: "Precision Gaming Mouse", category: "Mice", price: 999, icon: "🖱️" },
  { id: 5, name: "RGB Gaming Mousepad", category: "Accessories", price: 699, icon: "🟪" },
  { id: 6, name: "Pro Wireless Controller", category: "Controllers", price: 3299, icon: "🕹️" },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("gamingHubWishlist") || "[]"
      );

      if (Array.isArray(saved)) {
        setWishlist(
          saved
            .map(Number)
            .filter((id: number) =>
              products.some((product) => product.id === id)
            )
        );
      }
    } catch {
      setWishlist([]);
    }

    setLoaded(true);
  }, []);

  function updateWishlist(updated: number[]) {
    setWishlist(updated);
    localStorage.setItem(
      "gamingHubWishlist",
      JSON.stringify(updated)
    );
  }

  function removeFromWishlist(id: number) {
    updateWishlist(wishlist.filter((item) => item !== id));
    setMessage("Product removed from your Wishlist.");
  }

  function addToCart(id: number) {
    try {
      const cart = JSON.parse(
        localStorage.getItem("gamingHubCart") || "[]"
      );

      if (!Array.isArray(cart)) {
        throw new Error("Invalid cart data");
      }

      cart.push(id);

      localStorage.setItem(
        "gamingHubCart",
        JSON.stringify(cart)
      );

      setMessage("✓ Product added to Cart successfully!");
    } catch {
      setMessage("Unable to add product to Cart.");
    }
  }

  function clearWishlist() {
    updateWishlist([]);
    setMessage("Your Wishlist has been cleared.");
  }

  const savedProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  const totalValue = savedProducts.reduce(
    (total, product) => total + product.price,
    0
  );

  if (!loaded) {
    return (
      <main className="loading">
        Loading your Wishlist...
        <style jsx>{`
          .loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #080b14;
            color: #38e8f5;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-container">

        <header className="wishlist-header">
          <div>
            <span className="eyebrow">GAMING HUB COLLECTION</span>
            <h1>❤️ My Wishlist</h1>
            <p className="subtitle">
              Your favourite gaming gear, all in one place.
            </p>
          </div>

          <nav className="nav-links">
            <Link href="/products">Products</Link>
            <Link href="/cart">🛒 Cart</Link>
          </nav>
        </header>

        {message && (
          <div className="notice">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {savedProducts.length === 0 ? (
          <section className="empty">
            <div className="empty-icon">💔</div>
            <h2>Your Wishlist is Empty</h2>
            <p className="subtitle">
              You haven't saved any favourite products yet.
            </p>
            <Link href="/products" className="shop-button">
              Explore Products →
            </Link>
          </section>
        ) : (
          <>
            <div className="wishlist-summary">
              <div>
                <strong>{savedProducts.length}</strong>
                <span>
                  {savedProducts.length === 1
                    ? " Saved Product"
                    : " Saved Products"}
                </span>
              </div>

              <div>
                <strong>
                  ₹{totalValue.toLocaleString("en-IN")}
                </strong>
                <span> Total Wishlist Value</span>
              </div>

              <button
                className="clear-button"
                onClick={clearWishlist}
              >
                Clear Wishlist
              </button>
            </div>

            <section className="wishlist-grid">
              {savedProducts.map((product) => (
                <article className="wishlist-card" key={product.id}>
                  <div className="product-icon">
                    {product.icon}
                    <span className="heart">♥</span>
                  </div>

                  <span className="category">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>

                  <div className="price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>

                  <div className="actions">
                    <button
                      className="add-button"
                      onClick={() => addToCart(product.id)}
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      className="remove-button"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label={`Remove ${product.name}`}
                    >
                      ♥ Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        <footer>
          Gaming Hub – Your Ultimate Gaming Destination 🎮
        </footer>
      </div>

      <style jsx>{`
        .wishlist-page {
          min-height: 100vh;
          padding: 45px 7%;
          background: #080b14;
          color: #f5f7ff;
        }

        .wishlist-container {
          max-width: 1200px;
          margin: auto;
        }

        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 35px;
        }

        .eyebrow {
          color: #38e8f5;
          font-size: 11px;
          letter-spacing: 2px;
        }

        h1 {
          font-size: 34px;
          margin: 10px 0;
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

        .notice {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 13px 16px;
          margin-bottom: 22px;
          background: #102b36;
          border: 1px solid #38e8f5;
          border-radius: 9px;
          color: #38e8f5;
        }

        .notice button {
          border: none;
          background: transparent;
          color: white;
          font-size: 22px;
          cursor: pointer;
        }

        .wishlist-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding: 20px;
          margin-bottom: 25px;
          background: #111725;
          border: 1px solid #ffffff15;
          border-radius: 13px;
        }

        .wishlist-summary div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .wishlist-summary strong {
          color: #38e8f5;
          font-size: 21px;
        }

        .wishlist-summary span {
          color: #9ba6bb;
          font-size: 13px;
        }

        .clear-button {
          background: #30202c;
          color: #ff8299;
          border: 1px solid #ff829955;
          padding: 11px 15px;
          border-radius: 8px;
          cursor: pointer;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(230px, 1fr)
          );
          gap: 22px;
        }

        .wishlist-card {
          background: #111725;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          padding: 20px;
          transition: 0.3s;
        }

        .wishlist-card:hover {
          transform: translateY(-5px);
          border-color: #38e8f5;
          box-shadow: 0 0 20px #38e8f522;
        }

        .product-icon {
          height: 150px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 75px;
          background: #171f30;
          border-radius: 12px;
          margin-bottom: 18px;
        }

        .heart {
          position: absolute;
          top: 12px;
          right: 15px;
          color: #ff6485;
          font-size: 23px;
        }

        .category {
          color: #38e8f5;
          font-size: 13px;
        }

        h3 {
          min-height: 45px;
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

        .empty h2 {
          color: #38e8f5;
        }

        .shop-button {
          display: inline-block;
          margin-top: 15px;
          padding: 12px 22px;
          background: #38e8f5;
          color: #080b14;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        }

        footer {
          text-align: center;
          color: #718096;
          font-size: 12px;
          margin-top: 40px;
        }

        @media (max-width: 500px) {
          h1 {
            font-size: 27px;
          }

          .wishlist-page {
            padding: 30px 5%;
          }

          .wishlist-summary {
            align-items: flex-start;
          }

          .clear-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
