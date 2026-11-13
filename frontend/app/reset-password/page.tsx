
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/forgot-password");
  }, [router]);

  return (
    <main className="redirect-page">
      <div className="redirect-card">
        <div className="icon">🔐</div>
        <h1>Secure Password Recovery</h1>
        <p>Redirecting you to the password recovery page...</p>
      </div>

      <style jsx>{`
        .redirect-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #090d18;
          color: white;
          text-align: center;
        }

        .redirect-card {
          width: 100%;
          max-width: 420px;
          padding: 35px 25px;
          background: #111a2a;
          border: 1px solid #29364c;
          border-radius: 20px;
        }

        .icon {
          font-size: 48px;
          margin-bottom: 18px;
        }

        h1 {
          font-size: 23px;
          margin-bottom: 12px;
        }

        p {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.7;
        }
      `}</style>
    </main>
  );
}
