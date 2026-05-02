"use client";

import { useEffect, useState } from "react";

const TAGLINES = [
  "Inarius would tip. Be unlike Lilith.",
  "Beer: the only legendary drop with a 100% rate.",
  "Helped you slay D4? Help me slay these bugs.",
  "Hops are the cheapest reagent on this table.",
  "One beer = one less curse on the codebase.",
  "Tip jar's open. Mephisto's not watching.",
  "$5 buys two more rounds of bug-hunting in Hell.",
  "Patch notes brewed in the cellar.",
  "Tyrael blesses generous tippers. Probably.",
  "Demons drink souls. I prefer pilsner.",
  "This launcher cost a weekend. Pay it forward in pints.",
  "Even Deckard Cain says: stay awhile, and tip.",
  "Battle-tested. Bottle-powered.",
  "Buy a beer, unlock zero achievements. Worth it anyway.",
  "Free as in beer. Tip as in beer.",
  "Free launcher. Five-buck beer. Math checks out.",
  "Andariel's Visage doesn't have a tip option. This does.",
  "Tipping the dev: +5 to Karma, untyped, doesn't stack.",
  "Sanctuary's saved. Tip the night-shift sysadmin.",
  "Loot dropped: 1× peace of mind. Crack a cold one.",
  "An IPA costs less than a Helltide reagent.",
  "If this worked first try, that was the lager.",
  "No DRM. No telemetry. Just vibes — and a beer fund.",
  "The codebase has 0 microtransactions. This is the only one.",
  "Lilith would never. You would.",
  "Hops: the unofficial 6th class.",
  "Click the button. The Lord of Terror commands it.",
  "Worship the brew. The brew keeps the lights on.",
  "If this saved you a Bootcamp reboot, throw a beer.",
  "Five bucks. One beer. Zero demons summoned.",
  "Patches don't write themselves. Pints help.",
  "Open-source vibes, closed-source bar tab.",
];

const ROTATION_MS = 60_000;

export function BeerTagline({
  className = "beer-tagline",
}: {
  className?: string;
} = {}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Randomise initial pick on mount so two visitors at the same minute
    // don't see the same nudge.
    setIndex(Math.floor(Math.random() * TAGLINES.length));

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % TAGLINES.length);
    }, ROTATION_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <h2 key={index} className={className}>
      {TAGLINES[index]}
    </h2>
  );
}
