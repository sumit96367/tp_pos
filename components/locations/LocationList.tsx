import type { PizzaLocation } from "@/types/location";
export function LocationList({ locations, onSelect }: { locations: PizzaLocation[]; onSelect: (location: PizzaLocation) => void }) {
 const groups = locations.reduce<Record<string, PizzaLocation[]>>((all, item) => { (all[item.state] ??= []).push(item); return all; }, {});
 return <div className="location-list">{Object.entries(groups).map(([state, group]) => <section key={state}><h3>{state}</h3>{group.map(location => <button key={location.id} onClick={() => onSelect(location)}><b>{location.city}</b><span>{location.status === "Coming Soon" ? "Coming soon" : location.address.split(",")[0]}</span><em aria-hidden="true">↗</em></button>)}</section>)}</div>;
}
