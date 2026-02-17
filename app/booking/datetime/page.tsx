"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DATE_COUNT,
  SLOT_OPTIONS,
  type FlowState,
  type SlotPeriod,
  futureDates,
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
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isFlowLoaded, setIsFlowLoaded] = useState<boolean>(false);
  const [flow, setFlow] = useState<FlowState>(() => getDefaultFlowState());
  const filterRef = useRef<HTMLDivElement | null>(null);
  const allDates = useMemo(() => futureDates(DATE_COUNT), []);
  const slotFilterLabels: Record<SlotPeriod, string> = {
    all: "All",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
  };

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

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const filteredSlots = useMemo(() => {
    if (flow.slotFilter === "all") return SLOT_OPTIONS;
    return SLOT_OPTIONS.filter((slot) => slot.period === flow.slotFilter);
  }, [flow.slotFilter]);

  const onFilter = (next: SlotPeriod) => {
    const nextSlots = next === "all" ? SLOT_OPTIONS : SLOT_OPTIONS.filter((s) => s.period === next);
    setFlow((prev) => ({
      ...prev,
      slotFilter: next,
      selectedSlot: nextSlots.some((s) => s.time === prev.selectedSlot) ? prev.selectedSlot : (nextSlots[0]?.time ?? prev.selectedSlot),
    }));
  };

  return (
    <main className="app-shell min-h-screen grid place-items-center p-2.5">
      <div className="scaled-wrapper h-full w-full grid place-items-center overflow-auto">
        <section className="screen relative" style={{ transform: `scale(${scale})` }}>
          <header className="screen-header mb-10.5 flex items-center justify-between">
            <div className="logo-block"><h1>EMAAR</h1><p>ENTERTAINMENT</p></div>
            <div className="meta flex items-center"><span>{clock}</span><span>|</span><span>{displayDate}</span></div>
          </header>

          <button type="button" className="back cursor-pointer" onClick={() => router.push("/booking/package")}>{"<-"} Go Back</button>

          <div className="content">
            <p className="label">SELECT DATE & TIME</p>
            <p className="subline">Choose a date:</p>
            <div className="date-list">
              {allDates.map((date, index) => (
                <button
                  type="button"
                  key={date}
                  className={`date-pill ${flow.selectedDate === date ? "active" : ""}`}
                  onClick={() => setFlow((prev) => ({ ...prev, selectedDate: date }))}
                >
                  {index === 0 ? `TODAY | ${date}` : date.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="slots-head">
              <p className="subline">Available Slots</p>
              <div className="slot-filter" ref={filterRef}>
                <button
                  type="button"
                  className="slot-filter-btn"
                  aria-haspopup="listbox"
                  aria-expanded={isFilterOpen}
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                >
                  <span>{slotFilterLabels[flow.slotFilter]}</span>
                  <span className="slot-filter-caret">v</span>
                </button>
                {isFilterOpen ? (
                  <div className="slot-filter-menu" role="listbox" aria-label="Slot period filter">
                    {(Object.keys(slotFilterLabels) as SlotPeriod[]).map((period) => (
                      <button
                        key={period}
                        type="button"
                        role="option"
                        aria-selected={flow.slotFilter === period}
                        className={`slot-filter-option ${flow.slotFilter === period ? "active" : ""}`}
                        onClick={() => {
                          onFilter(period);
                          setIsFilterOpen(false);
                        }}
                      >
                        {slotFilterLabels[period]}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid three">
              {filteredSlots.map((slot) => (
                <button
                  type="button"
                  key={slot.time}
                  className={`slot ${flow.selectedSlot === slot.time ? "active" : ""}`}
                  onClick={() => setFlow((prev) => ({ ...prev, selectedSlot: slot.time }))}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            <button type="button" className="cta datetime-continue-btn is-enabled" onClick={() => router.push("/booking/tickets")}>Continue To Selecting Tickets</button>
          </div>
        </section>
      </div>
    </main>
  );
}


