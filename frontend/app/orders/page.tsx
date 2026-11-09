
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type OrderProduct = {
  productId: number;
  name?: string;
  quantity: number;
  price?: number;
  icon?: string;
};

type Order = {
  _id: string;
  orderId: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

const ORDER_STEPS = [
  "Placed",
  "Processing",
  "Shipped",
  "Delivered",
];

const formatPrice = (amount: number) =>
  `₹${(amount || 0).toLocaleString("en-IN")}`;

const formatStatus = (status: string) => {
  const normalized = status.toLowerCase();

  return (
    ORDER_STEPS.find(
      (step) => step.toLowerCase() === normalized
    ) || status
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token = localStorage.getItem("gamingHubToken");

      if (!token) {
        throw new Error(
          "Please log in to view your orders."
        );
      }

      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5001/api"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${apiUrl}/orders/my-orders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your session may have expired. Please log in again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load your orders."
        );
      }

      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data.orders)
          ? data.orders
          : [];

      setOrders(orderList);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "delivered";
      case "shipped":
        return "shipped";
      case "processing":
        return "processing";
      case "cancelled":
        return "cancelled";
      default:
        return "placed";
    }
  };

  const getProgress = (status: string) => {
    const index = ORDER_STEPS.findIndex(
      (step) => step.toLowerCase() === status.toLowerCase()
    );

    return index === -1 ? 0 : ((index + 1) / ORDER_STEPS.length) * 100;
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

        <div className="orders-toolbar">
          <span>
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>

          <button
            className="refresh-button"
            onClick={() => fetchOrders(true)}
            disabled={loading || refreshing}
          >
            {refreshing ? "Refreshing..." : "↻ Refresh Orders"}
          </button>
        </div>

        {loading ? (
          <div className="message-card">
            <div className="loader" />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="message-card error">
            <span className="message-icon">⚠️</span>
            <h2>Unable to Load Orders</h2>
            <p>{error}</p>

            <button
              className="retry-button"
              onClick={() => fetchOrders(true)}
            >
              Try Again
            </button>

            <Link href="/login" className="login-link">
              Go to Login
            </Link>
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
            {orders.map((order) => {
              const cancelled =
                order.status.toLowerCase() === "cancelled";

              const progress = getProgress(order.status);

              return (
                <article className="order-card" key={order._id || order.orderId}>

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
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN")
                      : "Date unavailable"}
                  </div>

                  {!cancelled ? (
                    <div className="tracking-section">
                      <h4>Order Tracking</h4>

                      <div className="tracking-steps">
                        {ORDER_STEPS.map((step, index) => {
                          const active =
                            ORDER_STEPS.findIndex(
                              (item) =>
                                item.toLowerCase() ===
                                order.status.toLowerCase()
                            ) >= index;

                          return (
                            <div className="tracking-step" key={step}>
                              <div
                                className={`step-circle ${
                                  active ? "active" : ""
                                }`}
                              >
                                {active ? "✓" : index + 1}
                              </div>

                              <span className={active ? "step-active" : ""}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="cancelled-message">
                      ❌ This order has been cancelled.
                    </div>
                  )}

                  <div className="product-list">
                    {order.products?.map((product, index) => (
                      <div
                        className="product-row"
                        key={`${product.productId}-${index}`}
                      >
                        <span className="product-icon">
                          {product.icon || "🎮"}
                        </span>

                        <div className="product-details">
                          <strong>
                            {product.name ||
                              `Product #${product.productId}`}
                          </strong>
                          <p>Quantity: {product.quantity}</p>
                        </div>

                        {product.price !== undefined && (
                          <strong>
                            {formatPrice(
                              product.price * product.quantity
                            )}
                          </strong>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div>
                      <p className="small-label">PAYMENT METHOD</p>
                      <strong>{order.paymentMethod}</strong>
                    </div>

                    <div className="total">
                      <p className="small-label">TOTAL AMOUNT</p>
                      <strong>
                        {formatPrice(order.totalAmount)}
                      </strong>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}

        <div className="bottom-link">
          <Link href="/products">Continue Shopping →</Link>
        </div>
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

        .back-link,
        .login-link {
          color: #00eaff;
          text-decoration: none;
        }

        .orders-heading {
          text-align: center;
          margin: 35px 0 40px;
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

        .orders-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          color: #aebbd2;
        }

        .refresh-button,
        .retry-button {
          padding: 10px 16px;
          background: #00d9ff;
          color: #07101e;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .message-card,
        .empty-card {
          padding: 45px 25px;
          text-align: center;
          background: #111a30;
          border: 1px solid #00d9ff55;
          border-radius: 18px;
        }

        .empty-card > span,
        .message-icon {
          font-size: 55px;
        }

        .empty-card h2,
        .message-card h2 {
          color: #00eaff;
        }

        .empty-card p,
        .message-card p {
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

        .retry-button {
          display: block;
          margin: 20px auto;
        }

        .login-link {
          display: inline-block;
          margin-top: 5px;
        }

        .loader {
          width: 35px;
          height: 35px;
          margin: 0 auto 15px;
          border: 4px solid #26354c;
          border-top-color: #00eaff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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
          overflow-wrap: anywhere;
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

        .processing {
          background: #a855f720;
          color: #c084fc;
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

        .tracking-section {
          padding: 18px;
          margin: 15px 0;
          background: #0b1427;
          border-radius: 12px;
          border: 1px solid #ffffff12;
        }

        .tracking-section h4 {
          margin: 0 0 18px;
          color: #00eaff;
        }

        .tracking-steps {
          display: flex;
          justify-content: space-between;
          gap: 5px;
        }

        .tracking-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
          color: #718096;
          font-size: 11px;
          text-align: center;
        }

        .step-circle {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid #526078;
          color: #9baac5;
        }

        .step-circle.active {
          background: #00d9ff;
          color: #07101e;
          border-color: #00d9ff;
          font-weight: bold;
        }

        .step-active {
          color: #00eaff;
        }

        .progress-track {
          height: 5px;
          margin-top: 15px;
          background: #26354c;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d9ff, #8b5cf6);
          transition: width 0.3s;
        }

        .cancelled-message {
          padding: 14px;
          margin: 15px 0;
          background: #ef444420;
          color: #f87171;
          border-radius: 9px;
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
          min-width: 0;
        }

        .product-details strong {
          overflow-wrap: anywhere;
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

        .bottom-link {
          text-align: center;
          margin-top: 30px;
        }

        .bottom-link a {
          color: #00eaff;
          text-decoration: none;
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

          .tracking-section {
            padding: 12px 8px;
          }

          .tracking-step {
            font-size: 9px;
          }

          .step-circle {
            width: 25px;
            height: 25px;
          }
        }
      `}</style>
    </main>
  );
}
