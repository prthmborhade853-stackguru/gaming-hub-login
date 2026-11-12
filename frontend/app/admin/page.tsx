
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DemoOrder = {
  orderId: string;
  products?: {
    productId: number;
    name?: string;
    quantity: number;
    price?: number;
  }[];
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  customer?: {
    name?: string;
    email?: string;
  };
};

const demoProducts = [
  { id: 1, name: "Wireless Gaming Controller", stock: 12 },
  { id: 2, name: "RGB Mechanical Keyboard", stock: 8 },
  { id: 3, name: "Pro Gaming Headset", stock: 3 },
  { id: 4, name: "Precision Gaming Mouse", stock: 15 },
  { id: 5, name: "RGB Gaming Mousepad", stock: 2 },
  { id: 6, name: "Pro Wireless Controller", stock: 7 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [customers, setCustomers] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [adminName, setAdminName] = useState("Administrator");

  useEffect(() => {
    let active = true;

    async function verifyAdmin() {
      const token = localStorage.getItem("gamingHubAdminToken");

      if (!token) {
        router.replace("/admin/login");
        setAuthChecking(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/admin/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Admin session is invalid or expired.");
        }

        const data = await response.json();

        if (data.admin?.role !== "admin") {
          throw new Error("Unauthorized admin account.");
        }

        if (!active) return;

        setAdminName(data.admin.name || "Administrator");
        localStorage.setItem("gamingHubAdmin", JSON.stringify(data.admin));

        const storedOrders = JSON.parse(
          localStorage.getItem("gamingHubDemoOrders") || "[]"
        );
        const storedUser = localStorage.getItem("gamingHubUser");

        const orderList: DemoOrder[] = Array.isArray(storedOrders)
          ? storedOrders
          : [];

        setOrders([...orderList].reverse());
        setCustomers(storedUser ? 1 : 0);
        setLoaded(true);
      } catch (error) {
        localStorage.removeItem("gamingHubAdminToken");
        localStorage.removeItem("gamingHubAdmin");
        router.replace("/admin/login");
      } finally {
        if (active) setAuthChecking(false);
      }
    }

    verifyAdmin();

    return () => {
      active = false;
    };
  }, [router, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("gamingHubAdminToken");
    localStorage.removeItem("gamingHubAdmin");
    router.replace("/admin/login");
  };

  const totalRevenue = orders
    .filter((order) => order.status?.toLowerCase() !== "cancelled")
    .reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0
    );

  const pendingOrders = orders.filter((order) =>
    ["placed", "processing"].includes(
      (order.status || "placed").toLowerCase()
    )
  ).length;

  const lowStockProducts = demoProducts.filter(
    (product) => product.stock <= 5
  );

  const formatPrice = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const statusClass = (status = "Placed") =>
    status.toLowerCase();

  return (
    <main className="admin-layout">

      <aside className="sidebar">
        <Link href="/admin" className="brand">
          <span>🎮</span>
          GAMING HUB
          <small>ADMIN PANEL</small>
        </Link>

        <div className="sidebar-label">MAIN MENU</div>

        <nav className="side-nav">
          <Link href="/admin" className="active">
            <span>▦</span> Dashboard
          </Link>

          <Link href="/admin/products">
            <span>📦</span> Products
          </Link>

          <Link href="/admin/orders">
            <span>🛒</span> Orders
          </Link>

          <Link href="/admin/orders">
            <span>👥</span> Customers & Orders
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link href="/">↗ View Website</Link>
          <button type="button" className="sidebar-logout" onClick={handleLogout}>
            ⇥ Logout
          </button>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your Gaming Hub administration panel.</p>
          </div>

          <div className="admin-actions">
            <div className="admin-badge">
              <span>🛡️</span>
              <div>
                <strong>{adminName}</strong>
                <small>Administrator</small>
              </div>
            </div>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              ⇥ Logout
            </button>
          </div>
        </header>

        {authChecking || !loaded ? (
          <div className="loading">Loading dashboard...</div>
        ) : (
          <>
            <section className="stats-grid">
              <article className="stat-card cyan">
                <div className="stat-top">
                  <span>Total Products</span>
                  <span className="stat-icon">📦</span>
                </div>
                <h2>{demoProducts.length}</h2>
                <p>Products in demo catalogue</p>
              </article>

              <article className="stat-card purple">
                <div className="stat-top">
                  <span>Total Orders</span>
                  <span className="stat-icon">🛒</span>
                </div>
                <h2>{orders.length}</h2>
                <p>Demo orders recorded</p>
              </article>

              <article className="stat-card green">
                <div className="stat-top">
                  <span>Customers</span>
                  <span className="stat-icon">👥</span>
                </div>
                <h2>{customers}</h2>
                <p>Local demo account count</p>
              </article>

              <article className="stat-card orange">
                <div className="stat-top">
                  <span>Total Revenue</span>
                  <span className="stat-icon">₹</span>
                </div>
                <h2>{formatPrice(totalRevenue)}</h2>
                <p>Non-cancelled demo orders</p>
              </article>
            </section>

            <section className="quick-grid">
              <Link href="/admin/products" className="quick-card">
                <span>📦</span>
                <div>
                  <strong>Manage Products</strong>
                  <p>Add, edit and manage inventory</p>
                </div>
                <b>→</b>
              </Link>

              <Link href="/admin/orders" className="quick-card">
                <span>📋</span>
                <div>
                  <strong>Manage Orders</strong>
                  <p>View orders and update their status</p>
                </div>
                <b>→</b>
              </Link>
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Recent Orders</h2>
                    <p>Latest orders from the demo checkout</p>
                  </div>

                  <Link href="/admin/orders">View All →</Link>
                </div>

                {orders.length === 0 ? (
                  <div className="empty">
                    <span>📭</span>
                    <p>No demo orders available.</p>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orders.slice(0, 5).map((order, index) => (
                          <tr key={order.orderId || index}>
                            <td>{order.orderId || "N/A"}</td>
                            <td>
                              {order.customer?.name || "Demo Customer"}
                            </td>
                            <td>
                              {formatPrice(Number(order.totalAmount || 0))}
                            </td>
                            <td>
                              <span
                                className={`status ${statusClass(order.status)}`}
                              >
                                {order.status || "Placed"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="panel inventory-panel">
                <div className="panel-header">
                  <div>
                    <h2>Low Stock Alerts</h2>
                    <p>Demo inventory overview</p>
                  </div>
                  <span>⚠️</span>
                </div>

                {lowStockProducts.map((product) => (
                  <div className="stock-row" key={product.id}>
                    <div>
                      <strong>{product.name}</strong>
                      <p>Product #{product.id}</p>
                    </div>

                    <span className="stock-count">
                      {product.stock} left
                    </span>
                  </div>
                ))}

                <Link href="/admin/products" className="inventory-link">
                  Manage Inventory →
                </Link>
              </div>
            </section>

            <section className="summary-panel">
              <h2>Order Overview</h2>

              <div className="summary-grid">
                <div>
                  <span className="summary-dot pending" />
                  <p>Pending Orders</p>
                  <strong>{pendingOrders}</strong>
                </div>

                <div>
                  <span className="summary-dot delivered" />
                  <p>Delivered Orders</p>
                  <strong>
                    {orders.filter(
                      (o) => o.status?.toLowerCase() === "delivered"
                    ).length}
                  </strong>
                </div>

                <div>
                  <span className="summary-dot cancelled" />
                  <p>Cancelled Orders</p>
                  <strong>
                    {orders.filter(
                      (o) => o.status?.toLowerCase() === "cancelled"
                    ).length}
                  </strong>
                </div>
              </div>
            </section>

            <footer>
              Gaming Hub Admin Panel · Frontend Demo Version
            </footer>
          </>
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
          width: 245px;
          min-height: 100vh;
          padding: 25px 17px;
          background: #101a2e;
          border-right: 1px solid #24334d;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .brand {
          display: flex;
          flex-direction: column;
          gap: 5px;
          color: #00eaff;
          text-decoration: none;
          font-weight: bold;
          font-size: 19px;
          margin-bottom: 40px;
        }

        .brand span {
          font-size: 32px;
        }

        .brand small {
          color: #8fa2bf;
          font-size: 10px;
          letter-spacing: 2px;
        }

        .sidebar-label {
          color: #718096;
          font-size: 11px;
          letter-spacing: 1.5px;
          margin: 0 0 15px 10px;
        }

        .side-nav {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .side-nav a,
        .sidebar-bottom a {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border-radius: 9px;
          color: #aebbd2;
          text-decoration: none;
          font-size: 14px;
        }

        .side-nav a.active,
        .side-nav a:hover {
          background: #123247;
          color: #00eaff;
        }

        .sidebar-bottom {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
        }

        .sidebar-bottom a,
        .sidebar-logout {
          border: 1px solid #ffffff15;
        }

        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border-radius: 9px;
          background: transparent;
          color: #f87171;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
        }

        .sidebar-logout:hover {
          background: #ef444415;
        }

        .main-content {
          flex: 1;
          min-width: 0;
          padding: 35px;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 30px;
        }

        .topbar h1 {
          font-size: 30px;
          margin: 0 0 8px;
        }

        .topbar p,
        .panel-header p {
          color: #8fa2bf;
          font-size: 13px;
          margin: 0;
        }

        .admin-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          border: 1px solid #00d9ff55;
          border-radius: 9px;
          color: #00eaff;
          background: #102538;
          font-size: 13px;
        }

        .admin-badge small {
          display: block;
          color: #8fa2bf;
          font-size: 10px;
          margin-top: 3px;
        }

        .logout-button {
          padding: 11px 16px;
          border: 1px solid #ef444455;
          border-radius: 9px;
          background: #ef444415;
          color: #f87171;
          cursor: pointer;
          font-weight: bold;
        }

        .logout-button:hover {
          background: #ef444430;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
        }

        .stat-card {
          padding: 21px;
          border-radius: 13px;
          background: #111a30;
          border: 1px solid #ffffff12;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #aebbd2;
          font-size: 13px;
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-card h2 {
          font-size: 25px;
          margin: 18px 0 7px;
          overflow-wrap: anywhere;
        }

        .stat-card p {
          color: #718096;
          font-size: 11px;
          margin: 0;
        }

        .cyan h2 { color: #00eaff; }
        .purple h2 { color: #b69aff; }
        .green h2 { color: #4ade80; }
        .orange h2 { color: #fbbf24; }

        .quick-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 17px;
          margin: 22px 0;
        }

        .quick-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border: 1px solid #00d9ff35;
          border-radius: 12px;
          background: #111a30;
          color: white;
          text-decoration: none;
          transition: 0.2s;
        }

        .quick-card:hover {
          border-color: #00eaff;
          transform: translateY(-3px);
        }

        .quick-card > span {
          font-size: 30px;
        }

        .quick-card div {
          flex: 1;
        }

        .quick-card p {
          margin: 6px 0 0;
          color: #8fa2bf;
          font-size: 12px;
        }

        .quick-card b {
          color: #00eaff;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 17px;
        }

        .panel,
        .summary-panel {
          background: #111a30;
          border: 1px solid #ffffff12;
          border-radius: 13px;
          padding: 21px;
          min-width: 0;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .panel-header h2,
        .summary-panel h2 {
          font-size: 17px;
          margin: 0 0 7px;
        }

        .panel-header a,
        .inventory-link {
          color: #00eaff;
          text-decoration: none;
          font-size: 12px;
          white-space: nowrap;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 12px;
        }

        th {
          color: #718096;
          padding: 12px 9px;
          border-bottom: 1px solid #ffffff15;
        }

        td {
          padding: 15px 9px;
          border-bottom: 1px solid #ffffff10;
          color: #cbd5e1;
        }

        .status {
          padding: 5px 8px;
          border-radius: 15px;
          font-size: 10px;
          background: #00d9ff20;
          color: #00eaff;
          white-space: nowrap;
        }

        .status.delivered {
          background: #22c55e20;
          color: #4ade80;
        }

        .status.cancelled {
          background: #ef444420;
          color: #f87171;
        }

        .status.processing,
        .status.shipped {
          background: #a855f720;
          color: #c084fc;
        }

        .empty {
          padding: 35px 10px;
          text-align: center;
          color: #8fa2bf;
        }

        .empty span {
          font-size: 35px;
        }

        .stock-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 13px 0;
          border-bottom: 1px solid #ffffff12;
        }

        .stock-row strong {
          font-size: 12px;
        }

        .stock-row p {
          color: #718096;
          font-size: 10px;
          margin: 5px 0 0;
        }

        .stock-count {
          color: #fb923c;
          font-size: 11px;
          white-space: nowrap;
        }

        .inventory-link {
          display: inline-block;
          margin-top: 18px;
        }

        .summary-panel {
          margin-top: 20px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 20px;
        }

        .summary-grid > div {
          padding: 15px;
          background: #0b1427;
          border-radius: 9px;
        }

        .summary-grid p {
          color: #8fa2bf;
          font-size: 12px;
        }

        .summary-grid strong {
          font-size: 22px;
        }

        .summary-dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .pending { background: #fbbf24; }
        .delivered { background: #4ade80; }
        .cancelled { background: #f87171; }

        footer {
          margin-top: 30px;
          text-align: center;
          color: #718096;
          font-size: 11px;
        }

        .loading {
          color: #00eaff;
          padding: 30px;
        }

        @media (max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .admin-layout {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            min-height: auto;
            padding: 15px;
          }

          .brand {
            margin-bottom: 15px;
          }

          .sidebar-label {
            display: none;
          }

          .side-nav {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .side-nav a {
            padding: 9px;
            font-size: 12px;
          }

          .sidebar-bottom {
            flex-direction: row;
            margin-top: 12px;
          }

          .main-content {
            padding: 22px 15px;
          }

          .quick-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 450px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .stat-card {
            padding: 14px;
          }

          .stat-card h2 {
            font-size: 19px;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .topbar h1 {
            font-size: 25px;
          }
        }
      `}</style>
    </main>
  );
}
