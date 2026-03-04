"use client";
import { useState, useRef } from "react";

const RATE = 11;

const sections = [
  {
    id: "01", title: "Project & Backend Setup",
    items: [
      { task: "Initialize React Native / Flutter project with folder structure", hours: 2 },
      { task: "Configure ESLint, Prettier, Git hooks", hours: 1 },
      { task: "Set up mono-repo structure (mobile + backend)", hours: 2 },
      { task: "Configure GitHub repo + branch strategy", hours: 1 },
      { task: "Set up CI/CD pipeline (GitHub Actions)", hours: 3 },
      { task: "Provision cloud server (EC2 / Railway / Render)", hours: 2 },
      { task: "Set up PostgreSQL database (cloud-hosted)", hours: 2 },
      { task: "Configure S3 bucket for photo storage + IAM roles", hours: 3 },
      { task: "Configure env variables + dev / staging / prod environments", hours: 3 },
      { task: "Configure CORS, rate limiting, security headers", hours: 2 },
      { task: "Write base API boilerplate + ORM setup + base migrations", hours: 3 },
    ],
  },
  {
    id: "02", title: "Account & Authentication",
    items: [
      { task: "Design user DB schema", hours: 1 },
      { task: "Build register endpoint (email + password)", hours: 2 },
      { task: "Build login endpoint + return JWT", hours: 2 },
      { task: "JWT middleware (verify token on protected routes)", hours: 2 },
      { task: "Refresh token logic + expiry handling", hours: 2 },
      { task: "Password hashing (bcrypt)", hours: 1 },
      { task: "Password reset — send email with token", hours: 2 },
      { task: "Password reset — validate token + update password", hours: 2 },
      { task: "Google Sign-In — backend verification + mobile SDK", hours: 3 },
      { task: "Sign-up screen UI", hours: 2 },
      { task: "Login screen UI", hours: 2 },
      { task: "Forgot password screen UI", hours: 1 },
      { task: "Auth state management (store token, auto-login on reopen)", hours: 3 },
    ],
  },
  {
    id: "03", title: "Subscription & Payments",
    items: [
      { task: "Create Stripe product + price object ($25/month)", hours: 1 },
      { task: "Backend: create Stripe customer on signup", hours: 2 },
      { task: "Backend: create subscription with 7-day trial", hours: 2 },
      { task: "Stripe webhook (trial end, payment success, failure)", hours: 4 },
      { task: "Payment failure → set user to restricted status", hours: 2 },
      { task: "Access restriction middleware", hours: 2 },
      { task: "Subscription status field in user DB + update logic", hours: 1 },
      { task: "Payment screen UI (card input via Stripe SDK)", hours: 3 },
      { task: "Trial start confirmation screen UI", hours: 1 },
      { task: "Subscription expired / payment failed screen UI", hours: 2 },
							{ task: "Test all payment scenarios in Stripe test mode", hours: 2 },
    ],
  },
  {
    id: "04", title: "Onboarding Flow",
    items: [
      { task: "Design onboarding DB schema", hours: 1 },
      { task: "Build save-onboarding API endpoint", hours: 2 },
      { task: "Build get-onboarding API endpoint (edit support)", hours: 1 },
      { task: "Q1 UI — What is your skin type?", hours: 2 },
      { task: "Q2 UI — What's your main concern?", hours: 2 },
      { task: "Q3 UI — Is your skin sensitive?", hours: 1 },
      { task: "Q4 UI — Do you get puffy?", hours: 1 },
      { task: "Q5 UI — Do you skip your night routine?", hours: 1 },
      { task: "Q6 UI — What's your product budget?", hours: 1 },
      { task: "Progress indicator + transition animations", hours: 2 },
      { task: "Submit onboarding + skip option", hours: 1 },
    ],
  },
  {
    id: "05", title: "Product Catalog",
    items: [
      { task: "Design product DB schema", hours: 1 },
      { task: "Build add / get / edit / delete product API endpoints", hours: 4 },
      { task: "Photo upload — camera + gallery + S3 upload", hours: 4 },
      { task: "Manual entry form UI (name, type, strength)", hours: 3 },
      { task: "Product type selector (Cleanser / Treatment / Moisturizer / SPF / Toner / Serum)", hours: 2 },
      { task: "Product strength selector (Low / Medium / High)", hours: 1 },
      { task: "Product list screen UI (cards with name, type, strength)", hours: 3 },
      { task: "Edit + delete product UI + confirmation dialog", hours: 3 },
      { task: "Empty state when no products added", hours: 1 },
    ],
  },
  {
    id: "06", title: "Baseline Photo",
    items: [
      { task: "Baseline photo DB schema + API endpoint", hours: 2 },
      { task: "Upload to S3 + save URL to user record", hours: 2 },
      { task: "Baseline photo capture screen UI + confirmation", hours: 2 },
      { task: "Skip for now option (remind later)", hours: 1 },
    ],
  },
  {
    id: "07", title: "Daily Check-In — Morning",
    items: [
      { task: "Morning check-in DB schema", hours: 1 },
      { task: "Build save morning check-in + get morning plan API endpoints", hours: 4 },
      { task: "Q1 UI — How did you sleep?", hours: 2 },
      { task: "Q2 UI — Did you drink alcohol?", hours: 1 },
      { task: "Q3 UI — How much water did you drink?", hours: 1 },
      { task: "Q4 UI — Are allergies acting up?", hours: 1 },
      { task: "Q5 UI — How does your skin feel?", hours: 2 },
      { task: "Morning photo upload step UI", hours: 2 },
      { task: "Morning plan output screen UI", hours: 3 },
      { task: "Check-in completed state + view plan again screen", hours: 2 },
    ],
  },
  {
    id: "08", title: "Daily Check-In — Night",
    items: [
      { task: "Night check-in DB schema + API endpoints", hours: 3 },
      { task: "Q1 UI — Tight? Q2 — Oily? Q3 — Irritated? Q4 — Used treatments?", hours: 4 },
      { task: "Night plan output screen UI", hours: 3 },
      { task: "Night check-in completed state", hours: 1 },
    ],
  },
  {
    id: "09", title: "Rule-Based Adjustment Logic",
    items: [
      { task: "Design rule engine DB schema (thresholds, configurable values)", hours: 2 },
      { task: "Build rule evaluator service", hours: 5 },
      { task: "Rule: irritation reported → recovery night", hours: 2 },
      { task: "Rule: X calm days → allow treatment night", hours: 2 },
      { task: "Rule: 2 strong nights → block third", hours: 2 },
      { task: "Rule: alcohol / poor sleep → conservative plan", hours: 2 },
      { task: "Rule: puffy morning → calming plan", hours: 1 },
      { task: "Rule: allergies active → skip treatments", hours: 1 },
      { task: "Rule: low water → hydration focus", hours: 1 },
      { task: "Plan text output mapping (rule → message)", hours: 3 },
      { task: "Rule engine unit tests (all rules)", hours: 4 },
      { task: "Store plan output in DB per check-in", hours: 2 },
    ],
  },
  {
    id: "10", title: "Weekly Summary",
    items: [
      { task: "Weekly summary DB query (aggregate 7 days)", hours: 2 },
      { task: "Build get weekly summary API endpoint", hours: 2 },
      { task: "Count irritation / puffy / calm days logic", hours: 2 },
      { task: "Contextual note generator (rule-based short text)", hours: 3 },
      { task: "Weekly summary screen UI", hours: 3 },
      { task: "Trigger summary on 7-day mark", hours: 2 },
    ],
  },
  {
    id: "11", title: "Product Suggestions",
    items: [
      { task: "Curated product list DB schema + seed 10–20 products", hours: 4 },
      { task: "Build get suggestions API endpoint", hours: 2 },
      { task: "Gap detection: no SPF / too many strong treatments / no cleanser", hours: 4 },
      { task: "'You don't need anything new' state logic", hours: 1 },
      { task: "Suggestion screen UI (max 3 cards) + 'You're all set' state", hours: 4 },
    ],
  },
  {
    id: "12", title: "Education Snippets",
    items: [
      { task: "Education snippets DB table + seed 12 short tips", hours: 3 },
      { task: "Build get tip by key API endpoint", hours: 1 },
      { task: "Inline tip card component UI + attach to plan screens", hours: 3 },
    ],
  },
  {
    id: "13", title: "Admin Panel",
    items: [
      { task: "Admin auth (is_admin flag + separate middleware)", hours: 2 },
      { task: "Admin UI: edit rule thresholds (table view + save)", hours: 4 },
      { task: "Admin UI: edit plan text outputs + save", hours: 3 },
      { task: "Admin UI: manage curated product list (add, edit, delete)", hours: 3 },
    ],
  },
  {
    id: "14", title: "UI Polish & Design System",
    items: [
      { task: "Color palette + typography system", hours: 2 },
      { task: "Button, Input, Card, Modal, Tag components", hours: 5 },
      { task: "Bottom navigation bar + screen transitions", hours: 3 },
      { task: "Loading skeletons + error toast + empty states", hours: 4 },
      { task: "App icon + splash screen", hours: 2 },
      { task: "Push notifications + morning / night reminders", hours: 5 },
      { task: "Accessibility pass (contrast, font sizes, tap targets)", hours: 2 },
    ],
  },
  {
    id: "15", title: "QA, Testing & App Store",
    items: [
      { task: "Unit tests — rule engine (all rules)", hours: 4 },
      { task: "Unit tests — backend API endpoints", hours: 4 },
      { task: "Integration tests (auth + subscription flows)", hours: 3 },
      { task: "Manual QA — iOS (all screens, flows, edge cases)", hours: 4 },
      { task: "Manual QA — Android (all screens, flows, edge cases)", hours: 4 },
      { task: "Test payment flows + photo uploads end-to-end", hours: 3 },
      { task: "Test rule logic with real data sequences", hours: 2 },
      { task: "Bug fixing — Round 1 + Round 2", hours: 8 },
      { task: "Performance check (load time, image compression)", hours: 2 },
      { task: "App Store (Apple) — screenshots + metadata + submission", hours: 3 },
      { task: "Google Play — screenshots + metadata + submission", hours: 3 },
    ],
  },
];

