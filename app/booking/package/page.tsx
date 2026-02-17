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
    const ticker = setInterval(updateDateTime, 60000);
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

  useEffect(() => {
    setFlow(readFlowState());
    setIsFlowLoaded(true);
  }, []);

  useEffect(() => {
    if (!isFlowLoaded) return;
    writeFlowState(flow);
  }, [flow, isFlowLoaded]);

  const selectedPackage = useMemo(
    () => PACKAGES.find((item) => item.id === flow.selectedPackageId) ?? null,
    [flow.selectedPackageId]
  );

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
              <span>{displayDate}</span>
            </div>
          </header>

          <button type="button" className="back cursor-pointer" onClick={() => router.push("/booking/experience")}>{"<-"} Go Back</button>

          <div className="content package-content">
            <p className="label package-label">CHOOSE A PACKAGE</p>
            <div className="grid two">
              {PACKAGES.map((item) => (
                <button
                  type="button"
                  className={`pack-card ${flow.selectedPackageId === item.id ? "active" : ""}`}
                  key={item.id}
                  onClick={() => setFlow((prev) => ({ ...prev, selectedPackageId: item.id }))}
                >
                  <div className="pack-image-shell">
                    <div
                      className={`pack-image ${item.imageMode === "contain" ? "contain" : ""}`}
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  </div>
                  <p className="pack-title">{item.title}</p>
                  <p className="pack-subtitle">{item.subtitle}</p>
                  <div className="pack-row">
                    <strong>{formatAED(item.price)}</strong>
                    <span>VIEW DETAILS -&gt;</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`cta package-continue-btn ${selectedPackage ? "is-enabled" : "disabled"}`}
              disabled={!selectedPackage}
              onClick={() => router.push("/booking/datetime")}
            >
              Continue
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}


