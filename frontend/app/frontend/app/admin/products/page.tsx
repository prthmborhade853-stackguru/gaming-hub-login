
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
  description: string;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Gaming Controller",
    category: "Controllers",
    price: 2499,
    stock: 12,
    icon: "🎮",
    description: "Wireless controller for professional gaming.",
  },
  {
    id: 2,
    name: "RGB Mechanical Keyboard",
    category: "Keyboards",
    price: 1999,
    stock: 8,
    icon: "⌨️",
    description: "RGB mechanical keyboard with responsive keys.",
  },
  {
    id: 3,
    name: "Pro Gaming Headset",
    category: "Headsets",
    price: 1799,
    stock: 3,
    icon: "🎧",
    description: "Gaming headset with immersive audio.",
  },
  {
    id: 4,
    name: "Precision Gaming Mouse",
    category: "Mice",
    price: 999,
    stock: 15,
    icon: "🖱️",
    description: "Precision gaming mouse for accurate control.",
  },
  {
    id: 5,
    name: "RGB Gaming Mousepad",
    category: "Accessories",
    price: 699,
    stock: 2,
    icon: "🟪",
    description: "RGB gaming mousepad with smooth surface.",
  },
  {
    id: 6,
    name: "Pro Wireless Controller",
    category: "Controllers",
    price: 3299,
    stock: 7,
    icon: "🕹️",
    description: "Premium wireless gaming controller.",
  },
];

