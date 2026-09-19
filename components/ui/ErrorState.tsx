import type { PizzaLocation } from "@/types/location";
export function ErrorState({ locations, onSelect }: { locations: PizzaLocation[]; onSelect: (location: PizzaLocation) => void }) {
 return <main className="fallback"><div className="fallback-brand"><b>TP</b><span>TANDOORI PIZZA</span></div><h1>Interactive map unavailable.</h1><p>Explore our locations using the accessible list below.</p><div className="fallback-list">{locations.map(l => <button key={l.id} onClick={() => onSelect(l)}><strong>{l.city}, {l.state}</strong><small>{l.address}</small></button>)}</div></main>;
}
