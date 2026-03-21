"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 600);
    const removeTimer = setTimeout(() => setGone(true), 1100);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1, pointerEvents: "none" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/imgs/loader-veterinarian.svg"
        alt="Cargando Mantra Animal"
        className="fade-in w-72 max-w-[80vw]"
      />
    </div>
  );
}
