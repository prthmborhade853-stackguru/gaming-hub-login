
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const products = [
  {
    id: "1",
    name: "Wireless Gaming Controller",
    category: "Controllers",
    price: 2499,
    icon: "🎮",
    description:
      "Experience smooth and responsive gaming with this wireless controller. Designed for comfort, precision and long gaming sessions.",
  },
  {
    id: "2",
    name: "RGB Mechanical Keyboard",
    category: "Keyboards",
    price: 1999,
    icon: "⌨️",
    description:
      "A mechanical gaming keyboard with RGB lighting, responsive keys and a durable design for an enhanced gaming experience.",
  },
  {
    id: "3",
    name: "Pro Gaming Headset",
    category: "Headsets",
    price: 1799,
    icon: "🎧",
    description:
      "Enjoy immersive sound, clear communication and comfortable ear cushions during your gaming sessions.",
  },
  {
    id: "4",
    name: "Precision Gaming Mouse",
    category: "Mice",
    price: 999,
    icon: "🖱️",
    description:
      "Improve your gaming accuracy with a precision gaming mouse featuring responsive controls and an ergonomic design.",
  },
  {
    id: "5",
    name: "RGB Gaming Mousepad",
    category: "Accessories",
    price: 699,
    icon: "🟪",
    description:
      "A smooth gaming surface with RGB styling, designed to support precise mouse movement.",
  },
  {
    id: "6",
    name: "Pro Wireless Controller",
    category: "Controllers",
    price: 3299,
    icon: "🕹️",
    description:
      "A premium wireless controller built for comfortable handling, accurate controls and extended gaming sessions.",
  },
];

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);

  const product = products.find(
    (p) => p.id === String(params.id)
  );

  if (!product) {
    return (
      <main className="details-page">
        <h1>Product Not Found</h1>

        <button onClick={() => router.push("/products")}>
          Back to Products
        </button>
      </main>
    );
  }

  // Store product ID after checking that product exists.
  // This fixes TypeScript error TS18048.
  const productId = product.id;

  function addToCart() {
    try {
      const savedCart = localStorage.getItem("gamingHubCart");

      const cart: string[] = savedCart
        ? JSON.parse(savedCart)
        : [];

      if (!Array.isArray(cart)) {
        throw new Error("Invalid cart data");
      }

      for (let i = 0; i < quantity; i++) {
        cart.push(productId);
      }

      localStorage.setItem(
        "gamingHubCart",
        JSON.stringify(cart)
      );

      alert("Product added to cart!");
    } catch (error) {
      console.error("Cart error:", error);
      alert("Unable to add product to cart.");
    }
  }

  return (
    <main className="details-page">
      <style jsx>{`
        .details-page {
          min-height: 100vh;
          padding: 50px 7%;
          background: #080b14;
          color: #f5f7ff;
        }

        .back {
          background: transparent;
          color: #38e8f5;
          border: 1px solid #38e8f5;
          padding: 10px 18px;
          border-radius: 9px;
          cursor: pointer;
          margin-bottom: 35px;
        }

        .details-card {
          max-width: 1050px;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 45px;
          align-items: center;
          background: #111725;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 22px;
          padding: 35px;
        }

        .product-art {
          min-height: 370px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #171f30, #252044);
          border-radius: 18px;
          font-size: 130px;
        }

        .category {
          color: #38e8f5;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        h1 {
          font-size: 34px;
          margin: 15px 0;
        }

        .description {
          color: #9ba6bb;
          line-height: 1.8;
          margin: 20px 0;
        }

        .price {
          font-size: 30px;
          font-weight: bold;
          color: #38e8f5;
          margin: 20px 0;
        }

        .quantity {
          display: flex;
          align-items: center;
          gap: 18px;
          margin: 25px 0;
        }

        .quantity button {
          width: 35px;
          height: 35px;
          border: 1px solid #38e8f5;
          border-radius: 8px;
          background: transparent;
          color: white;
          cursor: pointer;
        }

        .add-button {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #38e8f5, #9b78ff);
          color: #080b14;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
        }

        .add-button:hover {
          opacity: .85;
        }

        @media (max-width: 700px) {
          .details-card {
            grid-template-columns: 1fr;
            padding: 20px;
          }

          .product-art {
            min-height: 250px;
            font-size: 90px;
          }

          h1 {
            font-size: 27px;
          }
        }
      `}</style>

      <button
        className="back"
        onClick={() => router.push("/products")}
      >
        ← Back to Products
      </button>

      <section className="details-card">
        <div className="product-art">
          {product.icon}
        </div>

        <div>
          <span className="category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="description">
            {product.description}
          </p>

          <div className="price">
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          <div className="quantity">
            <strong>Quantity:</strong>

            <button
              onClick={() =>
                setQuantity(Math.max(1, quantity - 1))
              }
            >
              -
            </button>

            <strong>{quantity}</strong>

            <button
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            className="add-button"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
      </section>
    </main>
  );
}
