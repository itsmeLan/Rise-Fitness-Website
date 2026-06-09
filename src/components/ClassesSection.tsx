import { useState, FormEvent } from 'react';
import { Calendar, Users, Dumbbell, Zap, Sparkles, Clock, Check, X, User, Phone, ArrowRight, Ticket } from 'lucide-react';
import { GROUP_CLASSES } from '../data';
import { GroupClass } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ClassesSection() {
  const [selectedDayFilter, setSelectedDayFilter] = useState<'All' | 'MWF' | 'TTS'>('All');
  const [bookedClasses, setBookedClasses] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Class Booking Modal states
  const [bookingClass, setBookingClass] = useState<GroupClass | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredClasses = GROUP_CLASSES.filter((cls) => {
    if (selectedDayFilter === 'All') return true;
    if (selectedDayFilter === 'MWF') return cls.day.includes('Monday');
    if (selectedDayFilter === 'TTS') return cls.day.includes('Tuesday') || cls.day.includes('Saturday');
    return true;
  });

  const handleClassBtnClick = (cls: GroupClass) => {
    if (bookedClasses.includes(cls.id)) {
      setBookedClasses(bookedClasses.filter((id) => id !== cls.id));
      setSuccessMsg(null);
      return;
    }
    setBookingClass(cls);
    setFullName('');
    setPhone('');
    setFormError('');
  };

  const handleClassRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookingClass) return;
    if (!fullName.trim() || !phone.trim()) {
      setFormError('Please input your name and phone number to secure your spot.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const ticketId = 'CLASS-' + Math.floor(1000 + Math.random() * 9000);
      const dbPayload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        classId: bookingClass.id,
        className: bookingClass.name,
        classTime: bookingClass.time,
        instructor: bookingClass.instructor,
        ticketId,
        status: 'reserved',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'class_reservations'), dbPayload);

      setBookedClasses([...bookedClasses, bookingClass.id]);
      setSuccessMsg(`✓ Spot secured for "${bookingClass.name}" under Code ${ticketId}! Present your code at Salinas Drive counter.`);
      setBookingClass(null);

      setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);
    } catch (error) {
      console.error('Firestore Class Registration Error:', error);
      setFormError('Could not reserve spot. Please verify your connection & try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="classes" className="py-24 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden">
      {/* Decorative Gold flare blur */}
      <div className="absolute right-0 top-1/3 w-72 h-72 bg-energy-yellow/5 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-4">
            <span className="font-mono text-[11px] font-bold tracking-widest text-energy-yellow bg-zinc-900 border border-zinc-800 px-3 py-1 rounded">
              High Tempo Programs
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              Group Sessions & Personalized Training
            </h2>
            <p className="font-sans text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Step into high-tempo fat-burning dances, heavy lifting circuits, or custom 1-on-1 personal coaching. Our dynamic schedule fits perfectly around Cebu’s busy business professional lifestyles.
            </p>
          </div>
          
          {/* Day Filters */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="bg-zinc-900/80 p-1 rounded-sm border border-zinc-800 flex items-center gap-1">
              <button
                onClick={() => setSelectedDayFilter('All')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-sm transition-all duration-200 ${
                  selectedDayFilter === 'All'
                    ? 'bg-energy-yellow text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Classes
              </button>
              <button
                onClick={() => setSelectedDayFilter('MWF')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-sm transition-all duration-200 ${
                  selectedDayFilter === 'MWF'
                    ? 'bg-energy-yellow text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Mon/Wed/Fri
              </button>
              <button
                onClick={() => setSelectedDayFilter('TTS')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-sm transition-all duration-200 ${
                  selectedDayFilter === 'TTS'
                    ? 'bg-energy-yellow text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tue/Thu/Sat
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Booking success status */}
        {successMsg && (
          <div className="mb-8 p-3 bg-gradient-gold/20 border border-energy-yellow/40 rounded text-energy-yellow text-xs font-bold text-center animate-pulse flex items-center justify-center gap-2 max-w-2xl mx-auto">
            <Sparkles className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* Classes Layout Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {filteredClasses.map((cls) => {
            const isBooked = bookedClasses.includes(cls.id);
            const isAerobics = cls.name.includes("Step Up");
            return (
              <div
                key={cls.id}
                className={`bg-zinc-900/40 border rounded p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isBooked 
                    ? 'border-energy-yellow/80 bg-zinc-900/90 shadow-gold-glow' 
                    : isAerobics 
                      ? 'border-gold-500/30 bg-gradient-to-br from-zinc-900/60 to-gold-950/20' 
                      : 'border-zinc-800/85 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Category Pill Tag + Intensity Indicator */}
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-extrabold ${
                      isAerobics 
                        ? 'bg-energy-yellow text-black' 
                        : 'bg-zinc-950 text-gold-500 border border-gold-900/40'
                    }`}>
                      {isAerobics ? '★ Highlight Event' : 'Community Session'}
                    </span>
                    <span className="font-sans text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                      Intensity:{' '}
                      <strong className={`font-display text-xs ${
                        cls.intensity === 'Extremely High' ? 'text-red-500' : 'text-energy-yellow'
                      }`}>
                        {cls.intensity}
                      </strong>
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                      {cls.name}
                    </h3>
                    <p className="font-sans text-xs text-gray-400 mt-1 font-medium flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-zinc-500" /> Lead Coach: <span className="text-zinc-200 font-bold">{cls.instructor}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-sm text-gray-400 leading-relaxed">
                    {cls.description}
                  </p>

                  {/* Class Timings & Day */}
                  <div className="grid grid-cols-2 gap-4 bg-zinc-950/80 p-3 rounded border border-zinc-900/70">
                    <div className="space-y-0.5">
                      <p className="font-mono text-[9px] text-gray-500 uppercase font-bold tracking-wider">Scheduled on</p>
                      <p className="font-display font-semibold text-xs text-white truncate">{cls.day}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-mono text-[9px] text-gray-500 uppercase font-bold tracking-wider">Session Frame</p>
                      <p className="font-display font-semibold text-xs text-white flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-energy-yellow" /> {cls.time}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Instant Class Trial Surcharge action */}
                <div className="mt-8 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9px] text-gray-500 uppercase font-bold">Class Pricing</p>
                    <p className="font-display font-bold text-sm text-white">FREE For Members</p>
                  </div>
                  
                  <button
                    onClick={() => handleClassBtnClick(cls)}
                    className={`font-mono text-[11px] font-extrabold uppercase tracking-widest px-4 py-2.5 rounded transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                      isBooked
                        ? 'bg-zinc-805 text-energy-yellow border border-energy-yellow/50'
                        : 'bg-zinc-950 border border-zinc-800 text-gray-300 hover:border-energy-yellow/50 hover:text-white'
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-energy-yellow" />
                        Reserved ✓
                      </>
                    ) : (
                      'Reserve Class Spot'
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* 1-on-1 Personal Training Spotlight */}
        <div className="mt-16 bg-zinc-900/30 border border-zinc-900 rounded p-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-energy-yellow" />
              <span className="font-mono text-xs font-bold text-energy-yellow uppercase tracking-widest">Premier Coaching</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-white">1-on-1 Elite Personal Trainer Programs</h3>
            <p className="font-sans text-sm text-gray-400 leading-relaxed">
              Accelerate your transformation with tailored instruction. Receive custom daily workout blueprints, structural movement screens, and private macro guidance built strictly around your biological needs. Your first 2 sessions are <strong>100% FREE</strong> on our 12-Month tier!
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono font-bold text-gray-200">
              <span className="bg-black/60 px-3 py-1.5 rounded">✓ Certified Physical Coaches</span>
              <span className="bg-black/60 px-3 py-1.5 rounded">✓ Weekly BMI Monitoring</span>
              <span className="bg-black/60 px-3 py-1.5 rounded">✓ Direct WhatsApp Coach Line</span>
            </div>
          </div>
          <div className="flex-shrink-0 w-full lg:w-auto">
            <a
              href="#membership"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-energy-yellow to-gold-600 hover:from-gold-300 hover:to-energy-yellow text-black font-display font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded shadow-gold-heavy/20 transition-all duration-200"
            >
              Get Free PT Sessions
            </a>
          </div>
        </div>

      </div>

      {/* Class Reservation Modal */}
      {bookingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-zinc-900 border border-gold-500/40 rounded shadow-gold-glow overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="bg-gradient-gold p-6 relative">
              <button
                onClick={() => setBookingClass(null)}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
              <Ticket className="w-8 h-8 text-white mb-2" />
              <h3 className="font-display font-bold text-xl text-black">Reserve Class Spot</h3>
              <p className="font-sans text-xs text-yellow-950 font-bold mt-1 uppercase tracking-wider">
                Event: {bookingClass.name} with {bookingClass.instructor}
              </p>
            </div>

            {/* Form Content */}
            <form onSubmit={handleClassRegisterSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-950/70 border border-red-500/40 p-3 rounded text-red-100 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="clsName" className="block font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="clsName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jean Abellanosa"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-energy-yellow transition-colors placeholder:text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="clsPhone" className="block font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Cebu Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="clsPhone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +63 917 111 2222"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-energy-yellow transition-colors placeholder:text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-energy-yellow to-gold-600 hover:from-gold-300 hover:to-energy-yellow text-black font-display font-extrabold text-xs uppercase tracking-widest rounded transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Securing Spot...
                  </>
                ) : (
                  <>
                    Confirm Free Roster Spot
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded text-[10px] text-gray-400">
                ⚠️ Class spots are highly limited. If you cannot attend, please toggle class button to release your sport.
              </div>
            </form>

          </div>
        </div>
      )}
    </section>
  );
}
