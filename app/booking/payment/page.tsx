"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PACKAGES, type FlowState, formatAED, getDefaultFlowState, readFlowState, todayClock, writeFlowState } from "../shared";

export default function Page() {
  const router = useRouter();
  const [clock, setClock] = useState<string>("--:--");
  const [displayDate, setDisplayDate] = useState<string>("");
  const [scale, setScale] = useState<number>(1);
  const [isFlowLoaded, setIsFlowLoaded] = useState<boolean>(false);
  const [flow, setFlow] = useState<FlowState>(() => getDefaultFlowState());

  useEffect(() => {
    const updateDateTime = () => {
      setClock(todayClock());
      setDisplayDate(new Date().toLocaleDateString("en-GB"));
    };
    updateDateTime();
    const t = setInterval(updateDateTime, 60000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { const u = () => { const wr = (window.innerWidth - 24) / 1080; const hr = (window.innerHeight - 24) / 1920; setScale(Math.min(wr, hr, 1)); }; u(); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  useEffect(() => {
    setFlow(readFlowState());
    setIsFlowLoaded(true);
  }, []);
  useEffect(() => {
    if (!isFlowLoaded) return;
    writeFlowState(flow);
  }, [flow, isFlowLoaded]);

  const unitCost = useMemo(() => (PACKAGES.find((item) => item.id === flow.selectedPackageId)?.price ?? 309), [flow.selectedPackageId]);
  const subtotal = flow.adults * unitCost + flow.children * Math.round(unitCost * 0.7);
  const total = subtotal + subtotal * 0.05;

  return (
    <main className="app-shell min-h-screen grid place-items-center p-2.5"><div className="scaled-wrapper h-full w-full grid place-items-center overflow-auto"><section className="screen relative" style={{ transform: `scale(${scale})` }}>
      <header className="screen-header mb-10.5 flex items-center justify-between"><div className="logo-block"><h1>EMAAR</h1><p>ENTERTAINMENT</p></div><div className="meta flex items-center"><span>{clock}</span><span>|</span><span>{displayDate}</span></div></header>
      <button type="button" className="back cursor-pointer" onClick={() => router.push("/booking/contact")}>{"<-"} Go Back</button>
      <div className="content payment">
        <p className="pay-title">TAP OR SCAN YOUR CARD</p>
        <div className="card-machine mx-auto">
          <div className="card-slot" aria-hidden="true" />
          <div className="scan-card" aria-hidden="true">
            <span className="scan-expiry-label">Expiry Date</span>
            <span className="scan-expiry-value">DD/MM</span>
            <span className="scan-number-label">Card Number</span>
            <span className="scan-number">2243 6652 9435 9982</span>
            <span className="scan-chip" />
            <span className="scan-brand">VISA</span>
            <span className="scan-credit-label">Credit Card</span>
          </div>
        </div>
        <p className="wait">Awaiting payment confirmation...</p>
        <button type="button" className="cta pay active" onClick={() => router.push("/booking/success")}>Total Payment {formatAED(total)}</button>
        <p className="secure">Your payment is encrypted and secure. We never store your card details.</p>
      </div>
    </section></div></main>
  );
}


