"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type FlowState, getDefaultFlowState, readFlowState, todayClock, validateEmail, validateName, validatePhone, writeFlowState } from "../shared";

export default function Page() {
  const router = useRouter();
  const [clock, setClock] = useState<string>("--:--");
  const [displayDate, setDisplayDate] = useState<string>("");
  const [scale, setScale] = useState<number>(1);
  const [isFlowLoaded, setIsFlowLoaded] = useState<boolean>(false);
  const [flow, setFlow] = useState<FlowState>(() => getDefaultFlowState());
  const [contactTouched, setContactTouched] = useState({ fullName: false, phone: false, email: false });
  const [attempted, setAttempted] = useState(false);

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

  const fullNameError = validateName(flow.fullName);
  const phoneError = validatePhone(flow.phone);
  const emailError = validateEmail(flow.email);
  const canProceed = !fullNameError && !phoneError && !emailError;
  const handleFullNameChange = (value: string) => {
    const sanitized = value.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, " ").replace(/^\s+/, "");
    setFlow((prev) => ({ ...prev, fullName: sanitized }));
  };
  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
    setFlow((prev) => ({ ...prev, phone: digitsOnly }));
  };
  const handleEmailChange = (value: string) => {
    const normalized = value.replace(/\s/g, "");
    setFlow((prev) => ({ ...prev, email: normalized }));
  };

  return (
    <main className="app-shell min-h-screen grid place-items-center p-2.5"><div className="scaled-wrapper h-full w-full grid place-items-center overflow-auto"><section className="screen relative" style={{ transform: `scale(${scale})` }}>
      <header className="screen-header mb-10.5 flex items-center justify-between"><div className="logo-block"><h1>EMAAR</h1><p>ENTERTAINMENT</p></div><div className="meta flex items-center"><span>{clock}</span><span>|</span><span>{displayDate}</span></div></header>
      <button type="button" className="back cursor-pointer" onClick={() => router.push("/booking/summary")}>{"<-"} Go Back</button>
      <div className="content contact-content">
        <p className="label">CONTACT DETAILS</p>
        <p className="subline">Enter your contact details to receive your ticket and updates.</p>

        <label className="field-label" htmlFor="fullName">ENTER FULL NAME</label>
        <input id="fullName" type="text" inputMode="text" autoComplete="name" className={`solo ${((contactTouched.fullName || attempted) && fullNameError) ? "input-error" : ""}`} placeholder="Your full name" value={flow.fullName} onChange={(e) => handleFullNameChange(e.target.value)} onBlur={() => setContactTouched((prev) => ({ ...prev, fullName: true }))} />
        {(contactTouched.fullName || attempted) && fullNameError && <p className="field-error">{fullNameError}</p>}

        <label className="field-label" htmlFor="phone">ENTER MOBILE NUMBER</label>
        <div className="field-row"><span className="prefix">UAE +971</span><input id="phone" type="tel" inputMode="numeric" pattern="[0-9]*" autoComplete="tel-national" className={((contactTouched.phone || attempted) && phoneError) ? "input-error" : ""} placeholder="0000000000" value={flow.phone} onChange={(e) => handlePhoneChange(e.target.value)} onBlur={() => setContactTouched((prev) => ({ ...prev, phone: true }))} /></div>
        {(contactTouched.phone || attempted) && phoneError && <p className="field-error">{phoneError}</p>}

        <label className="field-label" htmlFor="email">ENTER EMAIL ADDRESS</label>
        <input id="email" type="email" inputMode="email" autoComplete="email" className={`solo ${((contactTouched.email || attempted) && emailError) ? "input-error" : ""}`} placeholder="name@example.com" value={flow.email} onChange={(e) => handleEmailChange(e.target.value)} onBlur={() => setContactTouched((prev) => ({ ...prev, email: true }))} />
        {(contactTouched.email || attempted) && emailError && <p className="field-error">{emailError}</p>}

        <button
          type="button"
          className={`cta contact-next-btn ${canProceed ? "is-enabled" : "disabled"}`}
          disabled={!canProceed}
          onClick={() => {
            setAttempted(true);
            setContactTouched({ fullName: true, phone: true, email: true });
            if (canProceed) router.push("/booking/payment");
          }}
        >
          Next
        </button>
      </div>
    </section></div></main>
  );
}


