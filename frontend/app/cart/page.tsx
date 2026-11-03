
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const products = [
  { id: 1, name: "Wireless Gaming Controller", category: "Controllers", price: 2499, icon: "🎮" },
  { id: 2, name: "RGB Mechanical Keyboard", category: "Keyboards", price: 1999, icon: "⌨️" },
  { id: 3, name: "Pro Gaming Headset", category: "Headsets", price: 1799, icon: "🎧" },
  { id: 4, name: "Precision Gaming Mouse", category: "Mice", price: 999, icon: "🖱️" },
  { id: 5, name: "RGB Gaming Mousepad", category: "Accessories", price: 699, icon: "🟪" },
  { id: 6, name: "Pro Wireless Controller", category: "Controllers", price: 3299, icon: "🕹️" },
];

export default function CartPage() {
  const [cart, setCart] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("gamingHubCart");

    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed.filter((id) => products.some((p) => p.id === id)));
        }
      } catch {
        setCart([]);
      }
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

  if (!loaded) {
    return (
      <main className="cart-page">
        <p className="page-description">Loading your cart...</p>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="page-topbar">
        <Link href="/" className="brand">
          <span>GAMING</span> HUB<span className="brand-dot">.</span>
        </Link>

        <Link href="/products" className="back-link">
          ← Continue Shopping
        </Link>
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
                <strong>{cart.length}</strong>
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
                onClick={() => alert("Checkout will be available in the next step!")}
              >
                Proceed to Checkout →
              </button>

              <Link
                href="/products"
                className="back-link"
              >
                Continue Shopping
              </Link>
            </aside>

          </div>
        )}

      </section>
    </main>
  );
}
