"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PACKAGES, type FlowState, formatAED, readFlowState, todayClock, writeFlowState } from "../shared";

export default function Page() {
  const router = useRouter();
  const [clock, setClock] = useState<string>(todayClock());
  const [scale, setScale] = useState<number>(1);
  const [flow, setFlow] = useState<FlowState>(() => readFlowState());

  useEffect(() => {
    const ticker = setInterval(() => setClock(todayClock()), 60000);
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
  useEffect(() => writeFlowState(flow), [flow]);

  const unitCost = useMemo(() => (PACKAGES.find((item) => item.id === flow.selectedPackageId)?.price ?? 309), [flow.selectedPackageId]);
  const total = flow.adults + flow.children;
  const canProceed = total > 0;

  const adjust = (field: "adults" | "children", diff: number) => {
    if (diff > 0 && total >= 8) return;
    setFlow((prev) => ({ ...prev, [field]: Math.max(0, prev[field] + diff) }));
  };

  return (
    <main className="app-shell min-h-screen grid place-items-center p-2.5"><div className="scaled-wrapper h-full w-full grid place-items-center overflow-auto"><section className="screen relative" style={{ transform: `scale(${scale})` }}>
      <header className="screen-header mb-10.5 flex items-center justify-between"><div className="logo-block"><h1>EMAAR</h1><p>ENTERTAINMENT</p></div><div className="meta flex items-center"><span>{clock}</span><span>|</span><span>{new Date().toLocaleDateString("en-GB")}</span></div></header>
      <button type="button" className="back cursor-pointer" onClick={() => router.push("/booking/datetime")}>{"<-"} Go Back</button>
      <div className="content">
        <p className="label">SELECT TICKETS</p>
        <p className="subline">You can add up to 8 people, including yourself.</p>
        <div className="counter-wrap"><button type="button" className="count-btn" onClick={() => adjust("adults", -1)}>-</button><span className="count-value">{flow.adults}</span><button type="button" className="count-btn" onClick={() => adjust("adults", 1)}>+</button></div>
        <p className="ticket-title">ADULTS</p><p className="ticket-note">Aged 13 or above</p><p className="price">{formatAED(unitCost)}</p>
        {!flow.childrenEnabled ? (
          <button type="button" className="mini-btn" onClick={() => setFlow((prev) => ({ ...prev, childrenEnabled: true }))}>Add Children</button>
        ) : (
          <>
            <div className="counter-wrap compact"><button type="button" className="count-btn" onClick={() => adjust("children", -1)}>-</button><span className="count-value">{flow.children}</span><button type="button" className="count-btn" onClick={() => adjust("children", 1)}>+</button></div>
            <p className="ticket-title">CHILDREN</p><p className="ticket-note">Aged 3 to 12</p><p className="price">{formatAED(Math.round(unitCost * 0.7))}</p>
          </>
        )}
        <button type="button" className={`cta pay ${canProceed ? "active" : "disabled"}`} disabled={!canProceed} onClick={() => router.push("/booking/summary")}>{canProceed ? `Payable Amount ${formatAED(flow.adults * unitCost + flow.children * Math.round(unitCost * 0.7) + (flow.adults * unitCost + flow.children * Math.round(unitCost * 0.7)) * 0.05)}` : "Proceed To Payment"}</button>
      </div>
    </section></div></main>
  );
}


