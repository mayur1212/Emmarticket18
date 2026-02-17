"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ATTRACTIONS, PACKAGES, type FlowState, formatAED, readFlowState, todayClock, writeFlowState } from "../shared";

export default function Page() {
  const router = useRouter();
  const [clock, setClock] = useState<string>(todayClock());
  const [scale, setScale] = useState<number>(1);
  const [flow] = useState<FlowState>(() => readFlowState());

  useEffect(() => { const t = setInterval(() => setClock(todayClock()), 60000); return () => clearInterval(t); }, []);
  useEffect(() => { const u = () => { const wr = (window.innerWidth - 24) / 1080; const hr = (window.innerHeight - 24) / 1920; setScale(Math.min(wr, hr, 1)); }; u(); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  useEffect(() => writeFlowState(flow), [flow]);

  const selectedPackage = PACKAGES.find((p) => p.id === flow.selectedPackageId) ?? PACKAGES[2];
  const selectedAttraction = ATTRACTIONS.find((a) => a.id === flow.selectedAttractionId) ?? ATTRACTIONS[0];
  const unitCost = selectedPackage.price;
  const subtotal = flow.adults * unitCost + flow.children * Math.round(unitCost * 0.7);
  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  return (
    <main className="app-shell min-h-screen grid place-items-center p-2.5"><div className="scaled-wrapper h-full w-full grid place-items-center overflow-auto"><section className="screen relative" style={{ transform: `scale(${scale})` }}>
      <header className="screen-header mb-10.5 flex items-center justify-between"><div className="logo-block"><h1>EMAAR</h1><p>ENTERTAINMENT</p></div><div className="meta flex items-center"><span>{clock}</span><span>|</span><span>{new Date().toLocaleDateString("en-GB")}</span></div></header>
      <button type="button" className="back cursor-pointer" onClick={() => router.push("/booking/tickets")}>{"<-"} Go Back</button>
      <div className="content">
        <article className="summary-card"><div className="summary-image" style={{ backgroundImage: `url(${selectedPackage.image})` }} /><div><h3>{selectedPackage.title ?? `${selectedAttraction.title} Combo`}</h3><p>{flow.selectedDate}, {flow.selectedSlot}</p></div></article>
        <div className="bill">
          <div><span>Unit Cost</span><strong>{formatAED(unitCost)}</strong></div>
          <div><span>Adults</span><strong>{flow.adults}</strong></div>
          <div><span>Children</span><strong>{flow.children}</strong></div>
          <div><span>Subtotal</span><strong>{formatAED(subtotal)}</strong></div>
          <div><span>Charges and fee (+5% VAT)</span><strong>{formatAED(vat)}</strong></div>
          <div className="bill-total"><span>Total</span><strong>{formatAED(total)}</strong></div>
        </div>
        <div className="actions two"><button type="button" className="secondary" onClick={() => router.push("/booking/tickets")}>Cancel</button><button type="button" className="primary" onClick={() => router.push("/booking/contact")}>Proceed To Pay</button></div>
      </div>
    </section></div></main>
  );
}


