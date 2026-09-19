"use client";

import { useState } from "react";
import locationsData from "@/data/locations.json";
import { MapLibreMap } from "@/components/map/MapLibreMap";
import { Header } from "@/components/layout/Header";

// Note: In a real app we would use Zod on the API side as well.
export default function Home() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const locations = locationsData as any[]; // casting to any[] for brevity right now

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
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center text-center p-6 bg-gradient-to-t from-navy/80 to-transparent">
          <img 
            src="/cesium/Assets/tp-logo-full-white-shadow.png" 
            alt="Tandoori Pizza" 
            className="w-full max-w-md md:max-w-xl lg:max-w-2xl mb-8 drop-shadow-2xl"
          />
          <div className="pointer-events-auto relative w-full max-w-md mb-12">
            <input 
              type="text" 
              placeholder="Search for a location..." 
              className="w-full pl-6 pr-12 py-4 rounded-full text-navy shadow-2xl border-2 border-transparent focus:border-coral focus:outline-none transition-all text-lg font-medium"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-coral p-2 rounded-full hover:bg-coral/90 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
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
              <p className="text-gray-600 mb-4 h-12">{loc.address}, {loc.city}, {loc.state} {loc.zip}</p>
              
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
