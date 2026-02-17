"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ATTRACTIONS,
  type FlowState,
  getDefaultFlowState,
  readFlowState,
  todayClock,
  writeFlowState,
} from "../shared";

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

  const selectedAttractionId = useMemo(
    () => (ATTRACTIONS.some((item) => item.id === flow.selectedAttractionId) ? flow.selectedAttractionId : ATTRACTIONS[0].id),
    [flow.selectedAttractionId]
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

          <div className="content experience-content">
            <p className="label experience-label">SELECT AN ATTRACTION</p>
            <div className="grid two attraction-grid">
              {ATTRACTIONS.map((item) => (
                <button
                  type="button"
                  className={`attraction-card ${selectedAttractionId === item.id ? "active" : ""}`}
                  key={item.id}
                  onClick={() => {
                    setFlow((prev) => ({ ...prev, selectedAttractionId: item.id }));
                    router.push("/booking/package");
                  }}
                >
                  <div className="attraction-image" style={{ backgroundImage: `url(${item.image})` }} />
                  <p className="attraction-title">{item.title}</p>
                  <div className="attraction-row">
                    <span>{item.availability}</span>
                    <span>VIEW DETAILS -&gt;</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


