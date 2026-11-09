
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderProduct = {
  productId: number;
  name?: string;
  quantity: number;
  price?: number;
  icon?: string;
};

type Customer = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

type Order = {
  _id?: string;
  orderId: string;
  customer?: Customer;
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

const statuses = [
  "Placed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gamingHubDemoOrders");
      const parsed = saved ? JSON.parse(saved) : [];

      setOrders(
        Array.isArray(parsed)
          ? parsed
          : []
      );
    } catch {
      setOrders([]);
    }

    setLoaded(true);
  }, []);

  function updateOrderStatus(orderId: string, newStatus: string) {
    const updated = orders.map((order) =>
      order.orderId === orderId
        ? { ...order, status: newStatus }
        : order
    );

    setOrders(updated);

    localStorage.setItem(
      "gamingHubDemoOrders",
      JSON.stringify(updated)
    );

    const updatedSelected = updated.find(
      (order) => order.orderId === orderId
    );

    setSelectedOrder(updatedSelected || null);
    setMessage(`Order ${orderId} updated to ${newStatus}.`);
  }

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    const matchesSearch =
      order.orderId.toLowerCase().includes(query) ||
      (order.customer?.name || "").toLowerCase().includes(query) ||
      (order.customer?.email || "").toLowerCase().includes(query);

    const matchesStatus =
      filter === "All" || order.status === filter;

    return matchesSearch && matchesStatus;
  });

  const formatPrice = (amount: number) =>
    `₹${(amount || 0).toLocaleString("en-IN")}`;

  if (!loaded) {
    return <main className="loading">Loading orders...</main>;
  }

  return (
    <main className="admin-layout">
      <aside className="sidebar">
        <Link href="/admin" className="brand">
          🎮 GAMING HUB
          <small>ADMIN PANEL</small>
        </Link>

        <nav>
          <Link href="/admin">▦ Dashboard</Link>
          <Link href="/admin/products">📦 Products</Link>
          <Link href="/admin/orders" className="active">
            🛒 Orders
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link href="/">↗ View Website</Link>
          <Link href="/admin/login">⇥ Admin Login</Link>
        </div>
      </aside>

      <section className="main-content">
        <header className="page-header">
          <div>
            <h1>Order Management</h1>
            <p>Manage customer orders and delivery status.</p>
          </div>

          <div className="order-count">
            Total Orders: <strong>{orders.length}</strong>
          </div>
        </header>

        {message && (
          <div className="notice">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="stat-card">
            <span>Processing</span>
            <strong>
              {orders.filter((o) => o.status === "Processing").length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Shipped</span>
            <strong>
              {orders.filter((o) => o.status === "Shipped").length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Delivered</span>
            <strong>
              {orders.filter((o) => o.status === "Delivered").length}
            </strong>
          </div>
        </section>

        <section className="orders-panel">
          <div className="toolbar">
            <input
              type="search"
              placeholder="Search order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order._id || order.orderId || index}>
                    <td className="order-id">{order.orderId}</td>
                    <td>
                      <strong>
                        {order.customer?.name || "Demo Customer"}
                      </strong>
                      <small>{order.customer?.email || "No email"}</small>
                    </td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    <td>{formatPrice(order.totalAmount)}</td>
                    <td>{order.paymentMethod || "COD"}</td>
                    <td>
                      <span
                        className={`status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-button"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="no-results">
                      No matching orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selectedOrder && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedOrder(null)}
          >
            <section
              className="order-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h2>Order Details</h2>
                  <p>{selectedOrder.orderId}</p>
                </div>

                <button
                  className="close"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>

              <div className="customer-details">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.customer?.name || "Not available"}</p>
                <p><strong>Email:</strong> {selectedOrder.customer?.email || "Not available"}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer?.phone || "Not available"}</p>
                <p>
                  <strong>Address:</strong>{" "}
                  {[
                    selectedOrder.customer?.address,
                    selectedOrder.customer?.city,
                    selectedOrder.customer?.state,
                    selectedOrder.customer?.pincode,
                  ].filter(Boolean).join(", ") || "Not available"}
                </p>
              </div>

              <h3>Ordered Products</h3>

              <div className="modal-products">
                {selectedOrder.products?.map((product, index) => (
                  <div
                    className="modal-product"
                    key={`${product.productId}-${index}`}
                  >
                    <span>{product.icon || "🎮"}</span>
                    <div>
                      <strong>
                        {product.name || `Product #${product.productId}`}
                      </strong>
                      <p>Quantity: {product.quantity}</p>
                    </div>
                    <strong>
                      {product.price !== undefined
                        ? formatPrice(product.price * product.quantity)
                        : "N/A"}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Total Amount</span>
                <strong>{formatPrice(selectedOrder.totalAmount)}</strong>
              </div>

              <div className="status-update">
                <label>Update Order Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateOrderStatus(
                      selectedOrder.orderId,
                      e.target.value
                    )
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <p className="payment-info">
                Payment Method: {selectedOrder.paymentMethod || "COD"}
              </p>
            </section>
          </div>
        )}
      </section>

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          display: flex;
          background: #080d1c;
          color: white;
        }

        .sidebar {
          width: 235px;
          flex-shrink: 0;
          padding: 25px 17px;
          background: #101a2e;
          border-right: 1px solid #24334d;
          display: flex;
          flex-direction: column;
        }

        .brand {
          color: #00eaff;
          font-size: 19px;
          font-weight: bold;
          text-decoration: none;
          margin-bottom: 40px;
        }

        .brand small {
          display: block;
          margin-top: 7px;
          color: #8fa2bf;
          font-size: 10px;
          letter-spacing: 2px;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        nav a,
        .sidebar-bottom a {
          padding: 13px;
          color: #aebbd2;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
        }

        nav a.active,
        nav a:hover {
          color: #00eaff;
          background: #123247;
        }

        .sidebar-bottom {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
        }

        .sidebar-bottom a {
          border: 1px solid #ffffff15;
        }

        .main-content {
          flex: 1;
          min-width: 0;
          padding: 35px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 25px;
        }

        .page-header h1 {
          font-size: 28px;
          margin: 0 0 8px;
        }

        .page-header p {
          color: #8fa2bf;
          font-size: 13px;
          margin: 0;
        }

        .order-count {
          padding: 12px 16px;
          background: #102538;
          color: #aebbd2;
          border: 1px solid #00d9ff55;
          border-radius: 8px;
        }

        .order-count strong {
          color: #00eaff;
        }

        .notice {
          display: flex;
          justify-content: space-between;
          padding: 13px;
          margin-bottom: 20px;
          background: #102b36;
          border: 1px solid #00d9ff55;
          border-radius: 8px;
          color: #00eaff;
        }

        .notice button,
        .close {
          border: none;
          background: transparent;
          color: white;
          font-size: 22px;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 22px;
        }

        .stat-card {
          padding: 20px;
          background: #111a30;
          border: 1px solid #ffffff12;
          border-radius: 12px;
        }

        .stat-card span {
          display: block;
          color: #8fa2bf;
          font-size: 13px;
        }

        .stat-card strong {
          display: block;
          color: #00eaff;
          font-size: 26px;
          margin-top: 10px;
        }

        .orders-panel {
          padding: 22px;
          background: #111a30;
          border: 1px solid #ffffff12;
          border-radius: 13px;
        }

        .toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        input,
        select {
          padding: 12px;
          background: #0b1427;
          color: white;
          border: 1px solid #33445e;
          border-radius: 8px;
        }

        input {
          flex: 1;
          min-width: 0;
        }

        select {
          min-width: 160px;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 800px;
          border-collapse: collapse;
          text-align: left;
          font-size: 12px;
        }

        th {
          padding: 14px 10px;
          color: #718096;
          border-bottom: 1px solid #ffffff20;
        }

        td {
          padding: 15px 10px;
          color: #cbd5e1;
          border-bottom: 1px solid #ffffff10;
        }

        td small {
          display: block;
          margin-top: 5px;
          color: #718096;
        }

        .order-id {
          color: #00eaff;
          font-weight: bold;
        }

        .status {
          display: inline-block;
          padding: 6px 9px;
          border-radius: 15px;
          background: #00d9ff20;
          color: #00eaff;
          font-size: 10px;
          white-space: nowrap;
        }

        .status.delivered {
          background: #22c55e20;
          color: #4ade80;
        }

        .status.shipped {
          background: #3b82f620;
          color: #60a5fa;
        }

        .status.processing {
          background: #a855f720;
          color: #c084fc;
        }

        .status.cancelled {
          background: #ef444420;
          color: #f87171;
        }

        .view-button {
          padding: 7px 12px;
          border: 1px solid #00d9ff66;
          border-radius: 7px;
          background: #102538;
          color: #00eaff;
          cursor: pointer;
        }

        .no-results {
          text-align: center;
          padding: 35px;
          color: #8fa2bf;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #000b;
          overflow-y: auto;
        }

        .order-modal {
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 25px;
          background: #111a30;
          border: 1px solid #00d9ff66;
          border-radius: 15px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .modal-header h2 {
          color: #00eaff;
          margin: 0 0 6px;
        }

        .modal-header p {
          color: #8fa2bf;
          font-size: 12px;
          margin: 0;
        }

        .order-modal h3 {
          font-size: 15px;
          margin: 20px 0 12px;
          color: #00eaff;
        }

        .customer-details {
          padding: 15px;
          background: #0b1427;
          border-radius: 10px;
        }

        .customer-details p {
          color: #cbd5e1;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .modal-products {
          border-top: 1px solid #ffffff15;
        }

        .modal-product {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid #ffffff10;
        }

        .modal-product span {
          font-size: 25px;
        }

        .modal-product div {
          flex: 1;
          min-width: 0;
        }

        .modal-product strong {
          overflow-wrap: anywhere;
        }

        .modal-product p {
          color: #8fa2bf;
          font-size: 12px;
          margin: 5px 0 0;
        }

        .order-total {
          display: flex;
          justify-content: space-between;
          padding: 17px 0;
          border-bottom: 1px solid #ffffff20;
        }

        .order-total strong {
          color: #00eaff;
          font-size: 20px;
        }

        .status-update label {
          display: block;
          color: #aebbd2;
          font-size: 12px;
          margin: 18px 0 8px;
        }

        .status-update select {
          width: 100%;
        }

        .payment-info {
          color: #8fa2bf;
          font-size: 12px;
        }

        .loading {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #080d1c;
          color: #00eaff;
        }

        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 750px) {
          .admin-layout {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            padding: 15px;
          }

          .brand {
            margin-bottom: 15px;
          }

          nav {
            flex-direction: row;
            flex-wrap: wrap;
          }

          nav a {
            padding: 9px;
            font-size: 12px;
          }

          .sidebar-bottom {
            flex-direction: row;
            margin-top: 12px;
          }

          .main-content {
            padding: 22px 14px;
          }
        }

        @media (max-width: 500px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .stat-card {
            padding: 14px;
          }

          .toolbar {
            flex-direction: column;
          }

          .toolbar select {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
