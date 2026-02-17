"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PACKAGES,
  type FlowState,
  clearFlowState,
  formatAED,
  formatReceiptDate,
  getDefaultFlowState,
  readFlowState,
  todayClock,
} from "../shared";

export default function Page() {
  const router = useRouter();
  const [clock, setClock] = useState<string>(todayClock());
  const [scale, setScale] = useState<number>(1);
  const [saved, setSaved] = useState<FlowState>(() => getDefaultFlowState());

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setSaved(readFlowState());
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => {
      setClock(todayClock());
    }, 60000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const widthRatio = (window.innerWidth - 24) / 1080;
      const heightRatio = (window.innerHeight - 24) / 1920;
      setScale(Math.min(widthRatio, heightRatio, 1));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const selectedPackage = PACKAGES.find((item) => item.id === saved.selectedPackageId) ?? PACKAGES[2];

  const adults = saved.adults;
  const children = saved.children;
  const subtotal = adults * selectedPackage.price + children * Math.round(selectedPackage.price * 0.7);
  const total = subtotal + subtotal * 0.05;
  const receiptRef = useMemo(() => {
    const value = Math.round(total * 100) + adults * 17 + children * 9;
    return String(value).padStart(10, "0");
  }, [total, adults, children]);

  return (
    <main className="app-shell min-h-screen grid place-items-center p-2.5">
      <div className="scaled-wrapper h-full w-full grid place-items-center overflow-auto">
        <section className="screen relative" style={{ transform: `scale(${scale})` }}>
          <header className="screen-header mb-10.5 flex items-center justify-between">
            <div className="logo-block">
              <h1>EMAAR</h1>
              <p>ENTERTAINMENT</p>
            </div>
            <div className="meta flex items-center">
              <span>{clock}</span>
              <span>|</span>
              <span>{new Date().toLocaleDateString("en-GB")}</span>
            </div>
          </header>

          <div className="content success-content">
            <div className="success-card receipt-card">
              <div className="success-icon">&#10003;</div>
              <h3>PAYMENT SUCCESS!</h3>
              <p className="success-note">Your payment has been successfully done.</p>
              <div className="receipt-divider" />
              <p className="receipt-total-label">Total Payment</p>
              <strong>{formatAED(total)}</strong>

              <article className="receipt-experience">
                <div
                  className="receipt-image"
                  style={{ backgroundImage: `url(${selectedPackage.image})` }}
                />
                <div className="receipt-meta">
                  <div>
                    <span>Experience:</span>
                    <strong className="truncate-one-line">{selectedPackage.title}</strong>
                  </div>
                    <div>
                      <span>Date:</span>
                      <strong>{formatReceiptDate(saved.selectedDate)}</strong>
                    </div>
                    <div>
                      <span>Time:</span>
                      <strong>{saved.selectedSlot}</strong>
                    </div>
                  <div>
                    <span>No. of people:</span>
                    <strong>
                      {adults} Adult{adults !== 1 ? "s" : ""} | {children} Child
                      {children !== 1 ? "ren" : ""}
                    </strong>
                  </div>
                </div>
              </article>

              <div className="receipt-divider" />
              <p className="receipt-section-title">Payment Details</p>
              <div className="receipt-kv">
                <span>Ref Number</span>
                <strong>{receiptRef}</strong>
              </div>
              <div className="receipt-kv">
                <span>Payment Method</span>
                <strong>Credit Card</strong>
              </div>
              <div className="receipt-kv">
                <span>Sender Name</span>
                <strong>{saved.fullName || "Guest User"}</strong>
              </div>

              <div className="receipt-dash" />
              <div className="receipt-amount">
                <span>Amount</span>
                <strong>{formatAED(total)}</strong>
              </div>
              <div className="receipt-divider" />

              <p className="share">
                <span className="share-icon-box" /> SHARE YOUR TICKET
              </p>
              <div className="ticket-notches" />
            </div>

            <button
              type="button"
              className="cta success-home-btn"
              onClick={() => {
                clearFlowState();
                router.push("/booking/intro");
              }}
            >
              Back To Home
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}


