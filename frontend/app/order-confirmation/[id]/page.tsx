
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OrderProduct = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  orderId: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  products: OrderProduct[];
  subtotal: number;
  shipping: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

export default function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const orderId = params.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("gamingHubLastOrder");

      if (savedOrder) {
        const parsedOrder: Order = JSON.parse(savedOrder);

        if (parsedOrder.orderId === orderId) {
          setOrder(parsedOrder);
        } else {
          const previousOrders = JSON.parse(
            localStorage.getItem("gamingHubDemoOrders") || "[]"
          );

          if (Array.isArray(previousOrders)) {
            const matchingOrder = previousOrders.find(
              (item: Order) => item.orderId === orderId
            );

            if (matchingOrder) {
              setOrder(matchingOrder);
            }
          }
        }
      } else {
        const previousOrders = JSON.parse(
          localStorage.getItem("gamingHubDemoOrders") || "[]"
        );

        if (Array.isArray(previousOrders)) {
          const matchingOrder = previousOrders.find(
            (item: Order) => item.orderId === orderId
          );

          if (matchingOrder) {
            setOrder(matchingOrder);
          }
        }
      }
    } catch (error) {
      console.error("Unable to load order:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <main className="confirmation-page">
        <p>Loading order details...</p>
        <style jsx>{`
          .confirmation-page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #090d18;
            color: white;
          }
        `}</style>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="confirmation-page">
        <section className="not-found">
          <div>🔍</div>
          <h1>Order Not Found</h1>
          <p>We couldn't find an order with this order ID.</p>
          <button onClick={() => router.push("/orders")}>
            View My Orders
          </button>
        </section>

        <style jsx>{`
          .confirmation-page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #090d18;
            color: white;
            padding: 30px;
          }

          .not-found {
            text-align: center;
          }

          .not-found div {
            font-size: 55px;
          }

          .not-found p {
            color: #94a3b8;
            margin: 15px 0 25px;
          }

          button {
            padding: 13px 22px;
            background: #7c3aed;
            color: white;
            border: none;
            border-radius: 9px;
            cursor: pointer;
          }
        `}</style>
      </main>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  return (
    <main className="confirmation-page">
      <section className="confirmation-container">
        <div className="success-section">
          <div className="success-icon">✓</div>
          <span className="eyebrow">GAMING HUB</span>
          <h1>Order Placed Successfully!</h1>
          <p>
            Thank you for shopping with us, {order.customer.fullName}.
            Your order has been received.
          </p>
        </div>

        <div className="order-number">
          <div>
            <span>ORDER ID</span>
            <strong>{order.orderId}</strong>
          </div>
          <div>
            <span>ORDER DATE</span>
            <strong>{orderDate}</strong>
          </div>
          <div>
            <span>ORDER STATUS</span>
            <strong className="status">{order.status}</strong>
          </div>
        </div>

        <div className="details-grid">
          <section className="details-card">
            <h2>Delivery Information</h2>
            <p><strong>{order.customer.fullName}</strong></p>
            <p>{order.customer.email}</p>
            <p>{order.customer.phone}</p>
            <p>
              {order.customer.address}, {order.customer.city},{" "}
              {order.customer.state} - {order.customer.pincode}
            </p>
          </section>

          <section className="details-card">
            <h2>Payment Information</h2>
            <p>Payment Method</p>
            <strong>{order.paymentMethod}</strong>
            <p className="payment-note">
              You will pay when your order is delivered.
            </p>
          </section>
        </div>

        <section className="products-card">
          <h2>Ordered Products</h2>

          {order.products.map((product, index) => (
            <div className="product-row" key={`${product.productId}-${index}`}>
              <div className="product-info">
                <strong>{product.name}</strong>
                <span>Quantity: {product.quantity}</span>
              </div>

              <strong>
                ₹{(product.price * product.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <div className="price-row">
            <span>Subtotal</span>
            <strong>₹{order.subtotal.toLocaleString("en-IN")}</strong>
          </div>

          <div className="price-row">
            <span>Shipping</span>
            <strong>
              {order.shipping === 0
                ? "FREE"
                : `₹${order.shipping.toLocaleString("en-IN")}`}
            </strong>
          </div>

          <div className="total-row">
            <span>Total Amount</span>
            <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
          </div>
        </section>

        <div className="confirmation-actions">
          <button
            className="primary-btn"
            onClick={() => router.push("/products")}
          >
            Continue Shopping
          </button>

          <button
            className="secondary-btn"
            onClick={() => router.push("/orders")}
          >
            View My Orders
          </button>
        </div>

        <p className="footer-note">
          Thank you for choosing Gaming Hub! 🎮
        </p>
      </section>

      <style jsx>{`
        .confirmation-page {
          min-height: 100vh;
          padding: 90px 6% 60px;
          background: #090d18;
          color: #f8fafc;
        }

        .confirmation-container {
          max-width: 850px;
          margin: auto;
        }

        .success-section {
          text-align: center;
          padding: 30px 15px;
        }

        .success-icon {
          width: 75px;
          height: 75px;
          display: grid;
          place-items: center;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: #12372b;
          border: 2px solid #22c55e;
          color: #86efac;
          font-size: 42px;
        }

        .eyebrow {
          color: #a78bfa;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        .success-section h1 {
          font-size: clamp(28px, 5vw, 40px);
          margin: 12px 0;
          background: linear-gradient(90deg, #c4b5fd, #60a5fa);
          background-clip: text;
          color: transparent;
        }

        .success-section p {
          color: #94a3b8;
          line-height: 1.7;
        }

        .order-number {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          padding: 22px;
          background: #111a2a;
          border: 1px solid #29364c;
          border-radius: 14px;
        }

        .order-number div {
          display: grid;
          gap: 9px;
          overflow-wrap: anywhere;
        }

        .order-number span {
          color: #94a3b8;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .order-number strong {
          font-size: 14px;
        }

        .status {
          color: #86efac;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-top: 22px;
        }

        .details-card,
        .products-card {
          padding: 23px;
          background: #111a2a;
          border: 1px solid #29364c;
          border-radius: 14px;
        }

        .details-card h2,
        .products-card h2 {
          font-size: 18px;
          margin-bottom: 18px;
        }

        .details-card p {
          color: #cbd5e1;
          font-size: 13px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .payment-note {
          color: #86efac !important;
          margin-top: 12px;
        }

        .products-card {
          margin-top: 22px;
        }

        .product-row {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 16px 0;
          border-bottom: 1px solid #29364c;
          font-size: 13px;
        }

        .product-row > strong {
          color: #c4b5fd;
          white-space: nowrap;
        }

        .product-info {
          display: grid;
          gap: 7px;
        }

        .product-info span {
          color: #94a3b8;
        }

        .price-row,
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-top: 17px;
          font-size: 14px;
          color: #cbd5e1;
        }

        .total-row {
          border-top: 1px solid #334155;
          padding-top: 20px;
          font-size: 17px;
        }

        .total-row strong {
          color: #c4b5fd;
          font-size: 24px;
        }

        .confirmation-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .primary-btn,
        .secondary-btn {
          padding: 13px 22px;
          border-radius: 9px;
          font-weight: bold;
          cursor: pointer;
        }

        .primary-btn {
          background: #7c3aed;
          color: white;
          border: 1px solid #7c3aed;
        }

        .secondary-btn {
          background: transparent;
          color: #c4b5fd;
          border: 1px solid #7c3aed;
        }

        .footer-note {
          text-align: center;
          margin-top: 30px;
          color: #94a3b8;
          font-size: 13px;
        }

        @media (max-width: 650px) {
          .confirmation-page {
            padding: 85px 15px 40px;
          }

          .order-number {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
s
