"use client";

export function Header() { 
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6">
      <a className="flex items-center gap-3 text-white no-underline font-display tracking-widest text-xl drop-shadow-md" href="/" aria-label="Tandoori Pizza Home">
        <img src="/cesium/Assets/tp-logo-white-shadow-round.png" alt="TP Logo" className="w-12 h-12" />
        <strong>TANDOORI PIZZA</strong>
      </a>
      <nav aria-label="Primary navigation" className="flex items-center gap-4">
        <a href="https://order.tandooripizza.com" target="_blank" rel="noreferrer" className="bg-white text-navy px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-coral hover:text-white transition-colors shadow-lg">
          Order Online
        </a>
      </nav>
    </header>
  ); 
}
