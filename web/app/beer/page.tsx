import Link from "next/link";
import { BeerButton } from "@/components/BeerButton";
import { BeerTagline } from "@/components/BeerTagline";

export const metadata = {
  title: "Buy me a beer · D4Mac",
  description:
    "D4Mac is free forever. If it earned a beer, the tip jar's right there — every drop helps keep it that way.",
};

export default function BeerPage() {
  return (
    <main className="beer-page">
      <Link href="/" className="beer-page__back">
        ← Back to D4Mac
      </Link>

      <div className="beer-page__inner">
        <BeerTagline className="beer-tagline beer-tagline--lg" />

        <div className="beer-mug-wrap">
          <BeerMugArt />
        </div>

        <div className="beer-page__cta">
          <BeerButton />
          <p className="beer-page__fineprint">
            $5 each. Pick your quantity at Stripe checkout.
          </p>
        </div>

        <section className="beer-page__why">
          <h2 className="beer-page__why-title">What tips fund</h2>
          <ul className="beer-page__why-list">
            <li>
              <strong>Bug fixes</strong>
              <span>
                Every Diablo patch breaks something. Tips keep me chasing them
                instead of giving up.
              </span>
            </li>
            <li>
              <strong>More games</strong>
              <span>
                Overwatch, WoW, StarCraft on the wishlist. Each one needs a
                bottle, testing, and a few sleepless nights.
              </span>
            </li>
            <li>
              <strong>Actual beer</strong>
              <span>
                The launcher was built on cold ones. Help me keep the cellar
                stocked.
              </span>
            </li>
          </ul>
        </section>

        <p className="beer-page__footer">
          Secure checkout via Stripe · No subscription · No data sold
        </p>
      </div>
    </main>
  );
}

function BeerMugArt() {
  return (
    <svg
      className="beer-mug-illustration"
      viewBox="0 0 240 260"
      role="img"
      aria-label="A frothy beer mug"
    >
      <defs>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(232,234,240,0.32)" />
          <stop offset="1" stopColor="rgba(168,172,186,0.20)" />
        </linearGradient>
        <linearGradient id="beerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7c948" />
          <stop offset="0.6" stopColor="#e0a83b" />
          <stop offset="1" stopColor="#9c6a1d" />
        </linearGradient>
        <linearGradient id="foamGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e8eaf0" />
        </linearGradient>
        <radialGradient id="beerGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(247, 201, 72, 0.45)" />
          <stop offset="1" stopColor="rgba(247, 201, 72, 0)" />
        </radialGradient>
      </defs>

      {/* warm under-glow */}
      <ellipse cx="120" cy="225" rx="92" ry="14" fill="url(#beerGlow)" />

      {/* bubbles rising inside the beer — animated via CSS */}
      <g className="mug-bubbles">
        <circle className="mug-bubble" cx="92" cy="160" r="3" />
        <circle className="mug-bubble" cx="115" cy="180" r="2" />
        <circle className="mug-bubble" cx="138" cy="150" r="2.5" />
        <circle className="mug-bubble" cx="108" cy="195" r="2" />
        <circle className="mug-bubble" cx="128" cy="170" r="2.5" />
      </g>

      {/* mug body (glass) */}
      <path
        className="mug-body"
        d="M 60 75 L 60 210 a 12 12 0 0 0 12 12 L 168 222 a 12 12 0 0 0 12 -12 L 180 75 Z"
        fill="url(#glassGrad)"
        stroke="#ffffff"
        strokeOpacity="0.18"
        strokeWidth="2"
      />

      {/* beer liquid */}
      <path
        d="M 65 90 L 65 207 a 8 8 0 0 0 8 8 L 167 215 a 8 8 0 0 0 8 -8 L 175 90 Z"
        fill="url(#beerGrad)"
      />

      {/* foam on top */}
      <path
        d="M 60 75
           c 4 -10, 12 -10, 16 0
           c 4 -10, 12 -10, 16 0
           c 4 -10, 12 -10, 16 0
           c 4 -10, 12 -10, 16 0
           c 4 -10, 12 -10, 16 0
           c 4 -10, 12 -10, 16 0
           c 4 -10, 12 -10, 16 0
           L 180 90 L 60 90 Z"
        fill="url(#foamGrad)"
        stroke="rgba(0,0,0,0.05)"
        strokeWidth="1"
      />

      {/* foam highlights */}
      <ellipse cx="84" cy="74" rx="6" ry="3" fill="rgba(255,255,255,0.6)" />
      <ellipse cx="124" cy="72" rx="7" ry="3.5" fill="rgba(255,255,255,0.5)" />
      <ellipse cx="156" cy="76" rx="5" ry="2.5" fill="rgba(255,255,255,0.55)" />

      {/* handle */}
      <path
        d="M 180 100 q 36 4 36 38 q 0 36 -36 38"
        fill="none"
        stroke="url(#glassGrad)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 180 100 q 36 4 36 38 q 0 36 -36 38"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* glass shine */}
      <path
        d="M 75 100 L 75 200"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
