import { ArrowRight, MapPin, Sparkles, Trophy, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';
import heroImgUrl from '../assets/images/gym_hero_bg_1780969354186.png';

interface HeroSectionProps {
  onClaimClick: () => void;
}

export default function HeroSection({ onClaimClick }: HeroSectionProps) {

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20"
    >
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80 z-10" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/90 z-10" />
        <img
          src={heroImgUrl}
          alt="Modern premium Rise Fitness Hub interior in Lahug, Cebu City"
          className="w-full h-full object-cover object-center animate-fade-in transition-all duration-1000 scale-[1.02]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Decorative Gold Laser Flares */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-[120px] pointer-events-none z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-energy-yellow/15 rounded-full blur-[120px] pointer-events-none z-10"></div>

      {/* Main Content Card Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 py-16 flex flex-col items-center text-center">
        {/* Cebu Location Small Badge */}
        <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-gold-500/30 rounded-full px-4 py-1.5 mb-6 shadow-gold-glow">
          <MapPin className="w-4 h-4 text-energy-yellow" />
          <span className="font-mono text-[11px] font-bold text-gray-200 tracking-wider uppercase">
            Salinas Drive • Between IT Park & JY Square
          </span>
        </div>

        {/* Big Impact Headline */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none text-white max-w-5xl">
          Rise with <span className="text-gradient-gold">Purpose.</span><br />
          Train with <span className="text-white relative inline-block">Intent.<span className="absolute bottom-1.5 md:bottom-3 left-0 w-full h-1 md:h-1.5 bg-energy-yellow"></span></span>
        </h1>

        {/* Subtitle / Promise */}
        <p className="mt-8 font-sans text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
          <span className="font-display font-extrabold tracking-widest text-energy-yellow">STRENGTH | DISCIPLINE | RESULTS</span>.
          <br className="hidden sm:inline" /> Join Cebu City's ultimate premium fitness community located right between Lahug's busiest business corridors. Enjoy high-performance equipment in a perfectly chilled air-conditioned lounge.
        </p>

        {/* Call To Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <button
            id="hero-cta-primary"
            onClick={onClaimClick}
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-energy-yellow to-gold-600 hover:from-gold-300 hover:to-energy-yellow text-black font-display font-bold text-sm tracking-wider uppercase rounded-sm shadow-gold-heavy hover:shadow-gold-heavy/30 transition-all duration-300 flex items-center justify-center gap-2.5 hover:scale-[1.03] active:scale-[0.97]"
          >
            Claim Your Summer Deal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a
            id="hero-cta-secondary"
            href="#membership"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800/80 text-white font-display font-bold text-sm tracking-wider uppercase rounded-sm border border-gold-900/50 hover:border-gold-500/80 transition-all duration-200 text-center flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            View Membership Perks
          </a>
        </div>

        {/* Quality Assurance Badges */}
        <div className="mt-16 pt-8 border-t border-zinc-800/80 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-950/80 p-2 border border-gold-900/30 rounded">
              <Trophy className="w-5 h-5 text-energy-yellow" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">Elite Coaching</p>
              <p className="font-sans text-xs text-gray-400">1-on-1 Personalized Plan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-950/80 p-2 border border-gold-900/30 rounded">
              <ShieldCheck className="w-5 h-5 text-energy-yellow" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">Fully AC Comfort</p>
              <p className="font-sans text-xs text-gray-400">Unlimited Pure Hydration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-950/80 p-2 border border-gold-900/30 rounded">
              <HeartPulse className="w-5 h-5 text-energy-yellow" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">Finnish Sauna</p>
              <p className="font-sans text-xs text-gray-400">Daily Luxury Recovery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-950/80 p-2 border border-gold-900/30 rounded">
              <Sparkles className="w-5 h-5 text-energy-yellow" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">No Hidden Fees</p>
              <p className="font-sans text-xs text-gray-400">Complimentary Gym Pass</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
