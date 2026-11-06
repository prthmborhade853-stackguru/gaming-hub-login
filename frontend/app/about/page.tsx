
import Link from "next/link";

export default function AboutPage() {
  const features = [
    {
      icon: "🎮",
      title: "Gaming Controllers",
      description: "Explore controllers designed for precision and comfortable gameplay.",
    },
    {
      icon: "⌨️",
      title: "Gaming Keyboards",
      description: "Discover mechanical keyboards for responsive gaming experiences.",
    },
    {
      icon: "🎧",
      title: "Gaming Headsets",
      description: "Enjoy immersive audio and communicate with your teammates.",
    },
    {
      icon: "🖱️",
      title: "Gaming Accessories",
      description: "Find accessories that complete your gaming setup.",
    },
  ];

  return (
    <main className="about-page">
      <section className="hero">
        <span className="hero-icon">🎮</span>
        <p className="eyebrow">WELCOME TO THE GAMING WORLD</p>
        <h1>
          ABOUT <span>GAMING HUB</span>
        </h1>
        <p className="hero-description">
          Your ultimate destination for gaming peripherals and accessories.
          Explore gaming products and build your perfect gaming setup.
        </p>
        <Link href="/products" className="shop-button">
          Explore Products →
        </Link>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">WHO WE ARE</p>
          <h2>Level Up Your Gaming Experience</h2>
        </div>

        <div className="about-card">
          <p>
            Gaming Hub is an online shopping platform focused on gaming
            peripherals and accessories. Our goal is to provide a convenient
            platform where gaming enthusiasts can explore products, compare
            options and place orders easily.
          </p>
          <p>
            From controllers and keyboards to headsets and gaming accessories,
            Gaming Hub brings different gaming essentials together in one
            place.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">WHAT WE OFFER</p>
          <h2>Explore Our Categories</h2>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-card">
          <span>🚀</span>
          <h2>Our Mission</h2>
          <p>
            To make gaming products easy to discover and purchase through a
            simple, user-friendly and reliable online shopping experience.
          </p>
        </div>

        <div className="mission-card">
          <span>💡</span>
          <h2>Our Vision</h2>
          <p>
            To build a convenient online destination for gaming enthusiasts
            looking for quality gaming peripherals and accessories.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Upgrade Your Setup?</h2>
        <p>Discover gaming products and find your next favourite gear.</p>
        <Link href="/products" className="shop-button">
          Start Shopping →
        </Link>
      </section>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
          padding: 50px 30px;
          background: #080d1c;
          color: white;
          overflow: hidden;
        }

        .hero {
          max-width: 950px;
          margin: 30px auto 90px;
          text-align: center;
          padding: 55px 25px;
          border: 1px solid #00d9ff55;
          border-radius: 25px;
          background: radial-gradient(
            circle at top,
            #18345c 0%,
            #111a35 45%,
            #080d1c 100%
          );
          box-shadow: 0 0 35px #00d9ff20;
        }

        .hero-icon {
          font-size: 65px;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }

        .eyebrow {
          color: #00eaff;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: bold;
        }

        .hero h1 {
          font-size: clamp(30px, 6vw, 54px);
          margin: 15px 0;
          font-weight: 900;
        }

        .hero h1 span {
          color: #00eaff;
          text-shadow: 0 0 20px #00d9ff88;
        }

        .hero-description {
          max-width: 650px;
          margin: 20px auto 30px;
          color: #b5c4dd;
          line-height: 1.8;
        }

        .shop-button {
          display: inline-block;
          padding: 14px 26px;
          border-radius: 10px;
          background: linear-gradient(90deg, #00d9ff, #8b5cf6);
          color: #07101e;
          text-decoration: none;
          font-weight: bold;
          transition: 0.3s;
        }

        .shop-button:hover {
          transform: scale(1.07);
          box-shadow: 0 0 25px #00d9ff99;
        }

        .content-section {
          max-width: 1100px;
          margin: 0 auto 85px;
        }

        .section-heading {
          text-align: center;
          margin-bottom: 35px;
        }

        .section-heading h2 {
          font-size: clamp(25px, 4vw, 35px);
          margin-top: 10px;
        }

        .about-card {
          padding: 30px;
          background: #111a30;
          border: 1px solid #8b5cf655;
          border-radius: 18px;
          color: #b5c4dd;
          line-height: 1.9;
          box-shadow: 0 0 20px #8b5cf615;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .feature-card {
          padding: 25px 18px;
          text-align: center;
          background: #111a30;
          border: 1px solid #00d9ff44;
          border-radius: 17px;
          transition: 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: #00eaff;
          box-shadow: 0 0 22px #00d9ff55;
        }

        .feature-icon {
          font-size: 42px;
        }

        .feature-card h3 {
          color: #00eaff;
          margin: 15px 0 10px;
          font-size: 17px;
        }

        .feature-card p {
          color: #aebbd2;
          font-size: 13px;
          line-height: 1.7;
        }

        .mission-section {
          max-width: 1100px;
          margin: 0 auto 85px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }

        .mission-card {
          padding: 30px;
          text-align: center;
          border: 1px solid #8b5cf655;
          background: linear-gradient(145deg, #171d3b, #101629);
          border-radius: 18px;
        }

        .mission-card span {
          font-size: 42px;
        }

        .mission-card h2 {
          color: #00eaff;
          margin: 15px 0;
        }

        .mission-card p {
          color: #b5c4dd;
          line-height: 1.8;
        }

        .cta-section {
          max-width: 950px;
          margin: 0 auto;
          padding: 50px 20px;
          text-align: center;
          border-radius: 22px;
          background: linear-gradient(120deg, #142b4c, #291c50);
          border: 1px solid #00d9ff66;
        }

        .cta-section h2 {
          font-size: 30px;
          margin-bottom: 12px;
        }

        .cta-section p {
          color: #b5c4dd;
          margin-bottom: 25px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @media (max-width: 850px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 550px) {
          .about-page {
            padding: 35px 15px;
          }

          .features-grid,
          .mission-section {
            grid-template-columns: 1fr;
          }

          .hero {
            padding: 40px 18px;
          }
        }
      `}</style>
    </main>
  );
}
