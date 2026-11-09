
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

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
    description: "Experience smooth and responsive gaming."
  },
  {
    id: 2,
    name: "RGB Mechanical Keyboard",
    category: "Keyboards",
    price: 1999,
    icon: "⌨️",
    description: "Mechanical keys with stunning RGB lighting."
  },
  {
    id: 3,
    name: "Pro Gaming Headset",
    category: "Headsets",
    price: 1799,
    icon: "🎧",
    description: "Immersive sound for competitive gaming."
  },
  {
    id: 4,
    name: "Precision Gaming Mouse",
    category: "Mice",
    price: 999,
    icon: "🖱️",
    description: "Accurate tracking and comfortable control."
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

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialQuery);
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("gamingHubCart") || "[]"));
      setWishlist(
        JSON.parse(localStorage.getItem("gamingHubWishlist") || "[]")
      );
    } catch {
      setCart([]);
      setWishlist([]);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    let results = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      results = [...results].sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      results = [...results].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return results;
  }, [search, category, sort]);

  function performSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    router.push(
      query ? `/search?q=${encodeURIComponent(query)}` : "/search"
    );
  }

  function addToCart(id: number) {
    const updatedCart = [...cart, id];

    localStorage.setItem("gamingHubCart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    setMessage("Product added to cart successfully!");
  }

  function toggleWishlist(id: number) {
    const updatedWishlist = wishlist.includes(id)
      ? wishlist.filter((item) => item !== id)
      : [...wishlist, id];

    localStorage.setItem(
      "gamingHubWishlist",
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);
    setMessage(
      updatedWishlist.includes(id)
        ? "Added to wishlist!"
        : "Removed from wishlist!"
    );
  }

  return (
    <main className="search-page">
      <section className="search-hero">
        <span className="eyebrow">GAMING HUB SEARCH</span>
        <h1>Find Your Gaming Gear</h1>
        <p>Search controllers, keyboards, headsets and more.</p>

        <form className="search-form" onSubmit={performSearch}>
          <span>🔍</span>
          <input
            type="search"
            placeholder="Search gaming products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {message && (
        <div className="message" role="status">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <section className="results-section">
        <div className="results-header">
          <div>
            <h2>Search Results</h2>
            <p>
              {filteredProducts.length} product(s) found
              {search.trim() ? ` for "${search.trim()}"` : ""}
            </p>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Sort: Recommended</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        <div className="category-filters">
          {["All", "Controllers", "Keyboards", "Headsets", "Mice", "Accessories"].map(
            (item) => (
              <button
                key={item}
                className={category === item ? "selected" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            )
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <span>🔎</span>
            <h3>No products found</h3>
            <p>Try another product name or category.</p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                router.push("/search");
              }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <button
                  className={`wishlist ${
                    wishlist.includes(product.id) ? "active" : ""
                  }`}
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Toggle wishlist"
                >
                  {wishlist.includes(product.id) ? "♥" : "♡"}
                </button>

                <div
                  className="product-image"
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

                <div className="product-info">
                  <span className="category-label">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <div className="price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>

                  <button
                    className="details-btn"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    View Details
                  </button>

                  <button
                    className="cart-btn"
                    onClick={() => addToCart(product.id)}
                  >
                    + Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .search-page {
          min-height: 100vh;
          padding: 85px 6% 60px;
          background: #090d18;
          color: #f8fafc;
        }

        .search-hero {
          text-align: center;
          padding: 50px 20px;
          border: 1px solid #302653;
          border-radius: 22px;
          background: linear-gradient(120deg, #17132f, #101c36);
        }

        .eyebrow {
          color: #a78bfa;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        .search-hero h1 {
          font-size: clamp(30px, 5vw, 48px);
          margin: 15px 0;
          background: linear-gradient(90deg, #c4b5fd, #60a5fa);
          background-clip: text;
          color: transparent;
        }

        .search-hero p,
        .results-header p {
          color: #94a3b8;
        }

        .search-form {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 650px;
          margin: 30px auto 0;
          padding: 8px 12px;
          background: #0b1220;
          border: 1px solid #475569;
          border-radius: 12px;
        }

        .search-form input {
          flex: 1;
          min-width: 0;
          padding: 12px 5px;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 15px;
        }

        .search-form button,
        .no-results button {
          padding: 12px 20px;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .message {
          display: flex;
          justify-content: space-between;
          margin-top: 25px;
          padding: 13px 18px;
          border-radius: 9px;
          background: #172b28;
          color: #86efac;
        }

        .message button {
          background: transparent;
          border: 0;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }

        .results-section {
          margin-top: 45px;
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .results-header h2 {
          font-size: 27px;
          margin-bottom: 7px;
        }

        .results-header select {
          padding: 12px;
          background: #121a2b;
          border: 1px solid #334155;
          border-radius: 8px;
          color: white;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
        }

        .category-filters button {
          padding: 10px 16px;
          background: #121a2b;
          color: #cbd5e1;
          border: 1px solid #334155;
          border-radius: 20px;
          cursor: pointer;
        }

        .category-filters button.selected {
          background: #7c3aed;
          color: white;
          border-color: #7c3aed;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(235px, 1fr));
          gap: 25px;
        }

        .product-card {
          position: relative;
          overflow: hidden;
          border: 1px solid #26334a;
          border-radius: 17px;
          background: #121a2b;
          transition: 0.25s;
        }

        .product-card:hover {
          transform: translateY(-5px);
          border-color: #8b5cf6;
        }

        .wishlist {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 2;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #0b1220;
          border: 1px solid #475569;
          color: white;
          font-size: 23px;
          cursor: pointer;
        }

        .wishlist.active {
          color: #fb7185;
          border-color: #fb7185;
        }

        .product-image {
          height: 180px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #211c42, #10253d);
          font-size: 75px;
          cursor: pointer;
        }

        .product-info {
          padding: 20px;
        }

        .category-label {
          color: #a78bfa;
          font-size: 12px;
          text-transform: uppercase;
        }

        .product-info h3 {
          margin: 10px 0;
          font-size: 18px;
        }

        .product-info p {
          color: #94a3b8;
          font-size: 13px;
          min-height: 40px;
          line-height: 1.5;
        }

        .price {
          color: #c4b5fd;
          font-size: 23px;
          font-weight: bold;
          margin: 18px 0;
        }

        .details-btn,
        .cart-btn {
          width: 100%;
          padding: 12px;
          margin-top: 9px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .details-btn {
          background: transparent;
          color: #c4b5fd;
          border: 1px solid #7c3aed;
        }

        .cart-btn {
          background: #7c3aed;
          color: white;
          border: 1px solid #7c3aed;
        }

        .no-results {
          text-align: center;
          padding: 65px 15px;
          border: 1px dashed #475569;
          border-radius: 15px;
        }

        .no-results span {
          font-size: 45px;
        }

        .no-results h3 {
          margin: 15px 0 8px;
        }

        .no-results p {
          color: #94a3b8;
          margin-bottom: 20px;
        }

        @media (max-width: 600px) {
          .search-page {
            padding: 80px 17px 40px;
          }

          .search-hero {
            padding: 35px 15px;
          }

          .search-form {
            gap: 5px;
          }

          .search-form button {
            padding: 11px;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main style={{ background: "#090d18", color: "white", padding: 100 }}>
          Loading search...
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
