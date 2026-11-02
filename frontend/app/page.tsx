
"use client";

import Link from "next/link";

const products = [
  {
    id: 1,
    name: "RGB Mechanical Keyboard",
    category: "Keyboard",
    price: 2499,
    icon: "⌨️",
    description: "Mechanical keys with RGB lighting",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Wireless Gaming Mouse",
    category: "Mouse",
    price: 1299,
    icon: "🖱️",
    description: "High precision gaming sensor",
    tag: "Popular",
  },
  {
    id: 3,
    name: "Gaming Headset",
    category: "Headset",
    price: 1999,
    icon: "🎧",
    description: "Immersive sound with clear mic",
    tag: "New",
  },
  {
    id: 4,
    name: "Wireless Gaming Controller",
    category: "Controller",
    price: 2999,
    icon: "🎮",
    description: "Comfortable wireless gameplay",
    tag: "Trending",
  },
  {
    id: 5,
    name: "Gaming Mouse Pad",
    category: "Accessories",
    price: 599,
    icon: "🖥️",
    description: "Large smooth gaming surface",
    tag: "Value Pick",
  },
  {
    id: 6,
    name: "Gaming Speakers",
    category: "Accessories",
    price: 1799,
    icon: "🔊",
    description: "Powerful stereo gaming audio",
    tag: "Featured",
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#080b14] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <Link
          href="/"
          className="text-cyan-400 hover:text-white"
        >
          ← Back to Home
        </Link>

        <div className="mt-8 mb-10">
          <p className="text-cyan-400 font-semibold">
            GAMING HUB STORE
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Gaming Products
          </h1>

          <p className="text-gray-400 mt-3">
            Explore the best gaming peripherals
            for your gaming setup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-cyan-400 transition"
            >
              <div className="h-44 bg-[#1c2638] rounded-xl flex items-center justify-center text-7xl">
                {product.icon}
              </div>

              <div className="mt-5">
                <span className="text-xs text-cyan-400">
                  {product.tag}
                </span>

                <p className="text-gray-400 text-sm mt-2">
                  {product.category}
                </p>

                <h2 className="text-xl font-bold mt-1">
                  {product.name}
                </h2>

                <p className="text-gray-400 text-sm mt-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mt-5">
                  <span className="text-2xl font-bold text-cyan-400">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  <button className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
