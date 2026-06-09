import { Wind, Flame, Music, Sparkles, Droplet, Wifi, Shield } from 'lucide-react';
import { AMENITIES } from '../data';
import saunaImgUrl from '../assets/images/sauna_recovery_1780969372274.png';

export default function AmenitiesSection() {

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wind':
        return <Wind className="w-6 h-6 text-energy-yellow" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-energy-yellow" />;
      case 'Music':
        return <Music className="w-6 h-6 text-energy-yellow" />;
      case 'ShowerHead':
        return <Sparkles className="w-6 h-6 text-energy-yellow" />;
      case 'Droplet':
        return <Droplet className="w-6 h-6 text-energy-yellow" />;
      case 'Wifi':
        return <Wifi className="w-6 h-6 text-energy-yellow" />;
      default:
        return <Shield className="w-6 h-6 text-energy-yellow" />;
    }
  };

  return (
    <section id="amenities" className="py-24 bg-gradient-to-b from-zinc-950 to-black relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-[11px] font-bold tracking-widest text-energy-yellow bg-gold-950/60 border border-gold-900/40 px-3 py-1 rounded-sm uppercase">
            Premium Perks Included
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Elevated Amenities & Client Support
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base leading-relaxed">
            Forget standard crowded gyms. At Rise Fitness Hub, every tier unlocks complimentary high-tier amenities meant to optimize your peak performance and accelerate recovery.
          </p>
        </div>

        {/* Dynamic Layout: Bento Style Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: The Perks Grid (8/12 Columns on large screens) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {AMENITIES.map((amenity, index) => (
              <div
                key={index}
                className="group p-6 bg-zinc-900/60 border border-zinc-900 hover:border-gold-500/30 rounded transition-all duration-300 hover:bg-zinc-900 shadow-sm hover:shadow-gold-heavy/10 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 bg-zinc-950 w-12 h-12 rounded flex items-center justify-center border border-zinc-800 group-hover:border-energy-yellow/40 transition-colors duration-300">
                    {getIcon(amenity.icon)}
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-energy-yellow transition-colors">
                    {amenity.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-400 leading-relaxed">
                    {amenity.description}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-gold-500">
                  <span>COMPLIMENTARY ACCESS</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">● ALL MEMBERS</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Premium Finnish Sauna Custom Spotlight Card (4/12 Columns) */}
          <div className="lg:col-span-4 flex">
            <div className="w-full bg-zinc-900 border border-gold-500/30 rounded overflow-hidden flex flex-col justify-between shadow-gold-glow group">
              
              {/* Product Visual */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                <img
                  src={saunaImgUrl}
                  alt="Elite customized Infrared Sauna room at Rise Fitness"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 right-4 z-20 font-mono text-[9px] bg-energy-yellow text-black font-bold uppercase tracking-widest px-2 py-1 rounded">
                  ★ LUXURY ACCESS
                </span>
              </div>

              {/* Specs */}
              <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    30-Min Daily Sauna Perk
                  </h3>
                  <p className="font-sans text-sm text-gray-400 leading-relaxed mt-2">
                    Our Finnish infrared dry-sauna acts as your ultimate post-workout recovery partner. Accelerate muscle healing, boost circulation, release endorphins, and detoxify right before taking a refreshing shower.
                  </p>
                </div>

                <div className="space-y-2 border-t border-zinc-800 pt-4">
                  {[
                    "Daily 30-minute access card",
                    "Maintained at optimal therapeutic heat",
                    "Complimentary fresh locker room key",
                    "No booking surcharge on 12-Month tiers"
                  ].map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-energy-yellow"></span>
                      <span className="font-mono text-[11px] text-gray-300">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Global Hub Assurance Sign */}
        <div className="mt-12 bg-zinc-950 p-6 rounded border border-zinc-900 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-display font-bold text-sm text-gray-100">All-Inclusive Zero Upcharges Guarantee</p>
            <p className="font-sans text-xs text-gray-500 mt-0.5">Unlike global chains, your water stations, access cards, and WiFi are 100% free with no joining penalties.</p>
          </div>
          <span className="font-mono text-xs text-energy-yellow hover:underline cursor-pointer font-bold">
            Browse Enrollment Agreements →
          </span>
        </div>

      </div>
    </section>
  );
}
