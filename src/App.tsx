/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import AmenitiesSection from './components/AmenitiesSection';
import MembershipSection from './components/MembershipSection';
import ClassesSection from './components/ClassesSection';
import FooterSection from './components/FooterSection';
import OwnerDashboard from './components/OwnerDashboard';
import { BookingClaim } from './types';
import { Ticket, Sparkles, X, ChevronUp } from 'lucide-react';

export default function App() {
  const [activeClaim, setActiveClaim] = useState<BookingClaim | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);

  // Sync state with browser local storage for offline state durability
  useEffect(() => {
    const saved = localStorage.getItem('rise_fitness_claim_secure');
    if (saved) {
      try {
        setActiveClaim(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to restore previous membership claim ticket state", e);
      }
    }

    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClaimSuccess = (claim: BookingClaim) => {
    setActiveClaim(claim);
    localStorage.setItem('rise_fitness_claim_secure', JSON.stringify(claim));
    setShowModal(false);
  };

  const handleClearClaim = () => {
    setActiveClaim(null);
    localStorage.removeItem('rise_fitness_claim_secure');
  };

  const handleOpenBooking = () => {
    setShowModal(true);
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-200">
      
      {/* Floating Sparkles Ticker: Securing Rate Surcharges */}
      {!activeClaim && (
        <div id="countdown-banner" className="bg-gradient-to-r from-energy-yellow to-gold-600 text-black py-2 px-4 text-center text-xs font-mono font-extrabold tracking-widest uppercase z-50 relative flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Summer Slots are Filling Up! Claim up to ₱4,700 in Discounted Gifts Today!</span>
          <button 
            onClick={handleOpenBooking}
            className="underline hover:text-white font-display ml-2 cursor-pointer uppercase text-[10px]"
          >
            Lock In Rate
          </button>
        </div>
      )}

      {/* Dynamic Header */}
      <Header activeClaim={activeClaim} onOpenBooking={handleOpenBooking} />

      {/* Main Single-Screen Scroll Modules */}
      <main className="w-full">
        {/* Module 1: Hero Visual Center */}
        <HeroSection onClaimClick={handleOpenBooking} />

        {/* Module 2: Why Choose Us (Value Proposition / Community) */}
        <AboutSection />

        {/* Module 3: Grid of Amenities & Finnish Sauna Spotlight */}
        <AmenitiesSection />

        {/* Module 4: Classes Section (Agenda & Class enrollment tests) */}
        <ClassesSection />

        {/* Module 5: Interactive Pricing & Summer Special Booking Form */}
        <MembershipSection
          onClaimSuccess={handleClaimSuccess}
          activeClaim={activeClaim}
          onClearClaim={handleClearClaim}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </main>

      {/* Footer & Location details */}
      <FooterSection onOpenOwnerDashboard={() => setShowOwnerDashboard(true)} />

      {/* Live Manager Console */}
      <OwnerDashboard isOpen={showOwnerDashboard} onClose={() => setShowOwnerDashboard(false)} />

      {/* FLOATING ACTION PILLS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* 1. Claim Ticker status backup shortcut */}
        {activeClaim && (
          <a
            href="#membership"
            className="bg-black/95 text-energy-yellow border border-gold-500 rounded px-4 py-3 flex items-center gap-2 shadow-gold-glow animate-bounce hover:scale-[1.03] transition-transform font-mono text-xs font-bold"
          >
            <Ticket className="w-4 h-4 text-energy-yellow" />
            <span>Summer Code: {activeClaim.ticketId} Secur</span>
          </a>
        )}

        {/* 2. Scroll Back to Top Button */}
        {showFloatingButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-zinc-900 hover:bg-zinc-800 text-white rounded p-3.5 border border-zinc-800 hover:border-gold-500/50 transition-colors shadow shadow-md flex items-center justify-center self-end"
            title="Scroll To Top"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
