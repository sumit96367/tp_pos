"use client";

import { useState, useMemo, useEffect } from "react";
import locationsData from "@/data/locations.json";
import { MapLibreMap } from "@/components/map/MapLibreMap";
import { Header } from "@/components/layout/Header";

function getDistanceAndDirection(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Radius of earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c;

  const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  brng = (brng + 360) % 360;

  const compassBrng = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
  const direction = compassBrng[Math.round(brng / 45)];

  return { distance: distance.toFixed(1), direction };
}

// Note: In a real app we would use Zod on the API side as well.
export default function Home() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLoc({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => console.log("Geolocation error", error)
      );
    }
  }, []);

  const locations = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const allLocations = locationsData as any[];
    if (!query) return allLocations;
    return allLocations.filter(loc => 
      loc.city.toLowerCase().includes(query) || 
      loc.name.toLowerCase().includes(query) ||
      loc.zip.includes(query) ||
      loc.address.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-cream font-sans">
      <Header />
      
      {/* Map / Hero Section */}
      <section className="relative w-full h-screen">
        <MapLibreMap 
          locations={locations} 
          selectedId={selectedLocationId} 
          onSelect={(loc) => setSelectedLocationId(loc.id)} 
        />
        
        {/* Hero Overlay */}
        <div className={`absolute inset-0 pointer-events-none flex flex-col justify-center items-center text-center p-6 transition-colors duration-500 ${selectedLocationId ? '' : 'bg-gradient-to-t from-navy/80 to-transparent'}`}>
          {!selectedLocationId ? (
            <>
              <img 
                src="/cesium/Assets/tp-logo-full-white-shadow.png" 
                alt="Tandoori Pizza" 
                className="w-full max-w-md md:max-w-xl lg:max-w-2xl mb-8 drop-shadow-2xl"
              />
              <div className="pointer-events-auto relative w-full max-w-md mb-12">
                <input 
                  type="text" 
                  placeholder="Search for a location..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 pr-12 py-4 rounded-full text-navy shadow-2xl border-2 border-transparent focus:border-coral focus:outline-none transition-all text-lg font-medium"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-coral p-2 rounded-full hover:bg-coral/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>

                {searchQuery && locations.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-50 text-left border border-gray-100 max-h-60 overflow-y-auto">
                    {locations.map(loc => (
                      <button 
                        key={loc.id} 
                        className="w-full text-left px-6 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                        onClick={() => {
                          setSelectedLocationId(loc.id);
                          setSearchQuery("");
                        }}
                      >
                        <div className="font-bold text-navy">{loc.name}</div>
                        <div className="text-sm text-gray-500">{loc.address}, {loc.city}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="pointer-events-auto mt-auto mb-8 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-left border-t-4 border-coral animate-in fade-in slide-in-from-bottom-8">
              {(() => {
                const loc = locationsData.find((l: any) => l.id === selectedLocationId) as any;
                if (!loc) return null;
                return (
                  <>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-display text-2xl text-navy">{loc.name}</h3>
                      <button 
                        onClick={() => setSelectedLocationId(null)}
                        className="text-gray-400 hover:text-navy transition-colors p-1 -mr-2 -mt-2"
                        aria-label="Close"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                    <div className="text-gray-600 mb-6 text-sm">
                      {loc.address}<br/>{loc.city}, {loc.state} {loc.zip}
                      {userLoc && (
                        <div className="mt-2 font-bold text-coral bg-coral/10 inline-block px-2 py-1 rounded">
                          {(() => {
                            const { distance, direction } = getDistanceAndDirection(userLoc.lat, userLoc.lng, loc.latitude, loc.longitude);
                            return `${distance} miles away (${direction})`;
                          })()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {loc.status !== 'coming-soon' ? (
                        <a 
                          href={loc.orderUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-coral text-white text-center py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-coral/90 transition-colors shadow-md"
                        >
                          Order Now
                        </a>
                      ) : (
                        <div className="w-full bg-gray-200 text-gray-600 text-center py-3 rounded-lg font-bold uppercase tracking-wider">
                          Coming Soon
                        </div>
                      )}
                      <div className="flex gap-3">
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-navy text-white text-center py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-navy/90 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          Directions
                        </a>
                        <a 
                          href={`tel:${loc.phone}`}
                          className="flex-1 bg-gray-100 text-navy text-center py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          Call
                        </a>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Location Cards section below map */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl text-navy uppercase mb-8 text-center">Our Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div 
              key={loc.id} 
              className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 ${selectedLocationId === loc.id ? 'border-coral' : 'border-transparent'}`}
              onClick={() => setSelectedLocationId(loc.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-2xl text-navy">{loc.city}</h3>
                {loc.status === 'coming-soon' ? (
                  <span className="bg-saffron text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Coming Soon</span>
                ) : (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Open</span>
                )}
              </div>
              <div className="text-gray-600 mb-4 min-h-[3rem]">
                <p>{loc.address}, {loc.city}, {loc.state} {loc.zip}</p>
                {userLoc && (
                  <div className="mt-1 font-bold text-coral text-sm bg-coral/10 inline-block px-2 py-1 rounded">
                    {(() => {
                      const { distance, direction } = getDistanceAndDirection(userLoc.lat, userLoc.lng, loc.latitude, loc.longitude);
                      return `${distance} miles away (${direction})`;
                    })()}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <a 
                  href={`tel:${loc.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-navy text-white text-center py-2 rounded font-bold uppercase tracking-wider text-sm hover:bg-navy/90 transition-colors"
                >
                  Call
                </a>
                {loc.status !== 'coming-soon' && (
                  <a 
                    href={loc.orderUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-coral text-white text-center py-2 rounded font-bold uppercase tracking-wider text-sm hover:bg-coral/90 transition-colors"
                  >
                    Order
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Showcase Placeholder */}
      <section className="bg-navy py-20 px-4 md:px-8 text-center text-white">
        <h2 className="font-display text-5xl text-coral mb-6 uppercase">Our Signature Menu</h2>
        <p className="max-w-2xl mx-auto text-lg mb-12 opacity-90">Experience the fusion of authentic Indian spices and classic California pizza making.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white/5 rounded-xl aspect-square flex items-center justify-center border border-white/10">
              <span className="text-white/30 font-display text-2xl">Placeholder Image</span>
            </div>
          ))}
        </div>
      </section>

      {/* Franchise Form */}
      <section className="py-20 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border-t-8 border-saffron">
          <h2 className="font-display text-4xl text-navy uppercase mb-4 text-center">Join the Family</h2>
          <p className="text-center text-gray-600 mb-8">Interested in opening a Tandoori Pizza franchise? Let's talk.</p>
          
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Form submitted! (API connected soon)"); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-navy mb-2 uppercase tracking-wider">First Name</label>
                <input type="text" required className="w-full border-2 border-gray-200 rounded p-3 focus:border-coral focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-2 uppercase tracking-wider">Last Name</label>
                <input type="text" required className="w-full border-2 border-gray-200 rounded p-3 focus:border-coral focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-2 uppercase tracking-wider">Email Address</label>
              <input type="email" required className="w-full border-2 border-gray-200 rounded p-3 focus:border-coral focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-2 uppercase tracking-wider">Target City / Region</label>
              <input type="text" required className="w-full border-2 border-gray-200 rounded p-3 focus:border-coral focus:outline-none transition-colors" />
            </div>
            <button type="submit" className="w-full bg-coral text-white font-bold uppercase tracking-widest py-4 rounded hover:bg-coral/90 transition-transform active:scale-95 shadow-lg">
              Submit Enquiry
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white/60 py-12 text-center text-sm border-t border-white/10">
        <p className="font-display tracking-widest text-xl text-white mb-4">TANDOORI PIZZA</p>
        <p>&copy; {new Date().getFullYear()} Tandoori Pizza. All rights reserved.</p>
      </footer>
    </main>
  );
}