const categories = [
  "Controllers",
  "Keyboards",
  "Headsets",
  "Mice",
  "Accessories",
];

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "Controllers",
  price: 0,
  stock: 0,
  icon: "🎮",
  description: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gamingHubAdminProducts");
      if (saved) {
        const parsed = JSON.parse(saved);
        setProducts(Array.isArray(parsed) ? parsed : initialProducts);
      } else {
        setProducts(initialProducts);
      }
    } catch {
      setProducts(initialProducts);
    }

    setLoaded(true);
  }, []);

  function saveProducts(updated: Product[]) {
    setProducts(updated);
    localStorage.setItem(
      "gamingHubAdminProducts",
      JSON.stringify(updated)
    );
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyProduct);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      icon: product.icon,
      description: product.description,
    });
    setShowForm(true);
    setMessage("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (
      !Number.isFinite(form.price) ||
      !Number.isFinite(form.stock) ||
      form.price <= 0 ||
      form.stock < 0 ||
      !Number.isInteger(form.stock)
    ) {
      setMessage("Enter a valid price and whole-number stock quantity.");
      return;
    }

    if (editingId !== null) {
      const updated = products.map((product) =>
        product.id === editingId
          ? { ...form, id: editingId, name: form.name.trim() }
          : product
      );

      saveProducts(updated);
      setMessage("Product updated successfully!");
    } else {
      const newProduct: Product = {
        ...form,
        id: Date.now(),
        name: form.name.trim(),
      };

      saveProducts([...products, newProduct]);
      setMessage("Product added successfully!");
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyProduct);
  }

  function deleteProduct(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    saveProducts(products.filter((product) => product.id !== id));
    setMessage("Product deleted successfully!");
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filter === "All" || product.category === filter;

    return matchesSearch && matchesCategory;
  });

  const lowStock = products.filter(
    (product) => product.stock <= 5
  ).length;

  if (!loaded) {
    return <main className="loading">Loading inventory...</main>;
  }

  return (
    <main className="admin-page">
      <aside className="sidebar">
        <Link href="/admin" className="brand">
          🎮 GAMING HUB
          <small>ADMIN PANEL</small>
        </Link>

        <nav>
          <Link href="/admin">▦ Dashboard</Link>
          <Link href="/admin/products" className="active">
            📦 Products
          </Link>
          <Link href="/admin/orders">🛒 Orders</Link>
        </nav>

        <div className="sidebar-bottom">
          <Link href="/">↗ View Website</Link>
          <Link href="/admin/login">⇥ Admin Login</Link>
        </div>
      </aside>

      <section className="main-content">
        <header className="page-header">
          <div>
            <h1>Product Management</h1>
            <p>Manage your gaming products and inventory.</p>
          </div>

          <button className="add-button" onClick={openAddForm}>
            + Add Product
          </button>
        </header>

        {message && (
          <div className="notice">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="stats">
          <div className="stat">
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
          <div className="stat">
            <span>Low Stock Products</span>
            <strong className="warning">{lowStock}</strong>
          </div>
          <div className="stat">
            <span>Total Stock Units</span>
            <strong>
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </strong>
          </div>
        </section>

        <section className="inventory-panel">
          <div className="toolbar">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <span>{product.icon}</span>
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>₹{product.price.toLocaleString("en-IN")}</td>
                    <td>
                      <span
                        className={
                          product.stock <= 5
                            ? "stock low"
                            : "stock good"
                        }
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="edit"
                          onClick={() => openEditForm(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="no-results">
                      No matching products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {showForm && (
          <div className="modal-backdrop">
            <section className="product-modal">
              <div className="modal-header">
                <h2>
                  {editingId !== null ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  className="close"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <label>Product Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />

                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <div className="form-row">
                  <div>
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={form.price || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={form.stock}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          stock: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <label>Product Icon (Emoji)</label>
                <input
                  value={form.icon}
                  onChange={(e) =>
                    setForm({ ...form, icon: e.target.value })
                  }
                />

                <label>Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter product description"
                />

                <div className="modal-actions">
                  <button type="submit" className="save-button">
                    {editingId !== null ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </section>

      <style jsx>{`
        .admin-page {
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
          margin-bottom: 28px;
        }

        .page-header h1 {
          margin: 0 0 8px;
          font-size: 28px;
        }

        .page-header p {
          margin: 0;
          color: #8fa2bf;
          font-size: 13px;
        }

        button {
          cursor: pointer;
          font-weight: bold;
        }

        .add-button,
        .save-button {
          padding: 12px 18px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(90deg, #00d9ff, #8b5cf6);
          color: #07101e;
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
          background: none;
          border: none;
          color: white;
          font-size: 22px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 22px;
        }

        .stat {
          padding: 20px;
          border-radius: 12px;
          background: #111a30;
          border: 1px solid #ffffff12;
        }

        .stat span {
          display: block;
          color: #8fa2bf;
          font-size: 13px;
        }

        .stat strong {
          display: block;
          color: #00eaff;
          font-size: 26px;
          margin-top: 10px;
        }

        .stat strong.warning {
          color: #fb923c;
        }

        .inventory-panel {
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
        select,
        textarea {
          width: 100%;
          padding: 12px;
          background: #0b1427;
          color: white;
          border: 1px solid #33445e;
          border-radius: 8px;
          font: inherit;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #00eaff;
        }

        .toolbar input {
          flex: 1;
        }

        .toolbar select {
          max-width: 210px;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 650px;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }

        th {
          padding: 14px 10px;
          color: #718096;
          border-bottom: 1px solid #ffffff20;
        }

        td {
          padding: 15px 10px;
          border-bottom: 1px solid #ffffff10;
          color: #cbd5e1;
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .product-cell span {
          font-size: 25px;
        }

        .product-cell strong {
          color: white;
        }

        .stock {
          padding: 6px 9px;
          border-radius: 15px;
          font-size: 11px;
        }

        .stock.good {
          color: #4ade80;
          background: #22c55e20;
        }

        .stock.low {
          color: #fb923c;
          background: #f9731620;
        }

        .actions {
          display: flex;
          gap: 7px;
        }

        .actions button {
          padding: 7px 10px;
          border: none;
          border-radius: 6px;
          font-size: 11px;
        }

        .edit {
          background: #123247;
          color: #00eaff;
        }

        .delete {
          background: #30202c;
          color: #ff8299;
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

        .product-modal {
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 25px;
          border: 1px solid #00d9ff66;
          border-radius: 15px;
          background: #111a30;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h2 {
          font-size: 20px;
          color: #00eaff;
        }

        form label {
          display: block;
          margin: 13px 0 7px;
          color: #aebbd2;
          font-size: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .cancel-button {
          padding: 12px 18px;
          border: 1px solid #718096;
          border-radius: 8px;
          background: transparent;
          color: white;
        }

        .loading {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #080d1c;
          color: #00eaff;
        }

        @media (max-width: 750px) {
          .admin-page {
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
          .stats {
            grid-template-columns: 1fr;
          }

          .toolbar {
            flex-direction: column;
          }

          .toolbar select {
            max-width: none;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
