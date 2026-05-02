"use client";

import { useEffect, useState } from "react";

export function DownloadButton({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);

  function startDownload() {
    const frame = document.createElement("iframe");
    frame.style.display = "none";
    frame.src = "/api/download";
    document.body.appendChild(frame);
    setTimeout(() => frame.remove(), 30000);
  }

  function handleClick() {
    startDownload();
    setOpen(true);
  }

  async function buyBeer() {
    setTipLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { url } = (await res.json()) as { url?: string };
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch (err) {
      console.error("checkout failed", err);
      setTipLoading(false);
      alert("Could not start checkout. Please try again in a moment.");
    }
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="btn-primary"
        onClick={handleClick}
      >
        {children}
      </button>

      {open && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dl-modal-title"
          onClick={() => setOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <h2 id="dl-modal-title">Download incoming</h2>
            <p className="modal-lede">
              No upsell, no nag, no guilt trip. The tip jar&apos;s just
              here so you know it exists.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={buyBeer}
                disabled={tipLoading}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 7c1.2-1.6 2.6-1.6 3.8 0c1.2 1.6 2.6 1.6 3.8 0c1.2-1.6 2.6-1.6 3.8 0c1.2-1.6 2.6-1.6 3.8 0" />
                  <path d="M4 8h12v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
                  <path d="M16 11h2.5a2.5 2.5 0 0 1 0 5H16" />
                </svg>
                <span>
                  {tipLoading ? "Opening checkout…" : "Buy me a beer"}
                </span>
              </button>
              <button
                type="button"
                className="btn-text"
                onClick={() => setOpen(false)}
              >
                Maybe later
              </button>
            </div>
            <p className="fineprint">
              Download didn&apos;t start? <a href="/api/download">Try again</a>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
