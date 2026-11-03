
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const products = [
  { id: 1, name: "Wireless Gaming Controller", category: "Controllers", price: 2499, icon: "🎮" },
  { id: 2, name: "RGB Mechanical Keyboard", category: "Keyboards", price: 1999, icon: "⌨️" },
  { id: 3, name: "Pro Gaming Headset", category: "Headsets", price: 1799, icon: "🎧" },
  { id: 4, name: "Precision Gaming Mouse", category: "Mice", price: 999, icon: "🖱️" },
  { id: 5, name: "RGB Gaming Mousepad", category: "Accessories", price: 699, icon: "🟪" },
  { id: 6, name: "Pro Wireless Controller", category: "Controllers", price: 3299, icon: "🕹️" },
];

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("gamingHubCart");

      if (savedCart) {
        const parsed = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          setCart(
            parsed.filter(
              (id) =>
                typeof id === "number" &&
                products.some((p) => p.id === id)
            )
          );
        }
      }
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  function updateCart(updatedCart: number[]) {
    setCart(updatedCart);
    localStorage.setItem(
      "gamingHubCart",
      JSON.stringify(updatedCart)
    );
  }

  function increaseQuantity(id: number) {
    updateCart([...cart, id]);
  }

  function decreaseQuantity(id: number) {
    const index = cart.indexOf(id);

    if (index !== -1) {
      const updated = [...cart];
      updated.splice(index, 1);
      updateCart(updated);
    }
  }

  function removeProduct(id: number) {
    updateCart(cart.filter((item) => item !== id));
  }

  function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
      updateCart([]);
    }
  }

  const cartItems = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        quantity: cart.filter((id) => id === product.id).length,
      }))
      .filter((product) => product.quantity > 0);
  }, [cart]);

  const total = cartItems.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const totalItems = cart.length;

  if (!loaded) {
    return (
      <main className="cart-page">
        <p>Loading your cart...</p>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <style jsx>{`
        .cart-page {
          min-height: 100vh;
          padding: 35px 7% 60px;
          background: #080b14;
          color: #f5f7ff;
        }

        .page-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 55px;
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

        .top-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .back-link {
          color: #38e8f5;
          text-decoration: none;
          padding: 10px 15px;
          border: 1px solid rgba(56,232,245,.5);
          border-radius: 9px;
        }

        .cart-container {
          max-width: 1150px;
          margin: auto;
        }

        .eyebrow {
          color: #38e8f5;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        .page-title {
          font-size: clamp(30px, 5vw, 45px);
          margin: 15px 0;
        }

        .page-description {
          color: #9ba6bb;
          line-height: 1.7;
          margin-bottom: 35px;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 30px;
          align-items: start;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .cart-item {
          display: flex;
          gap: 22px;
          padding: 20px;
          background: #111725;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 15px;
        }

        .cart-item-icon {
          min-width: 120px;
          height: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #171f30, #252044);
          border-radius: 12px;
          font-size: 55px;
        }

        .cart-item-info {
          flex: 1;
        }

        .cart-item-info p {
          color: #38e8f5;
          font-size: 12px;
          margin: 0 0 7px;
        }

        .cart-item-info h3 {
          margin: 0 0 10px;
          font-size: 18px;
        }

        .cart-item-price {
          color: #38e8f5;
          font-size: 19px;
          font-weight: bold;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 15px 0;
        }

        .quantity-controls button {
          width: 30px;
          height: 40px;
          background: transparent;
          border: 1px solid #38e8f5;
          border-radius: 7px;
          color: white;
          cursor: pointer;
          font-size: 18px;
        }

        .remove-button {
          background: transparent;
          border: none;
          color: #ff8299;
          cursor: pointer;
          padding: 5px 0;
        }

        .cart-summary {
          padding: 25px;
          background: #111725;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 15px;
          position: sticky;
          top: 20px;
        }

        .cart-summary h2 {
          margin-top: 0;
          margin-bottom: 25px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin: 18px 0;
          color: #9ba6bb;
        }

        .summary-row strong {
          color: #f5f7ff;
        }

        .summary-total {
          border-top: 1px solid rgba(255,255,255,.15);
          padding-top: 20px;
          font-size: 18px;
        }

        .summary-total strong {
          color: #38e8f5;
        }

        .checkout-button {
          width: 100%;
          padding: 15px;
          margin-top: 15px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #38e8f5, #9b78ff);
          color: #080b14;
          font-weight: bold;
          font-size: 15px;
          cursor: pointer;
        }

        .checkout-button:hover {
          opacity: .85;
        }

        .clear-button {
          width: 100%;
          margin-top: 12px;
          padding: 11px;
          border: 1px solid #ff8299;
          border-radius: 9px;
          background: transparent;
          color: #ff8299;
          cursor: pointer;
        }

        .empty-cart {
          text-align: center;
          padding: 70px 20px;
          background: #111725;
          border-radius: 18px;
        }

        .empty-cart-icon {
          font-size: 70px;
          margin-bottom: 15px;
        }

        .empty-cart p {
          color: #9ba6bb;
          margin-bottom: 25px;
        }

        .primary-button {
          display: inline-block;
          padding: 13px 22px;
          border-radius: 9px;
          background: linear-gradient(90deg, #38e8f5, #9b78ff);
          color: #080b14;
          text-decoration: none;
          font-weight: bold;
        }

        @media (max-width: 850px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }

          .cart-summary {
            position: static;
          }
        }

        @media (max-width: 500px) {
          .cart-page {
            padding: 25px 5%;
          }

          .cart-item {
            flex-direction: column;
          }

          .cart-item-icon {
            width: 100%;
          }

          .page-topbar {
            margin-bottom: 35px;
          }
        }
      `}</style>

      <div className="page-topbar">
        <Link href="/" className="brand">
          <span>GAMING</span> HUB<span className="brand-dot">.</span>
        </Link>

        <div className="top-actions">
          <Link href="/products" className="back-link">
            ← Continue Shopping
          </Link>

          <Link href="/wishlist" className="back-link">
            ❤️ Wishlist
          </Link>
        </div>
      </div>

      <section className="cart-container">

        <span className="eyebrow">YOUR GAMING COLLECTION</span>

        <h1 className="page-title">
          My Shopping Cart<span className="brand-dot">.</span>
        </h1>

        <p className="page-description">
          Review your selected gaming products.
        </p>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>

            <h2>Your Cart is Empty</h2>

            <p>
              Looks like you haven't added any gaming products yet.
            </p>

            <Link href="/products" className="primary-button">
              Explore Products ↗
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            <div className="cart-items">
              {cartItems.map((product) => (
                <article className="cart-item" key={product.id}>

                  <div className="cart-item-icon">
                    {product.icon}
                  </div>

                  <div className="cart-item-info">
                    <p>{product.category}</p>

                    <h3>{product.name}</h3>

                    <div className="cart-item-price">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>

                    <div className="quantity-controls">
                      <button
                        onClick={() => decreaseQuantity(product.id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <strong>{product.quantity}</strong>

                      <button
                        onClick={() => increaseQuantity(product.id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() => removeProduct(product.id)}
                    >
                      Remove Product
                    </button>
                  </div>

                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Total Items</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <strong>Free</strong>
              </div>

              <div className="summary-row summary-total">
                <span>Total Amount</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>

              <button
                className="checkout-button"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout →
              </button>

              <button
                className="clear-button"
                onClick={clearCart}
              >
                Clear Entire Cart
              </button>
            </aside>

          </div>
        )}

      </section>
    </main>
  );
}
