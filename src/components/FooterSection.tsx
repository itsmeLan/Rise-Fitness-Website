import { useState, FormEvent } from 'react';
import { MapPin, Mail, Clock, MessageSquare, Send, CheckCircle, Sparkles } from 'lucide-react';

interface FooterSectionProps {
  onOpenOwnerDashboard?: () => void;
}

export default function FooterSection({ onOpenOwnerDashboard }: FooterSectionProps) {
  const [msgContent, setMsgContent] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!msgContent.trim()) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setMsgContent('');
    }, 4500);
  };

  return (
    <footer id="contact" className="bg-black text-gray-400 pt-20 pb-8 border-t border-zinc-900 relative">
      {/* Absolute background accent */}
      <div className="absolute left-1/3 bottom-0 w-96 h-96 bg-gold-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Upper footer split context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-zinc-900">
          
          {/* Brand Identity details (4/12 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-black border border-gold-500 rounded p-2">
                <span className="font-display font-extrabold text-energy-yellow text-sm">RISE</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold tracking-tight text-white text-base">
                  RISE <span className="text-gradient-gold">FITNESS HUB</span>
                </span>
                <span className="font-mono text-[9px] tracking-widest text-gold-500">LAHUG, CEBU CITY</span>
              </div>
            </div>

            <p className="font-sans text-sm text-gray-400 leading-relaxed max-w-sm">
              Premium training setups, warm local fitness family, and luxury Finnish saunas nestled right inside Cebu’s Lahug business hub list.
            </p>

            <blockquote className="border-l-2 border-gold-500/50 pl-4 py-1 italic font-display text-gray-300 text-sm">
              "Rise with Purpose. Train with Intent."
            </blockquote>

            {/* Hours Of Operation Table */}
            <div className="space-y-3 pt-2">
              <h4 className="font-mono text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-energy-yellow" /> Hours of Operation:
              </h4>
              <div className="bg-zinc-950 p-4 border border-zinc-900 rounded font-mono text-xs text-gray-300 space-y-2 max-w-xs">
                <div className="flex justify-between">
                  <span>Mon — Fri</span>
                  <span className="text-white">5:00 AM — 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white">6:00 AM — 8:00 PM</span>
                </div>
                <div className="flex justify-between border-t border-zinc-900/60 pt-2 text-gold-500">
                  <span>Sunday (Sauna Focus)</span>
                  <span>8:00 AM — 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Maps details (4/12 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-display font-bold text-lg text-white">Find Our Hub</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-energy-yellow flex-shrink-0 mt-0.5" />
                <div className="font-sans text-sm text-gray-300 space-y-1">
                  <p className="font-bold text-white">Sonata Building</p>
                  <p>2nd Floor, Salinas Drive, Lahug,</p>
                  <p>Cebu City, Philippines</p>
                  <p className="font-mono text-xs text-gold-500 font-bold pt-1 uppercase">
                    ★ Located Between IT Park and JY Square ★
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-energy-yellow flex-shrink-0" />
                <a
                  href="mailto:risefitnesshub@gmail.com"
                  className="font-mono text-sm text-gray-300 hover:text-energy-yellow transition-colors underline decoration-dotted underline-offset-4"
                >
                  risefitnesshub@gmail.com
                </a>
              </div>
            </div>

            {/* Static Interactive Layout: Map Pointer Area */}
            <div className="relative h-44 bg-zinc-950 rounded border border-zinc-900 overflow-hidden flex flex-col justify-end p-4 group">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#dca923_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 z-10">
                <MapPin className="w-8 h-8 text-energy-yellow animate-bounce" />
                <span className="bg-black/90 text-white font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded border border-gold-900/40">
                  Salinas Drive lahug
                </span>
              </div>
              
              <span className="relative z-10 font-mono text-[9px] text-gray-500 text-center uppercase tracking-wider">
                ✓ Free Basement Off-Street Parking Cards
              </span>
            </div>
          </div>

          {/* Quick Message CTA Form (4/12 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-display font-bold text-lg text-white">Message Us Live</h4>
            
            <p className="font-sans text-sm text-gray-400">
              Have questions about summer pricing? Message us now to lock in your discounted reservation spot!
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              {success ? (
                <div className="bg-gradient-gold/15 border border-energy-yellow/40 p-4 rounded text-energy-yellow text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle className="w-4 h-4 text-energy-yellow animate-pulse" />
                    <span>Signal Dispatched!</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Message routed directly to risefitnesshub@gmail.com. We will message you on your phone or email to seal your VIP voucher. Look out for a verification code shortly!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                    <textarea
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      required
                      placeholder="e.g. Hi! I would love to check out your 12-Month commitment tier. I live near JY square. How can I pop in?"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-900 rounded text-xs text-white focus:outline-none focus:border-energy-yellow transition-colors placeholder:text-gray-700 resize-none font-sans"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-energy-yellow to-gold-600 hover:from-gold-300 hover:to-energy-yellow text-black font-display font-bold text-xs uppercase tracking-widest rounded shadow-sm hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    Message Us Now to Lock Spot
                  </button>
                </div>
              )}
            </form>

            {/* Social Accounts list */}
            <div className="pt-4 border-t border-zinc-900/60 flex items-center justify-between">
              <span className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-wider">Follow our community:</span>
              <div className="flex items-center gap-4 font-mono text-xs">
                <a
                  href="https://www.facebook.com/RiseFitnessHub/directory_contact_info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-energy-yellow text-gray-300 transition-colors"
                >
                  Facebook
                </a>
                <span className="text-zinc-800">•</span>
                <a
                  href="https://www.instagram.com/risefitnesshub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-energy-yellow text-gray-300 transition-colors"
                >
                  Instagram
                </a>
                <span className="text-zinc-800">•</span>
                <a
                  href="https://www.tiktok.com/@rise.fitness.hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-energy-yellow text-gray-300 transition-colors"
                >
                  TikTok
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Brand Copyright Disclaimer */}
        <div className="mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-600">
          <p>© 2026 Rise Fitness Hub Cebu. All Rights Reserved. Salinas Drive, Lahug.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-400 cursor-pointer">Membership Policy</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Privacy Charter</span>
            {onOpenOwnerDashboard && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenOwnerDashboard}
                  className="hover:text-energy-yellow transition-colors font-extrabold text-[10px] text-gray-500 cursor-pointer flex items-center gap-1 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-900"
                >
                  <svg className="w-3 h-3 text-energy-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Owner Portal
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
