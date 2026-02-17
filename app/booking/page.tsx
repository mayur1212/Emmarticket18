"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { todayClock } from "./shared";

export default function Page() {
  const router = useRouter();
  const [clock, setClock] = useState<string>(todayClock());
  const [scale, setScale] = useState<number>(1);

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

          <div className="content intro-content">
            <p className="label">QUICK & EASY</p>
            <h2 className="headline intro-headline">Book Your Tickets Here!</h2>
            <button
              type="button"
              className="cta intro-start-btn"
              onClick={() => router.push("/booking/experience")}
            >
              Tap To Start
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}


