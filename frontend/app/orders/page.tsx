
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  _id: string;
  orderId: string;
  products: {
    productId: number;
    name?: string;
    quantity: number;
    price?: number;
    icon?: string;
  }[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5001/api";

        // This endpoint must be implemented in your backend.
        const response = await fetch(`${apiUrl}/orders/my-orders`);

        if (!response.ok) {
          throw new Error("Unable to load orders.");
        }

        const data = await response.json();

        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "delivered";
      case "shipped":
        return "shipped";
      case "cancelled":
        return "cancelled";
      default:
        return "placed";
    }
  };

  return (
    <main className="orders-page">
      <div className="orders-container">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>

        <header className="orders-heading">
          <span className="heading-icon">📦</span>
          <h1>MY <span>ORDERS</span></h1>
          <p>Track your purchases and view your order history.</p>
        </header>

        {loading ? (
          <div className="message-card">Loading your orders...</div>
        ) : error ? (
          <div className="message-card error">
            <h2>Unable to load orders</h2>
            <p>{error}</p>
            <p>
              Make sure the My Orders API is configured in your backend.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-card">
            <span>🛒</span>
            <h2>No Orders Yet</h2>
            <p>
              You haven't placed any orders yet. Explore our gaming
              collection and find your favourite products.
            </p>
            <Link href="/products" className="shop-button">
              Explore Products →
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order._id}>
                <div className="order-header">
                  <div>
                    <p className="small-label">ORDER ID</p>
                    <h3>{order.orderId}</h3>
                  </div>

                  <span
                    className={`status ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-date">
                  Order Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </div>

                <div className="product-list">
                  {order.products.map((product, index) => (
                    <div
                      className="product-row"
                      key={`${product.productId}-${index}`}
                    >
                      <span className="product-icon">
                        {product.icon || "🎮"}
                      </span>
                      <div className="product-details">
                        <strong>
                          {product.name || `Product #${product.productId}`}
                        </strong>
                        <p>Quantity: {product.quantity}</p>
                      </div>
                      {product.price !== undefined && (
                        <strong>
                          ₹{(product.price * product.quantity).toLocaleString("en-IN")}
                        </strong>
                      )}
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div>
                    <p className="small-label">PAYMENT</p>
                    <strong>{order.paymentMethod}</strong>
                  </div>

                  <div className="total">
                    <p className="small-label">TOTAL AMOUNT</p>
                    <strong>
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-page {
          min-height: 100vh;
          padding: 45px 25px;
          background: #080d1c;
          color: white;
        }

        .orders-container {
          max-width: 950px;
          margin: auto;
        }

        .back-link {
          color: #00eaff;
          text-decoration: none;
        }

        .orders-heading {
          text-align: center;
          margin: 35px 0 45px;
        }

        .heading-icon {
          font-size: 48px;
        }

        .orders-heading h1 {
          font-size: 38px;
          margin: 12px 0;
        }

        .orders-heading h1 span {
          color: #00eaff;
          text-shadow: 0 0 15px #00d9ff88;
        }

        .orders-heading p {
          color: #aebbd2;
        }

        .message-card,
        .empty-card {
          padding: 45px 25px;
          text-align: center;
          background: #111a30;
          border: 1px solid #00d9ff55;
          border-radius: 18px;
        }

        .empty-card > span {
          font-size: 55px;
        }

        .empty-card h2 {
          color: #00eaff;
        }

        .empty-card p,
        .error p {
          color: #aebbd2;
          line-height: 1.7;
        }

        .shop-button {
          display: inline-block;
          margin-top: 15px;
          padding: 13px 22px;
          background: linear-gradient(90deg, #00d9ff, #8b5cf6);
          color: #07101e;
          border-radius: 9px;
          font-weight: bold;
          text-decoration: none;
        }

        .error {
          border-color: #ef4444;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .order-card {
          padding: 25px;
          background: #111a30;
          border: 1px solid #00d9ff55;
          border-radius: 17px;
          box-shadow: 0 0 20px #00d9ff12;
        }

        .order-header,
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .small-label {
          color: #8fa2bf;
          font-size: 11px;
          letter-spacing: 1px;
          margin: 0 0 7px;
        }

        .order-header h3 {
          color: #00eaff;
          margin: 0;
        }

        .status {
          padding: 8px 13px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          background: #00d9ff20;
          color: #00eaff;
        }

        .delivered {
          background: #22c55e20;
          color: #4ade80;
        }

        .shipped {
          background: #3b82f620;
          color: #60a5fa;
        }

        .cancelled {
          background: #ef444420;
          color: #f87171;
        }

        .order-date {
          color: #9baac5;
          font-size: 13px;
          margin: 17px 0;
        }

        .product-list {
          border-top: 1px solid #ffffff20;
          border-bottom: 1px solid #ffffff20;
          padding: 12px 0;
        }

        .product-row {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 0;
        }

        .product-icon {
          font-size: 30px;
        }

        .product-details {
          flex: 1;
        }

        .product-details p {
          color: #9baac5;
          font-size: 13px;
          margin: 5px 0 0;
        }

        .order-footer {
          margin-top: 18px;
        }

        .total strong {
          color: #00eaff;
          font-size: 19px;
        }

        @media (max-width: 550px) {
          .orders-page {
            padding: 30px 15px;
          }

          .order-card {
            padding: 18px;
          }

          .product-row {
            gap: 9px;
          }

          .order-header {
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
