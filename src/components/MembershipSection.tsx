import { useState, FormEvent } from 'react';
import { Check, Gift, CreditCard, Sparkles, Ticket, X, Calendar, User, Phone, Mail, ArrowRight, Download } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { MEMBERSHIP_TIERS } from '../data';
import { MembershipTier, BookingClaim } from '../types';

interface MembershipSectionProps {
  onClaimSuccess: (claim: BookingClaim) => void;
  activeClaim: BookingClaim | null;
  onClearClaim: () => void;
  showModal: boolean;
  setShowModal: (open: boolean) => void;
}

export default function MembershipSection({
  onClaimSuccess,
  activeClaim,
  onClearClaim,
  showModal,
  setShowModal
}: MembershipSectionProps) {
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(
    MEMBERSHIP_TIERS.find((t) => t.id === '12month') || MEMBERSHIP_TIERS[0]
  );

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenBookingFor = (tier: MembershipTier) => {
    setSelectedTier(tier);
    setShowModal(true);
  };

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Please fill out all required fields to secure your reservation.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    
    try {
      // Generate simple premium simulated validation codes
      const ticketId = 'RISE-' + Math.floor(1000 + Math.random() * 9000);
      const timestampString = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Construct payload for Firestore
      const dbPayload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        tierId: selectedTier.id,
        tierName: selectedTier.name,
        price: selectedTier.price,
        ticketId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save record in Firestore database on abstract-bucksaw-0nzsc project!
      await addDoc(collection(db, 'membership_signups'), dbPayload);

      // Save locally to display the voucher to the client
      const newClaim: BookingClaim = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        tierId: selectedTier.id,
        timestamp: timestampString,
        ticketId
      };

      onClaimSuccess(newClaim);
    } catch (error) {
      console.error('Firestore Error:', error);
      setFormError('A connectivity error occurred while reserving your spot. Please verify your connection or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPngTicket = () => {
    if (!activeClaim) return;
    const tierName = MEMBERSHIP_TIERS.find(t => t.id === activeClaim.tierId)?.name || 'Commitment Tier';
    const tierPrice = MEMBERSHIP_TIERS.find(t => t.id === activeClaim.tierId)?.price || 0;
    const dateStr = activeClaim.timestamp || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="600" height="350">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E4D00A" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>
  </defs>
  <style>
    .title { font-family: system-ui, -apple-system, sans-serif; font-weight: 800; fill: #ffffff; }
    .gold-accent { fill: #E4D00A; font-family: monospace; font-weight: 800; }
    .label { font-family: monospace; font-size: 11px; fill: #71717a; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .value { font-family: system-ui, -apple-system, sans-serif; font-size: 14px; fill: #e4e4e7; font-weight: 600; }
    .ticket-id { font-family: monospace; font-size: 16px; fill: #E4D00A; font-weight: 900; }
  </style>
  
  <rect width="600" height="350" rx="16" fill="#09090b" stroke="#E4D00A" stroke-width="2"/>
  
  <path d="M 0 16 A 16 16 0 0 1 16 0 L 150 0 L 120 350 L 16 350 A 16 16 0 0 1 0 334 Z" fill="#18181b" />
  <line x1="150" y1="0" x2="120" y2="350" stroke="#E4D00A" stroke-width="1" opacity="0.3" />
  
  <text x="170" y="50" class="gold-accent" font-size="10" letter-spacing="2">VIP SUMMER PASS CLAIM SECURED</text>
  <text x="170" y="75" class="title" font-size="22">RESERVATION TICKET</text>
  
  <line x1="170" y1="95" x2="560" y2="95" stroke="#27272a" stroke-width="1" stroke-dasharray="4,4" />
  
  <text x="170" y="130" class="label">Authorized Holder</text>
  <text x="170" y="152" class="value">${activeClaim.fullName}</text>
  
  <text x="170" y="200" class="label">Contact Channel</text>
  <text x="170" y="222" class="value" font-size="12">${activeClaim.email} • ${activeClaim.phone}</text>
  
  <text x="170" y="270" class="label">Target Package Tier</text>
  <text x="170" y="292" class="value" fill="#E4D00A">${tierName} — ₱${tierPrice.toLocaleString()}</text>
  
  <text x="25" y="115" class="label" fill="#a1a1aa">TICKET CODE</text>
  <rect x="20" y="130" width="105" height="40" rx="4" fill="#000000" stroke="#27272a" stroke-width="1" />
  <text x="72.5" y="155" class="ticket-id" text-anchor="middle">${activeClaim.ticketId}</text>
  
  <text x="25" y="220" font-family="monospace" font-size="9" fill="#71717a" font-weight="bold">VALID AT</text>
  <text x="25" y="235" font-family="system-ui, sans-serif" font-size="11" fill="#ffffff" font-weight="bold">SALINAS DRIVE</text>
  <text x="25" y="248" font-family="system-ui, sans-serif" font-size="10" fill="#E4D00A" font-weight="bold">LAHUG, CEBU</text>
  
  <circle cx="72.5" cy="295" r="15" fill="none" stroke="#E4D00A" stroke-width="1.5" opacity="0.4" />
  <text x="72.5" y="299" font-family="system-ui, sans-serif" font-size="9" fill="#E4D00A" font-weight="900" text-anchor="middle" opacity="0.6">RISE</text>
  
  <rect x="420" y="115" width="140" height="48" rx="6" fill="#18181b" stroke="#E4D00A" stroke-width="1" opacity="0.1" />
  <rect x="420" y="115" width="140" height="48" rx="6" fill="none" stroke="#e4d00a" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" />
  <text x="490" y="135" font-family="system-ui, sans-serif" font-size="9" fill="#E4D00A" font-weight="bold" text-anchor="middle">RISE FITNESS</text>
  <text x="490" y="148" font-family="system-ui, sans-serif" font-size="8" fill="#a1a1aa" text-anchor="middle">SUMMER PROMO</text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 700;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, 1200, 700);
        ctx.drawImage(img, 0, 0, 1200, 700);
        try {
          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `Rise_Fitness_VIP_Pass_${activeClaim.ticketId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          const svgLink = document.createElement('a');
          svgLink.href = url;
          svgLink.download = `Rise_Fitness_VIP_Pass_${activeClaim.ticketId}.svg`;
          document.body.appendChild(svgLink);
          svgLink.click();
          document.body.removeChild(svgLink);
        }
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleDownloadSvgTicket = () => {
    if (!activeClaim) return;
    const tierName = MEMBERSHIP_TIERS.find(t => t.id === activeClaim.tierId)?.name || 'Commitment Tier';
    const tierPrice = MEMBERSHIP_TIERS.find(t => t.id === activeClaim.tierId)?.price || 0;
    const dateStr = activeClaim.timestamp || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="600" height="350">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E4D00A" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>
  </defs>
  <style>
    .title { font-family: system-ui, -apple-system, sans-serif; font-weight: 800; fill: #ffffff; }
    .gold-accent { fill: #E4D00A; font-family: monospace; font-weight: 800; }
    .label { font-family: monospace; font-size: 11px; fill: #71717a; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .value { font-family: system-ui, -apple-system, sans-serif; font-size: 14px; fill: #e4e4e7; font-weight: 600; }
    .ticket-id { font-family: monospace; font-size: 16px; fill: #E4D00A; font-weight: 900; }
  </style>
  
  <rect width="600" height="350" rx="16" fill="#09090b" stroke="#E4D00A" stroke-width="2"/>
  
  <path d="M 0 16 A 16 16 0 0 1 16 0 L 150 0 L 120 350 L 16 350 A 16 16 0 0 1 0 334 Z" fill="#18181b" />
  <line x1="150" y1="0" x2="120" y2="350" stroke="#E4D00A" stroke-width="1" opacity="0.3" />
  
  <text x="170" y="50" class="gold-accent" font-size="10" letter-spacing="2">VIP SUMMER PASS CLAIM SECURED</text>
  <text x="170" y="75" class="title" font-size="22">RESERVATION TICKET</text>
  
  <line x1="170" y1="95" x2="560" y2="95" stroke="#27272a" stroke-width="1" stroke-dasharray="4,4" />
  
  <text x="170" y="130" class="label">Authorized Holder</text>
  <text x="170" y="152" class="value">${activeClaim.fullName}</text>
  
  <text x="170" y="200" class="label">Contact Channel</text>
  <text x="170" y="222" class="value" font-size="12">${activeClaim.email} • ${activeClaim.phone}</text>
  
  <text x="170" y="270" class="label">Target Package Tier</text>
  <text x="170" y="292" class="value" fill="#E4D00A">${tierName} — ₱${tierPrice.toLocaleString()}</text>
  
  <text x="25" y="115" class="label" fill="#a1a1aa">TICKET CODE</text>
  <rect x="20" y="130" width="105" height="40" rx="4" fill="#000000" stroke="#27272a" stroke-width="1" />
  <text x="72.5" y="155" class="ticket-id" text-anchor="middle">${activeClaim.ticketId}</text>
  
  <text x="25" y="220" font-family="monospace" font-size="9" fill="#71717a" font-weight="bold">VALID AT</text>
  <text x="25" y="235" font-family="system-ui, sans-serif" font-size="11" fill="#ffffff" font-weight="bold">SALINAS DRIVE</text>
  <text x="25" y="248" font-family="system-ui, sans-serif" font-size="10" fill="#E4D00A" font-weight="bold">LAHUG, CEBU</text>
  
  <circle cx="72.5" cy="295" r="15" fill="none" stroke="#E4D00A" stroke-width="1.5" opacity="0.4" />
  <text x="72.5" y="299" font-family="system-ui, sans-serif" font-size="9" fill="#E4D00A" font-weight="900" text-anchor="middle" opacity="0.6">RISE</text>
  
  <rect x="420" y="115" width="140" height="48" rx="6" fill="#18181b" stroke="#E4D00A" stroke-width="1" opacity="0.1" />
  <rect x="420" y="115" width="140" height="48" rx="6" fill="none" stroke="#e4d00a" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" />
  <text x="490" y="135" font-family="system-ui, sans-serif" font-size="9" fill="#E4D00A" font-weight="bold" text-anchor="middle">RISE FITNESS</text>
  <text x="490" y="148" font-family="system-ui, sans-serif" font-size="8" fill="#a1a1aa" text-anchor="middle">SUMMER PROMO</text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rise_Fitness_VIP_Pass_${activeClaim.ticketId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="membership" className="py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="absolute left-0 bottom-0 w-80 h-80 bg-gold-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-500/40 text-red-200 font-mono text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider animate-pulse shadow-md">
            <span>⚠️ First 20 Slots Only!</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
            🔥MID-YEAR 2026 PROMO🔥
          </h2>
          <p className="font-sans text-gray-300 text-sm sm:text-base leading-relaxed">
            Commit to your peak physical performance and secure elite level equipment, complimentary dry-saunas, and Cebu's best fitness group community right on Salinas Drive Lahug!
          </p>
        </div>

        {/* Membership Tier Cards Grid - Responsive 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
          {MEMBERSHIP_TIERS.map((tier) => {
            const is12Month = tier.id === '12month';
            return (
              <div
                key={tier.id}
                className={`flex flex-col justify-between rounded p-5 relative transition-all duration-300 ${
                  is12Month
                    ? 'bg-zinc-900 border-2 border-gold-500 shadow-gold-heavy/20 scale-102 hover:-translate-y-1'
                    : 'bg-zinc-900/40 border border-zinc-800/85 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                {is12Month && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-energy-yellow to-gold-600 text-black font-mono font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                    ★ BEST VALUE ★
                  </div>
                )}

                <div>
                  {/* Title & Duration */}
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] text-gold-500 font-bold uppercase tracking-widest">{tier.duration}</p>
                    <h3 className="font-display font-bold text-lg md:text-xl text-white leading-tight">{tier.name}</h3>
                  </div>

                  {/* Pricing Display */}
                  <div className="my-5 py-3 border-y border-zinc-800/60 flex flex-col justify-center">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-3xl md:text-4xl font-extrabold text-white">
                        ₱{tier.price.toLocaleString()}
                      </span>
                      <span className="font-mono text-gray-400 text-[10px] uppercase font-bold">Promo Rate</span>
                    </div>
                    {tier.originalPrice && (
                      <span className="font-mono text-gray-500 text-xs line-through mt-1">
                        Originally ₱{tier.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Highlight Slashes/Discounts */}
                  <div className="bg-zinc-950 p-2.5 rounded mb-4 border border-zinc-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-energy-yellow flex-shrink-0 animate-pulse" />
                    <p className="font-display font-extrabold text-[11px] text-energy-yellow">
                      {tier.savingsAndDiscounts}
                    </p>
                  </div>

                  {/* Included Perks Checklist inside the card */}
                  <div className="space-y-3.5 mb-6">
                    <p className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-energy-yellow" />
                      Free Signup Gifts:
                    </p>
                    <ul className="space-y-1.5">
                      {tier.gifts.map((gift, gIdx) => (
                        <li key={gIdx} className="flex items-start gap-1.5 text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-energy-yellow flex-shrink-0 mt-0.5" />
                          <span className="font-sans leading-snug">{gift}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Perks Standard Template Included for ALL cards */}
                  <div className="space-y-2.5 pt-3.5 border-t border-zinc-800/65 mb-6">
                    <p className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-wider">Perks Included:</p>
                    <ul className="grid grid-cols-1 gap-1.5">
                      {tier.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5 text-xs text-gray-400">
                          <span className="text-energy-yellow flex-shrink-0 sm:mt-0.5 font-bold">✓</span>
                          <span className="font-sans leading-tight">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* SECURE DEAL CTA */}
                <button
                  id={`cta-tier-btn-${tier.id}`}
                  onClick={() => handleOpenBookingFor(tier)}
                  className={`w-full py-3 rounded font-display font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                    is12Month
                      ? 'bg-gradient-to-r from-energy-yellow to-gold-600 hover:from-gold-300 hover:to-energy-yellow text-black shadow-gold-heavy/30'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  Secure Spot
                </button>
              </div>
            );
          })}
        </div>

        {/* Accepted Payment Systems Accent */}
        <div className="bg-zinc-900 border border-zinc-900 p-6 rounded flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto shadow-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-energy-yellow" />
            <div>
              <p className="font-display font-medium text-sm text-gray-100">Simple & Secure Payment Methods</p>
              <p className="font-sans text-xs text-gray-500">Fast clearance to lock-in your summer discounted slots immediately.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 font-mono text-xs font-bold text-gray-300">
            <span className="bg-black border border-zinc-800 rounded px-3 py-1.5">● CASH</span>
            <span className="bg-black border border-zinc-800 rounded px-3 py-1.5">● BANK TRANSFER</span>
            <span className="bg-black border border-zinc-800 rounded px-3 py-1.5">● QRPH</span>
            <span className="bg-black border border-zinc-900 rounded px-3 py-1.5 border-dashed border-energy-yellow/30 text-energy-yellow">★ CREDIT CARDS ACCEPTED</span>
          </div>
        </div>

        {/* ACTIVE RESERVED VIP TICKET VIEW IF PREVIOUSLY ENROLLED */}
        {activeClaim && (
          <div className="mt-16 max-w-2xl mx-auto bg-gradient-to-br from-gold-950/40 via-zinc-900 to-black border-2 border-gold-500 rounded p-6 sm:p-8 shadow-gold-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-gold/5 rounded-full blur-xl pointer-events-none"></div>
            
            {/* Absolute close button */}
            <button
              onClick={onClearClaim}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-zinc-950 p-1.5 rounded transition-colors border border-zinc-850 hover:border-gold-500/40 z-10"
              title="Cancel Reservation Ticket"
              id="close-membership-ticket"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between border-b border-gold-900/40 pb-4 mb-6">
              <div>
                <span className="font-mono text-[9px] text-energy-yellow font-extrabold uppercase tracking-widest bg-gold-950 border border-gold-500/20 px-2 py-0.5 rounded">
                  VIP Summer Pass Claim Secured
                </span>
                <h4 className="font-display font-bold text-lg text-white mt-1">Your Reservation Ticket</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold">Authorized Holder</p>
                <p className="font-display font-bold text-gray-100">{activeClaim.fullName}</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold">Contact Channel</p>
                <p className="font-sans text-xs text-gray-300">{activeClaim.email} • {activeClaim.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold">Target Package Tier</p>
                <p className="font-display font-bold text-energy-yellow">
                  {MEMBERSHIP_TIERS.find(t => t.id === activeClaim.tierId)?.name || 'Commitment Tier'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold">Claim Code Sequence</p>
                <p className="font-mono text-sm text-white font-extrabold uppercase bg-black px-2 py-0.5 rounded border border-zinc-800 inline-block">
                  {activeClaim.ticketId}
                </p>
              </div>
            </div>

            {/* DOWNLOAD TICKET ACTIONS */}
            <div className="mt-6 pt-4 border-t border-zinc-850 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleDownloadSvgTicket}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-energy-yellow to-gold-600 hover:from-gold-300 hover:to-energy-yellow text-black font-display font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded shadow-gold-heavy/20 transition-all duration-200 cursor-pointer w-full sm:w-auto"
              >
                <Download className="w-3.5 h-3.5" />
                Download Vector Pass (.SVG)
              </button>
              <button
                type="button"
                onClick={handleDownloadPngTicket}
                className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-gray-300 border border-zinc-800 hover:border-zinc-700 font-display font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded transition-all duration-200 cursor-pointer w-full sm:w-auto"
              >
                <Download className="w-3.5 h-3.5" />
                Download as Image (.PNG)
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-sans text-[11px] text-gray-400">
                ★ Present this ticket code to our front counter at Salinas Drive to claim your welcome dri-fit shirt and get your access card processed.
              </p>
              <span className="font-mono text-xs text-energy-yellow bg-energy-yellow/10 border border-energy-yellow/20 px-3 py-1 rounded font-bold whitespace-nowrap">
                ✓ VALID IN CEBU
              </span>
            </div>
          </div>
        )}

      </div>

      {/* OVERLAY INTERACTIVE RESERVATION DIALOG / MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-gold-500/40 rounded shadow-gold-glow overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="bg-gradient-gold p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <Ticket className="w-8 h-8 text-white mb-2" />
              <h3 className="font-display font-bold text-2xl text-black">Lock In Your Summer Spot</h3>
              <p className="font-sans text-xs text-yellow-950 font-bold mt-1 uppercase tracking-wider">
                Reserving: {selectedTier.name} — ₱{selectedTier.price.toLocaleString()} promo rate
              </p>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmitForm} className="p-6 md:p-8 space-y-6">
              {formError && (
                <div className="bg-red-950/70 border border-red-500/40 p-3 rounded text-red-100 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullname" className="block font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Roland Abellanosa"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-energy-yellow transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. roland@risefitness.com"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-energy-yellow transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Primary Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +63 917 123 4567"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-energy-yellow transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Perks Recap in Booking Form */}
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-3">
                <p className="font-mono text-[10px] text-energy-yellow font-bold uppercase tracking-wider">Unlocks upon booking validation:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
                  {selectedTier.gifts.map((gift, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-energy-yellow flex-shrink-0" />
                      <span className="truncate">{gift}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-energy-yellow flex-shrink-0" />
                    <span>Waived Registration Fee</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-energy-yellow flex-shrink-0" />
                    <span>No Lock-In Joining Penalty</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-gradient-to-r from-energy-yellow to-gold-600 hover:from-gold-300 hover:to-energy-yellow text-black font-display font-extrabold text-sm uppercase tracking-widest rounded transition-all duration-200 shadow-gold-heavy/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Securing Your Spot...
                  </>
                ) : (
                  <>
                    Secure VIP Deal Now
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center font-sans text-[10px] text-gray-500">
                By securing this summer spot, you get a unique booking code. We will also follow up on your mobile or email to invite you for your personal tour at Sonata Building Salinas Lahug.
              </p>
            </form>

          </div>
        </div>
      )}
    </section>
  );
}
