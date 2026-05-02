"use client";

import { useState } from "react";

export function BeerButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { url } = (await res.json()) as { url?: string };
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch (err) {
      console.error("checkout failed", err);
      setLoading(false);
      alert("Could not start checkout. Please try again in a moment.");
    }
  }

  return (
    <button
      className="btn-primary"
      type="button"
      onClick={handleClick}
      disabled={loading}
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
        {/* foam: bumpy line */}
        <path d="M4 7c1.2-1.6 2.6-1.6 3.8 0c1.2 1.6 2.6 1.6 3.8 0c1.2-1.6 2.6-1.6 3.8 0" />
        {/* mug body */}
        <path d="M4 8h12v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
        {/* handle */}
        <path d="M16 11h2.5a2.5 2.5 0 0 1 0 5H16" />
      </svg>
      <span>{loading ? "Opening checkout…" : "Buy me a beer"}</span>
    </button>
  );
}
