
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  icon: string;
  description: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Wireless Gaming Controller",
    category: "Controllers",
    price: 2499,
    icon: "🎮",
    description: "Smooth and responsive gaming experience."
  },
  {
    id: 2,
    name: "RGB Mechanical Keyboard",
    category: "Keyboards",
    price: 1999,
    icon: "⌨️",
    description: "Mechanical keys with RGB lighting."
  },
  {
    id: 3,
    name: "Pro Gaming Headset",
    category: "Headsets",
    price: 1799,
    icon: "🎧",
    description: "Immersive gaming audio."
  },
  {
    id: 4,
    name: "Precision Gaming Mouse",
    category: "Mice",
    price: 999,
    icon: "🖱️",
    description: "Precise tracking and comfortable control."
  },
  {
    id: 5,
    name: "RGB Gaming Mousepad",
    category: "Accessories",
    price: 699,
    icon: "🟪",
    description: "Smooth surface with RGB lighting."
  },
  {
    id: 6,
    name: "Pro Wireless Controller",
    category: "Controllers",
    price: 3299,
    icon: "🕹️",
    description: "Advanced wireless gaming experience."
  }
];

type CartItem = {
  product: Product;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();

  const [cartIds, setCartIds] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("gamingHubCart") || "[]"
      );

      if (Array.isArray(savedCart)) {
        setCartIds(
          savedCart.filter(
            (id): id is number =>
              typeof id === "number" &&
              products.some((product) => product.id === id)
          )
        );
      }
    } catch {
      setCartIds([]);
    }

    setLoaded(true);
  }, []);

  const cartItems: CartItem[] = useMemo(() => {
    return products
      .map((product) => {
        const quantity = cartIds.filter((id) => id === product.id).length;

        return { product, quantity };
      })
      .filter((item) => item.quantity > 0);
  }, [cartIds]);

  const totalQuantity = cartIds.length;

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 3000 ? 0 : 99;
  const total = subtotal + shipping;

  function saveCart(updatedCart: number[]) {
    setCartIds(updatedCart);
    localStorage.setItem("gamingHubCart", JSON.stringify(updatedCart));
  }

  function increaseQuantity(id: number) {
    saveCart([...cartIds, id]);
    setMessage("Quantity updated.");
  }

  function decreaseQuantity(id: number) {
    const index = cartIds.indexOf(id);

    if (index !== -1) {
      const updatedCart = [...cartIds];
      updatedCart.splice(index, 1);
      saveCart(updatedCart);
      setMessage("Quantity updated.");
    }
  }

  function removeProduct(id: number) {
    saveCart(cartIds.filter((item) => item !== id));
    setMessage("Product removed from cart.");
  }

  function clearCart() {
    saveCart([]);
    setMessage("Your cart has been cleared.");
  }

  if (!loaded) {
    return (
      <main className="cart-page">
        <p>Loading your cart...</p>
        <style jsx>{`
          .cart-page {
            min-height: 100vh;
            padding: 120px 20px;
            background: #090d18;
            color: white;
            text-align: center;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-header">
        <span className="eyebrow">YOUR GAMING SELECTION</span>
        <h1>Shopping Cart 🛒</h1>
        <p>Review your products before checking out.</p>
      </section>

      {message && (
        <div className="message" role="status">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <section className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>You haven't added any gaming products yet.</p>
          <button onClick={() => router.push("/products")}>
            Explore Products
          </button>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-list">
            <div className="list-heading">
              <h2>Your Items ({totalQuantity})</h2>
              <button className="clear-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>

            {cartItems.map(({ product, quantity }) => (
              <article className="cart-item" key={product.id}>
                <div
                  className="product-icon"
                  onClick={() => router.push(`/products/${product.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      router.push(`/products/${product.id}`);
                    }
                  }}
                >
                  {product.icon}
                </div>

                <div className="product-details">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <strong>
                    ₹{product.price.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() => decreaseQuantity(product.id)}
                      aria-label={`Decrease ${product.name} quantity`}
                    >
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      onClick={() => increaseQuantity(product.id)}
                      aria-label={`Increase ${product.name} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <strong className="item-total">
                    ₹{(product.price * quantity).toLocaleString("en-IN")}
                  </strong>

                  <button
                    className="remove-btn"
                    onClick={() => removeProduct(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}

            <button
              className="continue-btn"
              onClick={() => router.push("/products")}
            >
              ← Continue Shopping
            </button>
          </div>

          <aside className="summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items ({totalQuantity})</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <strong>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping.toLocaleString("en-IN")}`}
              </strong>
            </div>

            <p className="shipping-note">
              {subtotal >= 3000
                ? "You've unlocked free shipping!"
                : `Add ₹${(3000 - subtotal).toLocaleString("en-IN")} more for free shipping.`}
            </p>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout →
            </button>

            <p className="payment-note">
              🔒 Secure checkout · Cash on Delivery
            </p>
          </aside>
        </section>
      )}

      <style jsx>{`
        .cart-page {
          min-height: 100vh;
          padding: 90px 6% 65px;
          background: #090d18;
          color: #f8fafc;
        }

        .cart-header {
          margin-bottom: 35px;
        }

        .eyebrow {
          color: #a78bfa;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        .cart-header h1 {
          font-size: clamp(32px, 5vw, 46px);
          margin: 12px 0;
          background: linear-gradient(90deg, #c4b5fd, #60a5fa);
          background-clip: text;
          color: transparent;
        }

        .cart-header p,
        .product-details p {
          color: #94a3b8;
        }

        .message {
          display: flex;
          justify-content: space-between;
          background: #172b28;
          color: #86efac;
          padding: 13px 18px;
          border-radius: 9px;
          margin-bottom: 22px;
        }

        .message button {
          background: transparent;
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 28px;
          align-items: start;
        }

        .cart-list,
        .summary {
          background: #111a2a;
          border: 1px solid #29364c;
          border-radius: 16px;
          padding: 24px;
        }

        .list-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 20px;
        }

        .list-heading h2,
        .summary h2 {
          font-size: 21px;
        }

        .clear-btn,
        .remove-btn {
          background: transparent;
          border: none;
          color: #fb7185;
          cursor: pointer;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 95px minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          padding: 20px 0;
          border-top: 1px solid #29364c;
        }

        .product-icon {
          height: 90px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #211c42, #10253d);
          border-radius: 12px;
          font-size: 43px;
          cursor: pointer;
        }

        .product-details span {
          color: #a78bfa;
          font-size: 11px;
          text-transform: uppercase;
        }

        .product-details h3 {
          margin: 7px 0;
          font-size: 16px;
        }

        .product-details p {
          font-size: 12px;
          margin-bottom: 9px;
        }

        .product-details strong {
          color: #c4b5fd;
        }

        .item-actions {
          text-align: right;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          background: #0b1220;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 5px;
          margin-bottom: 10px;
        }

        .quantity-control button {
          width: 27px;
          height: 27px;
          border: none;
          border-radius: 5px;
          background: #29364c;
          color: white;
          font-size: 18px;
          cursor: pointer;
        }

        .item-total {
          display: block;
          margin-bottom: 8px;
          color: #c4b5fd;
        }

        .continue-btn {
          margin-top: 22px;
          background: transparent;
          color: #c4b5fd;
          border: none;
          cursor: pointer;
        }

        .summary h2 {
          margin-bottom: 25px;
        }

        .summary-row,
        .summary-total {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 18px;
          color: #cbd5e1;
        }

        .shipping-note {
          color: #86efac;
          font-size: 12px;
          margin-top: -8px;
          margin-bottom: 20px;
        }

        .summary-divider {
          border-top: 1px solid #334155;
          margin: 20px 0;
        }

        .summary-total {
          align-items: center;
          font-size: 18px;
        }

        .summary-total strong {
          color: #c4b5fd;
          font-size: 25px;
        }

        .checkout-btn,
        .empty-cart button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 9px;
          background: #7c3aed;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .payment-note {
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
          margin-top: 17px;
        }

        .empty-cart {
          max-width: 500px;
          margin: 70px auto;
          text-align: center;
          padding: 45px 25px;
          background: #111a2a;
          border: 1px solid #29364c;
          border-radius: 17px;
        }

        .empty-icon {
          font-size: 65px;
        }

        .empty-cart h2 {
          margin: 20px 0 10px;
        }

        .empty-cart p {
          color: #94a3b8;
          margin-bottom: 25px;
        }

        @media (max-width: 850px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 550px) {
          .cart-page {
            padding: 85px 15px 40px;
          }

          .cart-list,
          .summary {
            padding: 17px;
          }

          .cart-item {
            grid-template-columns: 70px minmax(0, 1fr);
            gap: 12px;
          }

          .product-icon {
            height: 70px;
            font-size: 34px;
          }

          .item-actions {
            grid-column: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }

          .quantity-control {
            margin-bottom: 0;
          }

          .item-total {
            margin: 0;
          }
        }
      `}</style>
    </main>
  );
}
