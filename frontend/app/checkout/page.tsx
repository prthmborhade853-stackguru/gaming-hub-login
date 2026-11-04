
"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

const products = [
  { id: 1, name: "Wireless Gaming Controller", price: 2499, icon: "🎮" },
  { id: 2, name: "RGB Mechanical Keyboard", price: 1999, icon: "⌨️" },
  { id: 3, name: "Pro Gaming Headset", price: 1799, icon: "🎧" },
  { id: 4, name: "Precision Gaming Mouse", price: 999, icon: "🖱️" },
  { id: 5, name: "RGB Gaming Mousepad", price: 699, icon: "🟪" },
  { id: 6, name: "Pro Wireless Controller", price: 3299, icon: "🕹️" },
];

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Load cart from browser storage
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("gamingHubCart") || "[]"
      );

      if (Array.isArray(saved)) {
        setCart(
          saved.filter(
            (id) =>
              typeof id === "number" &&
              products.some((p) => p.id === id)
          )
        );
      }
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  // Calculate cart products and quantities
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

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
  }

  // Submit order to Express backend and MongoDB
  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty!");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5001/api";

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          customer: form,

          products: cartItems.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to place your order."
        );
      }

      if (!data.orderId) {
        throw new Error(
          "The server did not return an order ID."
        );
      }

      // Clear cart only after successful backend response
      localStorage.removeItem("gamingHubCart");

      setCart([]);
      setOrderId(data.orderId);
      setPlaced(true);

    } catch (error) {
      console.error("Checkout error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

    } finally {
      setSubmitting(false);
    }
  }

  // Loading screen
  if (!loaded) {
    return (
      <main className="checkout-page">
        <p>Loading checkout...</p>
      </main>
    );
  }

  // Order success screen
  if (placed) {
    return (
      <main className="checkout-page">
        <style jsx>{`
          .checkout-page {
            min-height: 100vh;
            background: #080b14;
            color: #f5f7ff;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 25px;
          }

          .success-card {
            width: 100%;
            max-width: 520px;
            padding: 45px 30px;
            text-align: center;
            background: #111725;
            border: 1px solid rgba(255,255,255,.1);
            border-radius: 20px;
          }

          .success-icon {
            font-size: 70px;
          }

          .success-card h1 {
            color: #38e8f5;
          }

          .success-card p {
            color: #9ba6bb;
            line-height: 1.8;
          }

          .order-number {
            color: #38e8f5;
            font-weight: bold;
            overflow-wrap: anywhere;
          }

          .success-card a {
            display: inline-block;
            margin-top: 20px;
            padding: 13px 22px;
            background: linear-gradient(90deg, #38e8f5, #9b78ff);
            color: #080b14;
            border-radius: 9px;
            text-decoration: none;
            font-weight: bold;
          }
        `}</style>

        <section className="success-card">
          <div className="success-icon">🎉</div>

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you for shopping with Gaming Hub.
            Your order has been saved successfully.
          </p>

          <p>
            Order ID:{" "}
            <span className="order-number">{orderId}</span>
          </p>

          <p>Payment Method: Cash on Delivery</p>

          <Link href="/">Continue Shopping</Link>
        </section>
      </main>
    );
  }

  // Empty cart screen
  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <style jsx>{`
          .checkout-page {
            min-height: 100vh;
            padding: 50px 7%;
            background: #080b14;
            color: #f5f7ff;
          }

          .empty-checkout {
            text-align: center;
            padding: 80px 20px;
            background: #111725;
            border-radius: 15px;
          }

          .empty-checkout p {
            color: #9ba6bb;
          }

          .empty-checkout a {
            display: inline-block;
            margin-top: 15px;
            color: #38e8f5;
          }
        `}</style>

        <div className="empty-checkout">
          <h1>Your Cart is Empty 🛒</h1>
          <p>Add products before proceeding to checkout.</p>
          <Link href="/products">Explore Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          padding: 35px 7% 60px;
          background: #080b14;
          color: #f5f7ff;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 45px;
          gap: 15px;
        }

        .brand {
          font-size: 23px;
          font-weight: 800;
          color: #f5f7ff;
          text-decoration: none;
        }

        .brand span {
          color: #38e8f5;
        }

        .brand-dot {
          color: #9b78ff !important;
        }

        .back-link {
          color: #38e8f5;
          text-decoration: none;
        }

        .eyebrow {
          color: #38e8f5;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        .page-title {
          font-size: clamp(30px, 5vw, 43px);
          margin: 15px 0;
        }

        .page-description {
          color: #9ba6bb;
          margin-bottom: 35px;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 30px;
          align-items: start;
        }

        .checkout-form,
        .order-summary {
          background: #111725;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          padding: 28px;
        }

        .checkout-form h2,
        .order-summary h2 {
          margin-top: 0;
          margin-bottom: 25px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          color: #cbd3e1;
          font-size: 13px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 13px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 8px;
          background: #080b14;
          color: white;
          outline: none;
          font: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #38e8f5;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 90px;
        }

        .payment-option {
          margin-top: 25px;
          padding: 16px;
          border: 1px solid #38e8f5;
          border-radius: 10px;
          background: rgba(56,232,245,.05);
        }

        .payment-option strong {
          color: #38e8f5;
        }

        .payment-option p {
          color: #9ba6bb;
          font-size: 13px;
          margin-bottom: 0;
        }

        .order-product {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin: 18px 0;
        }

        .product-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .product-icon {
          font-size: 27px;
        }

        .product-name small {
          display: block;
          color: #9ba6bb;
          margin-top: 5px;
        }

        .order-product strong {
          white-space: nowrap;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin: 18px 0;
          color: #9ba6bb;
        }

        .summary-total {
          border-top: 1px solid rgba(255,255,255,.15);
          padding-top: 20px;
          color: white;
          font-size: 18px;
        }

        .summary-total strong {
          color: #38e8f5;
        }

        .place-order-button {
          width: 100%;
          padding: 15px;
          margin-top: 20px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #38e8f5, #9b78ff);
          color: #080b14;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
        }

        .place-order-button:hover {
          opacity: .85;
        }

        .place-order-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .error-message {
          margin-top: 15px;
          padding: 12px;
          border: 1px solid #ff8299;
          border-radius: 8px;
          color: #ff9bad;
          background: rgba(255,130,153,.08);
          font-size: 13px;
          line-height: 1.5;
        }

        .secure-note {
          text-align: center;
          color: #9ba6bb;
          font-size: 12px;
          margin-top: 15px;
        }

        @media (max-width: 850px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 550px) {
          .checkout-page {
            padding: 25px 5%;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .full-width {
            grid-column: auto;
          }

          .checkout-form,
          .order-summary {
            padding: 20px;
          }
        }
      `}</style>

      <div className="topbar">
        <Link href="/" className="brand">
          <span>GAMING</span> HUB<span className="brand-dot">.</span>
        </Link>

        <Link href="/cart" className="back-link">
          ← Back to Cart
        </Link>
      </div>

      <section>
        <span className="eyebrow">GAMING HUB CHECKOUT</span>

        <h1 className="page-title">
          Complete Your Order<span className="brand-dot">.</span>
        </h1>

        <p className="page-description">
          Enter your delivery details and confirm your order.
        </p>
      </section>

      <form onSubmit={placeOrder} className="checkout-layout">

        <section className="checkout-form">
          <h2>📦 Delivery Information</h2>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit mobile number"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Delivery Address *</label>
              <textarea
                name="address"
                placeholder="House number, street, area..."
                value={form.address}
                onChange={handleChange}
                maxLength={500}
                required
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                placeholder="Enter your city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                placeholder="Enter your state"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>PIN Code *</label>
              <input
                type="text"
                name="pincode"
                placeholder="6-digit PIN code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={form.pincode}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="payment-option">
            <strong>💵 Cash on Delivery (COD)</strong>
            <p>
              Pay for your order when it arrives at your doorstep.
            </p>
          </div>
        </section>

        <aside className="order-summary">
          <h2>🛒 Order Summary</h2>

          {cartItems.map((product) => (
            <div className="order-product" key={product.id}>
              <div className="product-name">
                <span className="product-icon">
                  {product.icon}
                </span>

                <div>
                  <strong>{product.name}</strong>
                  <small>Quantity: {product.quantity}</small>
                </div>
              </div>

              <strong>
                ₹{(
                  product.price * product.quantity
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

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

          {errorMessage && (
            <div className="error-message" role="alert">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="place-order-button"
            disabled={submitting}
          >
            {submitting ? "Placing Order..." : "Place Order →"}
          </button>

          <p className="secure-note">
            🔒 Your order is submitted securely to the Gaming Hub backend.
          </p>
        </aside>

      </form>
    </main>
  );
}
