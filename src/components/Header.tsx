import { useState, useEffect } from 'react';
import { Flame, Dumbbell, Award, HelpCircle, Phone, Sparkles } from 'lucide-react';
import { BookingClaim } from '../types';

interface HeaderProps {
  activeClaim: BookingClaim | null;
  onOpenBooking: () => void;
}

export default function Header({ activeClaim, onOpenBooking }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="header-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-gold-900/40 shadow-gold-glow'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Brand Brand */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-energy-yellow/30 blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-black border border-gold-500 rounded-full p-2">
              <Dumbbell className="w-5 h-5 text-energy-yellow animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold tracking-tight text-white text-lg leading-none">
              RISE <span className="text-gradient-gold">FITNESS</span>
            </span>
            <span className="font-mono text-[9px] tracking-widest text-gold-500 font-bold uppercase mt-0.5">
              Hub Cebu
            </span>
          </div>
        </a>

        {/* Desktop Navbar Menu Links */}
        <nav className="hidden md:flex items-center gap-8 font-display text-sm tracking-wide font-medium">
          <a href="#about" className="text-gray-300 hover:text-energy-yellow transition-colors duration-200">
            About Us
          </a>
          <a href="#amenities" className="text-gray-300 hover:text-energy-yellow transition-colors duration-200">
            Amenities
          </a>
          <a href="#classes" className="text-gray-300 hover:text-energy-yellow transition-colors duration-200">
            Group Classes
          </a>
          <a href="#membership" className="text-gray-300 hover:text-energy-yellow transition-colors duration-200">
            Membership Offers
          </a>
          <a href="#contact" className="text-gray-300 hover:text-energy-yellow transition-colors duration-200">
            Location & Hours
          </a>
        </nav>

        {/* Call To Action Buttons */}
        <div className="flex items-center gap-3">
          {activeClaim ? (
            <div className="bg-gradient-gold/20 border border-gold-500/50 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-gold-glow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-energy-yellow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-energy-yellow"></span>
              </span>
              <span className="font-mono text-xs text-energy-yellow font-bold uppercase tracking-wider">
                Deal Secured: #{activeClaim.ticketId}
              </span>
            </div>
          ) : (
            <button
              id="cta-claim-nav"
              onClick={onOpenBooking}
              className="bg-gradient-to-r from-energy-yellow to-gold-600 hover:from-gold-300 hover:to-energy-yellow text-black font-display font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm shadow-gold-heavy hover:shadow-gold-heavy/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-energy-yellow/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Claim Summer Deal
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
