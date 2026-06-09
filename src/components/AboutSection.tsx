import { useState } from 'react';
import { Quote, Sparkles, Plus, Check } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../data';

export default function AboutSection() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  return (
    <section id="about" className="py-24 bg-zinc-950 border-t border-zinc-900 overflow-hidden relative">
      {/* Absolute Glow Background Accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-gold-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vision Statement */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-widest text-energy-yellow uppercase">
              <Sparkles className="w-3 h-3" />
              Who We Are
            </div>
            
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              Why Choose <span className="text-gradient-gold">Rise Fitness Hub</span>?
            </h2>

            <div className="h-1 w-20 bg-energy-yellow rounded"></div>

            <p className="font-sans text-gray-300 text-lg leading-relaxed pt-2">
              We believe consistency is everything. At Rise, there are no shortcuts, fake filters, or empty claims. 
              Only real work, professional focus, and life-changing support.
            </p>
            
            {/* The Famous Mantra Callout */}
            <blockquote className="border-l-4 border-energy-yellow bg-gradient-to-r from-gold-950/40 to-transparent p-5 rounded-r">
              <p className="font-display italic font-bold text-xl sm:text-2xl text-energy-yellow leading-snug">
                "Do it anyway. You just have to start."
              </p>
              <cite className="block mt-2 font-mono text-xs text-gray-400 font-medium tracking-wide uppercase">
                - The Rise Fitness Mantra
              </cite>
            </blockquote>

            <p className="font-sans text-gray-400 text-sm sm:text-base leading-relaxed">
              Whether you are step-dancing for functional conditioning, prepping for local competitions, or setting foot on rubber mats for the exact first time—you belong here. Our warm group community, high-airflow clean conditioning space, and certified 1-on-1 trainers keep you motivated, protected, and consistently rising.
            </p>

            {/* Inclusivity Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                "Welcoming & Happy Gym Community",
                "Certified, Non-Intimidating Coach Staff",
                "Perfect for First-Time Beginners",
                "Advanced Athlete Gear & Barbells",
                "100% Equal Inclusive Atmosphere",
                "Dynamic Step & Aerobics Family"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="bg-gold-500/10 rounded-full p-1 border border-gold-500/30">
                    <Check className="w-3.5 h-3.5 text-energy-yellow" />
                  </div>
                  <span className="font-display text-sm font-semibold text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Motivational Interactive Block */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative bg-zinc-900 border border-gold-900/30 rounded p-8 sm:p-10 shadow-gold-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Quote className="w-20 h-20 text-white" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div>
                  <span className="font-mono text-[10px] bg-gold-900/40 text-energy-yellow px-2 px-2.5 py-1 rounded border border-gold-500/20 uppercase tracking-widest font-bold">
                    Daily Spark
                  </span>
                </div>

                <div className="min-h-[140px] flex flex-col justify-center">
                  <p className="font-display text-lg sm:text-xl text-gray-100 font-semibold leading-relaxed transition-all duration-300 py-2">
                    "{MOTIVATIONAL_QUOTES[quoteIndex]}"
                  </p>
                  <p className="font-mono text-xs text-gold-500 mt-2 font-bold tracking-wider uppercase">
                    — Rise Motivation Coach Engine
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <button
                    onClick={rotateQuote}
                    className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-energy-yellow border border-energy-yellow/30 hover:border-energy-yellow text-xs font-mono font-bold uppercase tracking-wider rounded transition-all duration-200 focus:outline-none flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 animate-spin-slow" />
                    Give Me More Fuel
                  </button>
                </div>
              </div>
            </div>

            {/* Local Atmosphere Banner */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gold-950/20 via-zinc-900 to-black/30 border border-zinc-800/80 rounded flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] text-gray-500 uppercase font-bold tracking-widest">Lahug Vibe</p>
                <p className="font-display font-bold text-sm text-white">IT Park & JY Centered</p>
              </div>
              <span className="font-mono text-xs text-energy-yellow font-bold bg-energy-yellow/10 px-2 py-0.5 rounded border border-energy-yellow/20">
                5-Min Commute
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
