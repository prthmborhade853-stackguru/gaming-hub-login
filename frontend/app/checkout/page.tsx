

"use client";



import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";



type Product = {

  id: number;

  name: string;

  category: string;

  price: number;

  icon: string;

};



const products: Product[] = [

  { id: 1, name: "Wireless Gaming Controller", category: "Controllers", price: 2499, icon: "🎮" },

  { id: 2, name: "RGB Mechanical Keyboard", category: "Keyboards", price: 1999, icon: "⌨️" },

  { id: 3, name: "Pro Gaming Headset", category: "Headsets", price: 1799, icon: "🎧" },

  { id: 4, name: "Precision Gaming Mouse", category: "Mice", price: 999, icon: "🖱️" },

  { id: 5, name: "RGB Gaming Mousepad", category: "Accessories", price: 699, icon: "🟪" },

  { id: 6, name: "Pro Wireless Controller", category: "Controllers", price: 3299, icon: "🕹️" }

];



type FormData = {

  fullName: string;

  email: string;

  phone: string;

  address: string;

  city: string;

  state: string;

  pincode: string;

};



const initialForm: FormData = {

  fullName: "",

  email: "",

  phone: "",

  address: "",

  city: "",

  state: "",

  pincode: ""

};



export default function CheckoutPage() {

  const router = useRouter();



  const [cartIds, setCartIds] = useState<number[]>([]);

  const [form, setForm] = useState<FormData>(initialForm);

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [loading, setLoading] = useState(false);

  const [loaded, setLoaded] = useState(false);



  useEffect(() => {

    try {

      const savedCart = JSON.parse(

        localStorage.getItem("gamingHubCart") || "[]"

      );



      if (Array.isArray(savedCart)) {

        setCartIds(

          savedCart.filter(

            (id): id is number =>

              typeof id === "number" &&

              products.some((product) => product.id === id)

          )

        );

      }

    } catch {

      setCartIds([]);

    }



    setLoaded(true);

  }, []);



  const cartItems = useMemo(() => {

    return products

      .map((product) => ({

        ...product,

        quantity: cartIds.filter((id) => id === product.id).length

      }))

      .filter((item) => item.quantity > 0);

  }, [cartIds]);



  const subtotal = cartItems.reduce(

    (sum, item) => sum + item.price * item.quantity,

    0

  );



  const shipping = subtotal === 0 || subtotal >= 3000 ? 0 : 99;

  const total = subtotal + shipping;



  function handleChange(field: keyof FormData, value: string) {

    setForm((previous) => ({ ...previous, [field]: value }));



    if (errors[field]) {

      setErrors((previous) => ({ ...previous, [field]: "" }));

    }

  }



  function validateForm() {

    const newErrors: Partial<FormData> = {};



    if (form.fullName.trim().length < 3) {

      newErrors.fullName = "Enter your full name (at least 3 characters).";

    }



    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {

      newErrors.email = "Enter a valid email address.";

    }



    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {

      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";

    }



    if (form.address.trim().length < 8) {

      newErrors.address = "Enter your complete delivery address.";

    }



    if (form.city.trim().length < 2) {

      newErrors.city = "Enter your city.";

    }



    if (form.state.trim().length < 2) {

      newErrors.state = "Enter your state.";

    }



    if (!/^\d{6}$/.test(form.pincode.trim())) {

      newErrors.pincode = "Enter a valid 6-digit PIN code.";

    }



    setErrors(newErrors);



    return Object.keys(newErrors).length === 0;

  }



  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add products first.");
      router.push("/products");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("gamingHubToken");

    if (!token) {
      alert("Please login before placing your order.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer: form,
          products: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to place your order.");
      }

      const order = {
        orderId: data.orderId,
        customer: form,
        products: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          icon: item.icon,
        })),
        subtotal: data.subtotal ?? subtotal,
        shipping: data.shippingAmount ?? shipping,
        shippingAmount: data.shippingAmount ?? shipping,
        totalAmount: data.totalAmount,
        paymentMethod: "Cash on Delivery",
        status: data.status || "Placed",
        createdAt: new Date().toISOString(),
      };

      // Keep the latest order available for the existing confirmation page.
      localStorage.setItem("gamingHubLastOrder", JSON.stringify(order));

      // Keep the existing local admin demo page compatible until it is
      // connected to the backend order-management API.
      const previousOrders = JSON.parse(
        localStorage.getItem("gamingHubDemoOrders") || "[]"
      );

      const updatedOrders = Array.isArray(previousOrders)
        ? [...previousOrders, order]
        : [order];

      localStorage.setItem(
        "gamingHubDemoOrders",
        JSON.stringify(updatedOrders)
      );

      // Clear the cart only after the backend confirms order creation.
      localStorage.setItem("gamingHubCart", JSON.stringify([]));

      router.push(`/order-confirmation/${data.orderId}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to place your order. Please try again.";

      alert(message);
      setLoading(false);
    }
  }


  if (!loaded) {

    return (

      <main className="checkout-page">

        <p>Loading checkout...</p>

        <style jsx>{`

          .checkout-page {

            min-height: 100vh;

            background: #090d18;

            color: white;

            padding: 120px 20px;

            text-align: center;

          }

        `}</style>

      </main>

    );

  }



  if (cartItems.length === 0) {

    return (

      <main className="checkout-page">

        <section className="empty-cart">

          <h1>Your cart is empty 🛒</h1>

          <p>Add some gaming products before proceeding to checkout.</p>

          <button type="button" onClick={() => router.push("/products")}>

            Browse Products

          </button>

        </section>



        <style jsx>{`

          .checkout-page {

            min-height: 100vh;

            background: #090d18;

            color: white;

            display: grid;

            place-items: center;

            padding: 100px 20px;

          }

          .empty-cart {

            text-align: center;

            max-width: 500px;

          }

          .empty-cart p {

            color: #94a3b8;

            margin: 15px 0 25px;

          }

          button {

            background: #7c3aed;

            color: white;

            border: 0;

            padding: 13px 22px;

            border-radius: 9px;

            cursor: pointer;

          }

        `}</style>

      </main>

    );

  }



  return (

    <main className="checkout-page">

      <header className="page-header">

        <span className="eyebrow">GAMING HUB</span>

        <h1>Secure Checkout</h1>

        <p>Complete your delivery details to place your order.</p>

      </header>



      <form className="checkout-layout" onSubmit={placeOrder}>

        <section className="form-section">

          <div className="form-card">

            <h2>01. Delivery Information</h2>

            <p className="section-description">

              Enter the details where you want your order delivered.

            </p>



            <div className="form-grid">

              <div className="field full">

                <label>Full Name *</label>

                <input

                  value={form.fullName}

                  onChange={(e) => handleChange("fullName", e.target.value)}

                  placeholder="Enter your full name"

                />

                {errors.fullName && <small>{errors.fullName}</small>}

              </div>



              <div className="field">

                <label>Email Address *</label>

                <input

                  type="email"

                  value={form.email}

                  onChange={(e) => handleChange("email", e.target.value)}

                  placeholder="example@gmail.com"

                />

                {errors.email && <small>{errors.email}</small>}

              </div>



              <div className="field">

                <label>Mobile Number *</label>

                <input

                  type="tel"

                  maxLength={10}

                  value={form.phone}

                  onChange={(e) =>

                    handleChange("phone", e.target.value.replace(/\D/g, ""))

                  }

                  placeholder="10-digit mobile number"

                />

                {errors.phone && <small>{errors.phone}</small>}

              </div>



              <div className="field full">

                <label>Full Address *</label>

                <textarea

                  rows={3}

                  value={form.address}

                  onChange={(e) => handleChange("address", e.target.value)}

                  placeholder="House number, street, area, landmark..."

                />

                {errors.address && <small>{errors.address}</small>}

              </div>



              <div className="field">

                <label>City *</label>

                <input

                  value={form.city}

                  onChange={(e) => handleChange("city", e.target.value)}

                  placeholder="Enter city"

                />

                {errors.city && <small>{errors.city}</small>}

              </div>



              <div className="field">

                <label>State *</label>

                <input

                  value={form.state}

                  onChange={(e) => handleChange("state", e.target.value)}

                  placeholder="Enter state"

                />

                {errors.state && <small>{errors.state}</small>}

              </div>



              <div className="field">

                <label>PIN Code *</label>

                <input

                  inputMode="numeric"

                  maxLength={6}

                  value={form.pincode}

                  onChange={(e) =>

                    handleChange("pincode", e.target.value.replace(/\D/g, ""))

                  }

                  placeholder="6-digit PIN code"

                />

                {errors.pincode && <small>{errors.pincode}</small>}

              </div>

            </div>

          </div>



          <div className="form-card payment-card">

            <h2>02. Payment Method</h2>



            <div className="payment-option">

              <span className="payment-icon">💵</span>

              <div>

                <strong>Cash on Delivery (COD)</strong>

                <p>Pay when your order arrives at your doorstep.</p>

              </div>

              <span className="selected">✓</span>

            </div>

          </div>

        </section>



        <aside className="order-summary">

          <h2>Order Summary</h2>

          <p className="section-description">

            {cartIds.length} item(s) in your cart

          </p>



          <div className="order-products">

            {cartItems.map((item) => (

              <div className="order-product" key={item.id}>

                <span className="order-icon">{item.icon}</span>

                <div className="order-product-info">

                  <strong>{item.name}</strong>

                  <span>Qty: {item.quantity}</span>

                </div>

                <strong>

                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}

                </strong>

              </div>

            ))}

          </div>



          <div className="summary-row">

            <span>Subtotal</span>

            <strong>₹{subtotal.toLocaleString("en-IN")}</strong>

          </div>



          <div className="summary-row">

            <span>Shipping</span>

            <strong>

              {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}

            </strong>

          </div>



          <div className="summary-divider" />



          <div className="total-row">

            <span>Total Amount</span>

            <strong>₹{total.toLocaleString("en-IN")}</strong>

          </div>



          <button className="place-order-btn" type="submit" disabled={loading}>

            {loading ? "Placing Order..." : "Place Order →"}

          </button>



          <p className="secure-note">🔒 Your order details are kept secure.</p>



          <button

            type="button"

            className="back-cart"

            onClick={() => router.push("/cart")}

          >

            ← Back to Cart

          </button>

        </aside>

      </form>



      <style jsx>{`

        .checkout-page {

          min-height: 100vh;

          padding: 90px 6% 65px;

          background: #090d18;

          color: #f8fafc;

        }



        .page-header {

          margin-bottom: 35px;

        }



        .eyebrow {

          color: #a78bfa;

          font-size: 12px;

          font-weight: bold;

          letter-spacing: 3px;

        }



        .page-header h1 {

          font-size: clamp(32px, 5vw, 46px);

          margin: 12px 0;

          background: linear-gradient(90deg, #c4b5fd, #60a5fa);

          background-clip: text;

          color: transparent;

        }



        .page-header p,

        .section-description {

          color: #94a3b8;

          font-size: 14px;

        }



        .checkout-layout {

          display: grid;

          grid-template-columns: minmax(0, 1fr) 360px;

          align-items: start;

          gap: 28px;

        }



        .form-section {

          display: grid;

          gap: 22px;

        }



        .form-card,

        .order-summary {

          padding: 25px;

          border: 1px solid #29364c;

          border-radius: 16px;

          background: #111a2a;

        }



        .form-card h2,

        .order-summary h2 {

          font-size: 21px;

          margin-bottom: 9px;

        }



        .section-description {

          margin-bottom: 22px;

        }



        .form-grid {

          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 20px;

        }



        .field {

          display: flex;

          flex-direction: column;

          gap: 8px;

        }



        .field.full {

          grid-column: 1 / -1;

        }



        .field label {

          font-size: 13px;

          color: #cbd5e1;

        }



        .field input,

        .field textarea {

          width: 100%;

          padding: 13px;

          background: #0b1220;

          border: 1px solid #334155;

          border-radius: 8px;

          color: white;

          font: inherit;

          outline: none;

        }



        .field input:focus,

        .field textarea:focus {

          border-color: #8b5cf6;

        }



        .field textarea {

          resize: vertical;

        }



        .field small {

          color: #fb7185;

          font-size: 12px;

        }



        .payment-option {

          display: flex;

          align-items: center;

          gap: 14px;

          padding: 17px;

          background: #0b1220;

          border: 1px solid #7c3aed;

          border-radius: 10px;

        }



        .payment-icon {

          font-size: 27px;

        }



        .payment-option strong {

          font-size: 14px;

        }



        .payment-option p {

          color: #94a3b8;

          font-size: 12px;

          margin-top: 5px;

        }



        .selected {

          margin-left: auto;

          color: #86efac;

          font-size: 20px;

        }



        .order-summary {

          position: sticky;

          top: 25px;

        }



        .order-products {

          display: grid;

          gap: 17px;

          padding: 5px 0 20px;

          margin-bottom: 20px;

          border-bottom: 1px solid #334155;

        }



        .order-product {

          display: flex;

          align-items: center;

          gap: 10px;

          font-size: 12px;

        }



        .order-icon {

          width: 42px;

          height: 42px;

          display: grid;

          place-items: center;

          background: #211c42;

          border-radius: 8px;

          font-size: 22px;

        }



        .order-product-info {

          flex: 1;

          display: grid;

          gap: 5px;

        }



        .order-product-info span {

          color: #94a3b8;

        }



        .order-product > strong:last-child {

          color: #c4b5fd;

          white-space: nowrap;

        }



        .summary-row,

        .total-row {

          display: flex;

          justify-content: space-between;

          gap: 10px;

          margin: 17px 0;

          font-size: 14px;

          color: #cbd5e1;

        }



        .summary-divider {

          border-top: 1px solid #334155;

          margin: 20px 0;

        }



        .total-row {

          font-size: 16px;

          align-items: center;

        }



        .total-row strong {

          color: #c4b5fd;

          font-size: 24px;

        }



        .place-order-btn {

          width: 100%;

          padding: 15px;

          margin-top: 15px;

          background: #7c3aed;

          color: white;

          border: none;

          border-radius: 9px;

          font-weight: bold;

          cursor: pointer;

        }



        .place-order-btn:disabled {

          opacity: 0.6;

          cursor: not-allowed;

        }



        .secure-note {

          color: #94a3b8;

          text-align: center;

          font-size: 12px;

          margin: 17px 0;

        }



        .back-cart {

          display: block;

          margin: auto;

          background: transparent;

          border: none;

          color: #c4b5fd;

          cursor: pointer;

        }



        @media (max-width: 900px) {

          .checkout-layout {

            grid-template-columns: 1fr;

          }



          .order-summary {

            position: static;

          }

        }



        @media (max-width: 550px) {

          .checkout-page {

            padding: 85px 15px 40px;

          }



          .form-card,

          .order-summary {

            padding: 18px;

          }



          .form-grid {

            grid-template-columns: 1fr;

          }



          .field.full {

            grid-column: auto;

          }

        }

      `}</style>

    </main>

  );

}
