
import Link from "next/link";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#080b14] text-white p-10">

      <Link href="/" className="text-cyan-400">
        ← Back to Home
      </Link>

      <h1 className="text-4xl font-bold mt-8">
        My Shopping Cart 🛒
      </h1>

      <p className="text-gray-400 mt-4">
        Your shopping cart is currently empty.
      </p>

      <Link
        href="/products"
        className="inline-block bg-cyan-500 text-black px-6 py-3 rounded-lg mt-6 font-semibold"
      >
        Continue Shopping
      </Link>

    </main>
  );
}