const totalHours = sections.reduce((s, sec) => s + sec.items.reduce((a, i) => a + i.hours, 0), 0);

export default function AmeliseQuote() {
  const [openId, setOpenId] = useState(null);
  const [pdfMode, setPdfMode] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef(null);
  const btnRef = useRef(null);

  const handleDownload = async () => {
    setDownloading(true);
    setPdfMode(true);
    if (btnRef.current) btnRef.current.style.display = "none";
    await new Promise((r) => setTimeout(r, 150));
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: "#000000",
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pw = canvas.width / 2;
      const ph = canvas.height / 2;
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [pw, ph] });
      pdf.addImage(imgData, "PNG", 0, 0, pw, ph);
      pdf.save("amelise-quote.pdf");
    } finally {
      if (btnRef.current) btnRef.current.style.display = "";
      setPdfMode(false);
      setDownloading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .root {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #000;
          min-height: 100vh;
          color: #f5f5f7;
          padding: 64px 24px 96px;
          -webkit-font-smoothing: antialiased;
        }
        .wrap { max-width: 700px; margin: 0 auto; }

        .eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #48484a;
          margin-bottom: 16px;
        }
        .title {
          font-size: clamp(42px, 7vw, 60px);
          font-weight: 300;
          letter-spacing: -0.04em;
          color: #f5f5f7;
          line-height: 1.05;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 15px;
          font-weight: 300;
          color: #6e6e73;
          margin-bottom: 52px;
          letter-spacing: -0.01em;
        }

        .totals {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #1d1d1f;
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 56px;
        }
        .total-cell {
          background: #0a0a0a;
          padding: 28px 20px;
          text-align: center;
        }
        .total-value {
          font-size: 30px;
          font-weight: 300;
          letter-spacing: -0.04em;
          color: #f5f5f7;
          margin-bottom: 5px;
        }
        .total-value.blue { color: #2997ff; }
        .total-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3a3a3c;
        }

        .section-row { border-bottom: 1px solid #1d1d1f; }
        .section-row:first-of-type { border-top: 1px solid #1d1d1f; }

        .section-btn {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 17px 0;
          background: transparent;
          border: none;
          cursor: pointer;
          gap: 14px;
          text-align: left;
          color: inherit;
        }
        .section-btn:hover .sec-title { color: #2997ff; }

        .sec-num {
          font-size: 10px;
          font-weight: 500;
          color: #3a3a3c;
          letter-spacing: 0.06em;
          width: 20px;
          flex-shrink: 0;
          text-align: right;
        }
        .sec-title {
          flex: 1;
          font-size: 15px;
          font-weight: 400;
          color: #e5e5ea;
          letter-spacing: -0.015em;
          transition: color 0.15s;
        }
        .sec-meta {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-shrink: 0;
        }
        .sec-cost {
          font-size: 13px;
          font-weight: 300;
          color: #48484a;
          letter-spacing: -0.01em;
        }
        .sec-hours {
          font-size: 14px;
          font-weight: 400;
          color: #aeaeb2;
          width: 38px;
          text-align: right;
          letter-spacing: -0.01em;
        }
        .chevron {
          font-size: 14px;
          color: #3a3a3c;
          transition: transform 0.2s ease, color 0.15s;
          width: 12px;
          flex-shrink: 0;
          line-height: 1;
        }
        .chevron.open {
          transform: rotate(90deg);
          color: #6e6e73;
        }

        .items-wrap {
          padding: 0 0 14px 34px;
        }
        .item-row {
          display: flex;
          align-items: baseline;
          padding: 9px 0;
          border-bottom: 1px solid #141414;
          gap: 14px;
        }
        .item-row:last-child { border-bottom: none; }
        .item-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #2d2d2f;
          flex-shrink: 0;
          margin-top: 6px;
        }
        .item-task {
          flex: 1;
          font-size: 12.5px;
          font-weight: 300;
          color: #6e6e73;
          line-height: 1.55;
          letter-spacing: -0.005em;
        }
        .item-cost {
          font-size: 11px;
          font-weight: 300;
          color: #3a3a3c;
          flex-shrink: 0;
          letter-spacing: -0.01em;
        }
        .item-hours {
          font-size: 12px;
          font-weight: 400;
          color: #48484a;
          width: 28px;
          text-align: right;
          flex-shrink: 0;
        }

        .cut-notice {
          margin-bottom: 32px;
          padding: 16px 20px;
          border: 1px solid #1d1d1f;
          border-radius: 12px;
          background: #0a0a0a;
        }
        .cut-title {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #48484a;
          margin-bottom: 10px;
        }
        .cut-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .cut-tag {
          font-size: 11px;
          font-weight: 300;
          color: #6e6e73;
          background: #141414;
          border: 1px solid #2d2d2f;
          border-radius: 20px;
          padding: 4px 11px;
          letter-spacing: -0.01em;
        }

        .footer {
          margin-top: 64px;
          padding-top: 28px;
          border-top: 1px solid #1d1d1f;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }
        .footer-brand {
          font-size: 22px;
          font-weight: 300;
          letter-spacing: -0.03em;
          color: #f5f5f7;
          margin-bottom: 4px;
        }
        .footer-note {
          font-size: 11px;
          font-weight: 300;
          color: #3a3a3c;
          line-height: 1.6;
          letter-spacing: -0.005em;
        }
        .footer-right { text-align: right; }
        .footer-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3a3a3c;
          margin-bottom: 4px;
        }
        .footer-amount {
          font-size: 38px;
          font-weight: 300;
          letter-spacing: -0.05em;
          color: #2997ff;
          line-height: 1;
        }
        .footer-sub {
          font-size: 12px;
          font-weight: 300;
          color: #48484a;
          margin-top: 4px;
          letter-spacing: -0.01em;
        }

        .download-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 48px;
          padding: 9px 18px;
          background: transparent;
          border: 1px solid #2d2d2f;
          border-radius: 20px;
          color: #aeaeb2;
          font-family: inherit;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .download-btn:hover:not(:disabled) {
          border-color: #48484a;
          color: #f5f5f7;
        }
        .download-btn:disabled {
          opacity: 0.4;
          cursor: default;
        }
      `}</style>

      <div className="root" ref={contentRef}>
        <div className="wrap">

          <p className="eyebrow">Development Proposal · V1 MVP</p>
          <h1 className="title">Amelise</h1>
          <p className="subtitle">Smart Daily Skin Guidance · iOS + Android · 3 months</p>

          <span ref={btnRef}>
            <button className="download-btn" onClick={handleDownload} disabled={downloading}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 1v7.5M3.5 6l3 3 3-3M1.5 10.5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {downloading ? "Generating…" : "Download PDF"}
            </button>
          </span>

          <div className="totals">
            <div className="total-cell">
              <div className="total-value">{totalHours}h</div>
              <div className="total-label">Total Hours</div>
            </div>
            <div className="total-cell">
              <div className="total-value">${RATE}/hr</div>
              <div className="total-label">Rate</div>
            </div>
            <div className="total-cell">
              <div className="total-value blue">${(totalHours * RATE).toLocaleString()}</div>
              <div className="total-label">Total</div>
            </div>
          </div>

          <div>
            {sections.map((sec) => {
              const isOpen = pdfMode || openId === sec.id;
              const secHours = sec.items.reduce((a, i) => a + i.hours, 0);
              return (
                <div className="section-row" key={sec.id}>
                  <button className="section-btn" onClick={() => setOpenId(isOpen ? null : sec.id)}>
                    <span className="sec-num">{sec.id}</span>
                    <span className="sec-title">{sec.title}</span>
                    <div className="sec-meta">
                      <span className="sec-cost">${secHours * RATE}</span>
                      <span className="sec-hours">{secHours}h</span>
                      <span className={`chevron${isOpen ? " open" : ""}`}>›</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="items-wrap">
                      {sec.items.map((item, ii) => (
                        <div className="item-row" key={ii}>
                          <div className="item-dot" />
                          <span className="item-task">{item.task}</span>
                          <span className="item-cost">${item.hours * RATE}</span>
                          <span className="item-hours">{item.hours}h</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="footer">
            <div>
              <div className="footer-brand">Amelise MVP</div>
              <div className="footer-note">
                V1 Scope Only · No Weather Integration<br />
                No Advanced Analytics · No Long-Term Pattern Tracking
              </div>
            </div>
            <div className="footer-right">
              <div className="footer-label">Project Total</div>
              <div className="footer-amount">${(totalHours * RATE).toLocaleString()}</div>
              <div className="footer-sub">{totalHours} hours @ ${RATE}/hr</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
