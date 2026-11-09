
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

const categoryNames: Record<string, string> = {
  controllers: "Controllers",
  keyboards: "Keyboards",
  headsets: "Headsets",
  mice: "Mice",
  accessories: "Accessories"
};

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = params.slug?.toLowerCase() || "";
  const categoryName = categoryNames[slug];

  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [message, setMessage] = useState("");

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

  const categoryProducts = useMemo(
    () => products.filter((product) => product.category === categoryName),
    [categoryName]
  );

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

  if (!categoryName) {
    return (
      <main className="category-page">
        <div className="empty">
          <h1>Category Not Found</h1>
          <p>The category you are looking for does not exist.</p>
          <button onClick={() => router.push("/products")}>
            Browse All Products
          </button>
        </div>

        <style jsx>{`
          .category-page {
            min-height: 100vh;
            background: #090d18;
            color: white;
            display: grid;
            place-items: center;
            padding: 30px;
          }
          .empty {
            text-align: center;
          }
          h1 {
            color: #a78bfa;
          }
          button {
            background: #7c3aed;
            color: white;
            padding: 13px 22px;
            border: 0;
            border-radius: 9px;
            cursor: pointer;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="category-page">
      <section className="hero">
        <p className="eyebrow">GAMING HUB COLLECTION</p>
        <h1>{categoryName}</h1>
        <p>
          Explore our {categoryName.toLowerCase()} collection and upgrade
          your gaming experience.
        </p>

        <div className="hero-buttons">
          <button onClick={() => router.push("/products")}>
            All Products
          </button>
          <span>{categoryProducts.length} Products Available</span>
        </div>
      </section>

      {message && (
        <div className="message" role="status">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <section className="products-section">
        <div className="section-heading">
          <div>
            <h2>{categoryName} Products</h2>
            <p>Choose your next gaming upgrade.</p>
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="empty-products">
            <h3>No products available</h3>
            <p>Check back later for new products.</p>
          </div>
        ) : (
          <div className="product-grid">
            {categoryProducts.map((product) => (
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
                  <span>{product.icon}</span>
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
        .category-page {
          min-height: 100vh;
          background: #090d18;
          color: #f8fafc;
          padding: 85px 6% 60px;
        }

        .hero {
          padding: 45px;
          border: 1px solid #302653;
          border-radius: 22px;
          background: linear-gradient(120deg, #17132f, #101c36);
          margin-bottom: 45px;
        }

        .eyebrow {
          color: #a78bfa;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        .hero h1 {
          font-size: clamp(35px, 6vw, 55px);
          margin: 12px 0;
          background: linear-gradient(90deg, #c4b5fd, #60a5fa);
          background-clip: text;
          color: transparent;
        }

        .hero p {
          color: #aab4c8;
          line-height: 1.7;
        }

        .hero-buttons {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 25px;
        }

        .hero-buttons button {
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 9px;
          padding: 12px 22px;
          cursor: pointer;
        }

        .hero-buttons span {
          color: #c4b5fd;
          font-size: 14px;
        }

        .message {
          background: #172b28;
          color: #86efac;
          padding: 13px 18px;
          border-radius: 9px;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
        }

        .message button {
          background: transparent;
          border: 0;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }

        .section-heading {
          margin-bottom: 25px;
        }

        .section-heading h2 {
          font-size: 28px;
          margin-bottom: 7px;
        }

        .section-heading p,
        .product-info p {
          color: #94a3b8;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(235px, 1fr));
          gap: 25px;
        }

        .product-card {
          position: relative;
          background: #121a2b;
          border: 1px solid #26334a;
          border-radius: 17px;
          overflow: hidden;
          transition: 0.25s;
        }

        .product-card:hover {
          transform: translateY(-6px);
          border-color: #8b5cf6;
          box-shadow: 0 12px 35px #7c3aed22;
        }

        .wishlist {
          position: absolute;
          right: 15px;
          top: 15px;
          z-index: 2;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #475569;
          background: #0b1220;
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
          cursor: pointer;
        }

        .product-image span {
          font-size: 75px;
        }

        .product-info {
          padding: 20px;
        }

        .category-label {
          color: #a78bfa;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .product-info h3 {
          margin: 10px 0;
          font-size: 18px;
        }

        .product-info p {
          font-size: 13px;
          min-height: 40px;
          line-height: 1.5;
        }

        .price {
          font-size: 23px;
          font-weight: bold;
          margin: 18px 0;
          color: #c4b5fd;
        }

        .details-btn,
        .cart-btn {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 9px;
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

        .details-btn:hover,
        .cart-btn:hover,
        .hero-buttons button:hover {
          opacity: 0.85;
        }

        .empty-products {
          text-align: center;
          padding: 60px 15px;
          color: #94a3b8;
        }

        .empty {
          text-align: center;
        }

        @media (max-width: 600px) {
          .category-page {
            padding: 80px 17px 40px;
          }

          .hero {
            padding: 25px;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
