import { useState, useEffect, FormEvent } from 'react';
import { db, auth, signInWithGoogle, logOut } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Shield, Sparkles, LogOut, Trash2, Check, X, RefreshCw, Layers, Users, TrendingUp, DollarSign } from 'lucide-react';

interface SignupItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tierId: string;
  tierName: string;
  price: number;
  ticketId: string;
  status: 'pending' | 'claimed' | 'canceled';
  createdAt: string;
}

interface ClassReservationItem {
  id: string;
  fullName: string;
  phone: string;
  classId: string;
  className: string;
  classTime: string;
  instructor: string;
  ticketId: string;
  status: 'reserved' | 'checked-in' | 'canceled';
  createdAt: string;
}

interface OwnerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OwnerDashboard({ isOpen, onClose }: OwnerDashboardProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Firestore records state
  const [signups, setSignups] = useState<SignupItem[]>([]);
  const [classReservations, setClassReservations] = useState<ClassReservationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Custom UI Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Safety Double-Tap Delete Confirmation states (bypasses browser confirm popup blocks)
  const [confirmDeleteSignupId, setConfirmDeleteSignupId] = useState<string | null>(null);
  const [confirmDeleteClassId, setConfirmDeleteClassId] = useState<string | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Automatically dismiss toasts after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Check auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Automatically authenticate if Gmail matches
      if (user && user.email === 'rolandabellanosa321@gmail.com') {
        setIsAuthenticated(true);
      }
    });
    return () => unsub();
  }, []);

  // Fetch from Firestore when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setPermissionError(null);

    // 1. Listen to membership signups
    const qSignups = query(collection(db, 'membership_signups'), orderBy('createdAt', 'desc'));
    const unsubSignups = onSnapshot(qSignups, (snapshot) => {
      const list: SignupItem[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as SignupItem);
      });
      setSignups(list);
      setIsLoading(false);
      setPermissionError(null);
    }, (error: any) => {
      console.error("Failed to fetch signups:", error);
      setIsLoading(false);
      if (error?.message && error.message.toLowerCase().includes("permission")) {
        setPermissionError("Missing database read permissions. Log in with Google as rolandabellanosa321@gmail.com to query live data.");
      }
    });

    // 2. Listen to class reservations
    const qClasses = query(collection(db, 'class_reservations'), orderBy('createdAt', 'desc'));
    const unsubClasses = onSnapshot(qClasses, (snapshot) => {
      const list: ClassReservationItem[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ClassReservationItem);
      });
      setClassReservations(list);
      setPermissionError(null);
    }, (error: any) => {
      console.error("Failed to fetch class reservations:", error);
      if (error?.message && error.message.toLowerCase().includes("permission")) {
        setPermissionError("Missing database read permissions. Log in with Google as rolandabellanosa321@gmail.com to query live data.");
      }
    });

    return () => {
      unsubSignups();
      unsubClasses();
    };
  }, [isAuthenticated]);

  // Handle Passcode login
  const handlePasscodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passcode === 'RISE2026') {
      setIsAuthenticated(true);
      setAuthError('');
      triggerToast("System unlocked via master passcode.", "info");
    } else {
      setAuthError('Incorrect system owner pincode. Access denied.');
    }
  };

  // Handle Google Auth LogIn
  const handleGoogleSignIn = async () => {
    try {
      setAuthError('');
      const user = await signInWithGoogle();
      if (user.email === 'rolandabellanosa321@gmail.com') {
        setIsAuthenticated(true);
        triggerToast("Welcome administrator Roland! Cloud synchronization active.", "success");
      } else {
        // If not the owner email, sign out and flag error
        await logOut();
        setAuthError(`Email ${user.email} is not listed as Rise Hub Owner.`);
      }
    } catch (e) {
      setAuthError('Google sign in aborted or failed.');
    }
  };

  const handleSignOut = async () => {
    await logOut();
    setIsAuthenticated(false);
    setPasscode('');
    setPermissionError(null);
    setConfirmDeleteSignupId(null);
    setConfirmDeleteClassId(null);
    triggerToast("Signed out. Dev console locked.", "info");
  };

  // Modify Membership Status
  const handleUpdateSignupStatus = async (id: string, nextStatus: 'pending' | 'claimed' | 'canceled') => {
    try {
      const docRef = doc(db, 'membership_signups', id);
      await updateDoc(docRef, { status: nextStatus, updatedAt: new Date().toISOString() });
      triggerToast(`Member record marked as "${nextStatus}" successfully.`, "success");
    } catch (error: any) {
      console.error("Failed to modify signup status:", error);
      const isPermErr = error?.message?.toLowerCase().includes("permission");
      triggerToast(
        isPermErr 
          ? "🔒 Permission Denied! Database is secure. Please authenticate via owner Google Account." 
          : "Failed to modify signup status in database.",
        "error"
      );
    }
  };

  // Modify Class Reservation Status
  const handleUpdateClassStatus = async (id: string, nextStatus: 'reserved' | 'checked-in' | 'canceled') => {
    try {
      const docRef = doc(db, 'class_reservations', id);
      await updateDoc(docRef, { status: nextStatus });
      triggerToast(`Class reservation marked as "${nextStatus}" successfully.`, "success");
    } catch (error: any) {
      console.error("Failed to modify class status:", error);
      const isPermErr = error?.message?.toLowerCase().includes("permission");
      triggerToast(
        isPermErr 
          ? "🔒 Permission Denied! Database is secure. Please authenticate via owner Google Account." 
          : "Failed to modify class reservation status in database.",
        "error"
      );
    }
  };

  // Delete Signup Records (Cleanup utility)
  const handleDeleteSignup = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'membership_signups', id));
      setConfirmDeleteSignupId(null);
      triggerToast("Client signup document permanently deleted from Google Cloud Firestore.", "success");
    } catch (error: any) {
      console.error("Failed to delete signup:", error);
      const isPermErr = error?.message?.toLowerCase().includes("permission");
      triggerToast(
        isPermErr 
          ? "🔒 Permission Denied! Database is secure. Please authenticate via owner Google Account." 
          : "Failed to delete document from database.",
        "error"
      );
    }
  };

  // Delete Class Reservation Document
  const handleDeleteClassRes = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'class_reservations', id));
      setConfirmDeleteClassId(null);
      triggerToast("Class reservation document permanently deleted from Google Cloud Firestore.", "success");
    } catch (error: any) {
      console.error("Failed to delete class reservation:", error);
      const isPermErr = error?.message?.toLowerCase().includes("permission");
      triggerToast(
        isPermErr 
          ? "🔒 Permission Denied! Database is secure. Please authenticate via owner Google Account." 
          : "Failed to delete document from database.",
        "error"
      );
    }
  };

  // Stats Counters
  const totalSubscribersValue = signups.reduce((acc, item) => {
    if (item.status !== 'canceled') return acc + item.price;
    return acc;
  }, 0);

  const activePromoSignups = signups.filter(x => x.status === 'pending').length;
  const activeClassBookingsList = classReservations.filter(x => x.status === 'reserved').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/90 backdrop-blur-md animate-fade-in">
      
      {/* Off-canvas sidebar block taking full screen or slide-in panel */}
      <div className="h-full w-full max-w-6xl bg-zinc-950 border-l border-zinc-900 flex flex-col justify-between overflow-hidden shadow-2xl relative">
        
        {/* Background glow flares */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* TOP METADATA HEADER */}
        <header className="bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-black border border-gold-500 rounded p-1.5">
              <Shield className="w-5 h-5 text-energy-yellow" />
            </div>
            <div>
              <p className="font-mono text-[9px] text-gold-500 uppercase font-bold tracking-widest">Cebu Hub Command</p>
              <h1 className="font-display font-extrabold text-lg text-white">Owner's Real-Time Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-mono text-[10px] uppercase font-bold tracking-wide px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-black hover:bg-zinc-900 text-white font-mono text-[10px] uppercase font-bold tracking-wide px-4 py-2 border border-zinc-800 rounded transition-colors cursor-pointer"
            >
              Exit Console
            </button>
          </div>
        </header>

        {/* COMMAND BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 z-10">
          
          {/* 1. GATEWAY SCREEN IF NOT AUTHENTICATED */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto my-12 bg-zinc-900 border border-zinc-805 rounded p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="text-center space-y-2">
                <Shield className="w-12 h-12 text-energy-yellow mx-auto animate-pulse" />
                <h3 className="font-display font-extrabold text-xl text-white">Secure Access Required</h3>
                <p className="font-sans text-xs text-gray-400">
                  Access is strictly restricted to the Rise Fitness Hub administrative owners.
                </p>
              </div>

              {authError && (
                <div className="bg-red-950/70 border border-red-500/40 p-3.5 rounded text-red-200 text-xs font-mono font-bold leading-normal">
                  ⚠️ {authError}
                </div>
              )}

              {/* Dual Gateways */}
              <div className="space-y-6">
                
                {/* Method A: Google Login for rolandabellanosa321@gmail.com */}
                <div className="space-y-2">
                  <p className="font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider text-center">Owner Authentication</p>
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 bg-white text-black hover:bg-zinc-100 font-display font-bold text-xs uppercase tracking-widest rounded transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66.6-.79 1.3-.79 2.09z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Sign In with Google
                  </button>
                  <p className="font-sans text-[10px] text-gray-500 text-center">
                    Requires Google Account linking rolandabellanosa321@gmail.com
                  </p>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-zinc-800"></div>
                  <span className="flex-shrink mx-4 text-[9px] font-mono text-gray-650 uppercase font-bold">OR QUICK PASSCODE</span>
                  <div className="flex-grow border-t border-zinc-800"></div>
                </div>

                {/* Method B: Local Passcode lock-out */}
                <form onSubmit={handlePasscodeSubmit} className="space-y-3.5">
                  <div>
                    <label htmlFor="pincode" className="block font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1.5 text-center">
                      Manager Bypass Passcode
                    </label>
                    <input
                      id="pincode"
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter Manager Passcode"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-center text-sm font-mono text-white tracking-widest focus:outline-none focus:border-energy-yellow transition-colors placeholder:text-gray-700 placeholder:tracking-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-energy-yellow to-gold-600 hover:from-gold-300 hover:to-energy-yellow text-black font-display font-black text-xs uppercase tracking-widest rounded transition-all duration-200 cursor-pointer"
                  >
                    Submit Passcode
                  </button>
                  <p className="font-sans text-[10px] text-zinc-500 text-center">
                    Enter the developer's instant override passcode `RISE2026` to evaluate.
                  </p>
                </form>

              </div>
            </div>
          ) : (
            // 2. THE REAL LIVE CONTROL PANELS & LISTS
            <div className="space-y-12 animate-fade-in">
              
              {/* stats overview cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-zinc-900 border border-zinc-850 rounded p-5 relative overflow-hidden">
                  <div className="absolute right-4 top-4 bg-gold-950 border border-gold-500/20 rounded p-1.5 text-energy-yellow">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="font-mono text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Active Subscriptions</p>
                  <h4 className="font-display font-black text-white text-2xl sm:text-3xl mt-2">{signups.length} Users</h4>
                  <p className="font-sans text-[11px] text-gold-500 mt-1">✓ Secured in the database</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-850 rounded p-5 relative overflow-hidden">
                  <div className="absolute right-4 top-4 bg-gold-950 border border-gold-500/20 rounded p-1.5 text-energy-yellow">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <p className="font-mono text-[10px] text-gray-500 uppercase font-bold tracking-wider">Value pipeline locked</p>
                  <h4 className="font-display font-black text-gradient-gold text-2xl sm:text-3xl mt-2">
                    ₱{totalSubscribersValue.toLocaleString()}
                  </h4>
                  <p className="font-sans text-[11px] text-gray-400 mt-1">Based on chosen promo package rates</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-850 rounded p-5 relative overflow-hidden">
                  <div className="absolute right-4 top-4 bg-gold-950 border border-gold-500/20 rounded p-1.5 text-energy-yellow">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="font-mono text-[10px] text-gray-500 uppercase font-bold tracking-wider">Pending Gifts Processing</p>
                  <h4 className="font-display font-black text-white text-2xl sm:text-3xl mt-2">{activePromoSignups} Members</h4>
                  <p className="font-sans text-[11px] text-red-400 mt-1">Pending front counter vouchers</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-850 rounded p-5 relative overflow-hidden">
                  <div className="absolute right-4 top-4 bg-gold-950 border border-gold-500/20 rounded p-1.5 text-energy-yellow">
                    <Layers className="w-4 h-4" />
                  </div>
                  <p className="font-mono text-[10px] text-gray-500 uppercase font-bold tracking-wider">Class Reserves Active</p>
                  <h4 className="font-display font-black text-white text-2xl sm:text-3xl mt-2">{activeClassBookingsList} Slots</h4>
                  <p className="font-sans text-[11px] text-green-400 mt-1">Guaranteed group class rosters</p>
                </div>

              </section>

              {/* 2.5 CLOUD SECURITY BANNER IF PERMISSION DEFICIT DETECTED */}
              {permissionError && (
                <div id="permission-warning-banner" className="bg-gradient-to-r from-red-950/40 via-black to-red-950/40 border-2 border-red-900/40 p-5 rounded text-center space-y-3 shadow-lg">
                  <div className="inline-flex items-center gap-1.5 bg-red-950 border border-red-800 px-3 py-1 rounded-full text-red-400 font-mono text-[10px] uppercase font-bold tracking-widest">
                    <span>🔒 SECURE SHIELD ACTIVE</span>
                  </div>
                  <p className="font-display font-light text-sm text-gray-100 max-w-3xl mx-auto leading-relaxed">
                    Cloud Firestore security rules strictly protect customer PII (Personal Identifiable Information) from unauthenticated public scraping and data harvesting.
                  </p>
                  <p className="font-sans text-xs text-gray-400 max-w-2xl mx-auto">
                    To query or make modifications to live records, please click <strong>Sign Out</strong> above and complete Google Admin Sign-In using: <strong className="text-white">rolandabellanosa321@gmail.com</strong>.
                  </p>
                </div>
              )}

              {/* TABLE 1: SECURED MEMBERSHIPS SIGNUPS LIST */}
              <section className="bg-zinc-900 border border-zinc-850 rounded overflow-hidden">
                <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-0.5">
                    <h3 className="font-display font-bold text-lg text-white">🔥 Mid-Year Promo Signups List</h3>
                    <p className="font-sans text-xs text-gray-400">
                      Real-time live checklist. Mark clients as "Claimed" once they pay or complete sign-up processing at Salinas Drive front counter.
                    </p>
                  </div>
                  <span className="bg-energy-yellow/10 border border-energy-yellow/20 px-3 py-1.5 rounded font-mono text-xs text-energy-yellow font-bold self-start sm:self-center">
                    ● Database Stream Listener Active
                  </span>
                </div>

                {isLoading ? (
                  <div className="p-12 text-center text-gray-500 font-mono text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-energy-yellow" />
                    Fetching signups matrix...
                  </div>
                ) : signups.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 font-mono text-xs">
                    No membership signup documents present in collection `membership_signups`.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 text-gray-400 uppercase tracking-wider font-mono text-[10px] bg-black/40">
                          <th className="p-4">Customer Name</th>
                          <th className="p-4">Contact Info</th>
                          <th className="p-4">Chosen Promo Tier</th>
                          <th className="p-4">Locked Price</th>
                          <th className="p-4">Voucher ID</th>
                          <th className="p-4">Voucher Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {signups.map((item) => (
                          <tr key={item.id} className="border-b border-zinc-800/60 hover:bg-zinc-850/30 transition-colors">
                            <td className="p-4 font-display font-bold text-white text-[13px]">{item.fullName}</td>
                            <td className="p-4 space-y-0.5">
                              <p className="text-gray-300">{item.phone}</p>
                              <p className="text-gray-500">{item.email}</p>
                            </td>
                            <td className="p-4">
                              <span className="text-gray-300 font-semibold">{item.tierName}</span>
                            </td>
                            <td className="p-4 font-mono font-bold text-white">₱{item.price.toLocaleString()}</td>
                            <td className="p-4">
                              <span className="font-mono bg-black px-2 py-0.5 rounded border border-zinc-800 text-gold-500 text-[11px] font-bold">
                                {item.ticketId}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded font-mono text-[10px] font-bold uppercase ${
                                item.status === 'claimed'
                                  ? 'bg-green-950 text-green-300 border border-green-800/40'
                                  : item.status === 'canceled'
                                    ? 'bg-zinc-800 text-gray-500'
                                    : 'bg-gold-950 text-energy-yellow border border-gold-800/30 animate-pulse'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleUpdateSignupStatus(item.id, 'claimed')}
                                className="bg-green-950 hover:bg-green-900 border border-green-800/50 p-2 rounded text-green-300 inline-flex items-center cursor-pointer"
                                title="Mark Claimed (Active Member)"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateSignupStatus(item.id, 'canceled')}
                                className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 p-2 rounded text-gray-400 inline-flex items-center cursor-pointer"
                                title="Cancel Ticket"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              
                              {confirmDeleteSignupId === item.id ? (
                                <span className="inline-flex gap-1 ml-1">
                                  <button
                                    onClick={() => handleDeleteSignup(item.id)}
                                    className="bg-red-650 hover:bg-red-600 text-white font-mono text-[9px] font-bold px-2 py-1 rounded shadow-md uppercase transition-all duration-200 cursor-pointer"
                                  >
                                    Confirm?
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteSignupId(null)}
                                    className="bg-zinc-850 hover:bg-zinc-800 text-gray-405 font-mono text-[9px] font-bold px-2 py-1 rounded transition-all duration-200 cursor-pointer"
                                  >
                                    No
                                  </button>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteSignupId(item.id)}
                                  className="bg-zinc-950 hover:bg-red-950 hover:text-red-300 hover:border-red-800 p-2 rounded text-gray-600 border border-zinc-850 inline-flex items-center cursor-pointer"
                                  title="Delete Document permanently"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* TABLE 2: GROUP CLASS SPOT RESERVATIONS */}
              <section className="bg-zinc-900 border border-zinc-850 rounded overflow-hidden">
                <div className="p-5 border-b border-zinc-800">
                  <h3 className="font-display font-bold text-lg text-white">💪 Group Class Reservist Rosters</h3>
                  <p className="font-sans text-xs text-gray-400">
                    See which Cebu fitness enthusiasts locked-in spots for Step Up Aerobics Dance, Iron Grit, or MetCon programs.
                  </p>
                </div>

                {classReservations.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 font-mono text-xs">
                    No class reservation documents present in collection `class_reservations`.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 text-gray-400 uppercase tracking-wider font-mono text-[10px] bg-black/40">
                          <th className="p-4">Participant Name</th>
                          <th className="p-4">Phone Number</th>
                          <th className="p-4">Target Program Class</th>
                          <th className="p-4">Assigned Coach</th>
                          <th className="p-4">Session Frame</th>
                          <th className="p-4">Ref Ticket</th>
                          <th className="p-4">Roster Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classReservations.map((item) => (
                          <tr key={item.id} className="border-b border-zinc-800/60 hover:bg-zinc-850/30 transition-colors">
                            <td className="p-4 font-display font-bold text-white text-[13px]">{item.fullName}</td>
                            <td className="p-4 text-gray-300 font-semibold">{item.phone}</td>
                            <td className="p-4">
                              <span className="text-energy-yellow font-bold">{item.className}</span>
                            </td>
                            <td className="p-4 text-gray-400">{item.instructor}</td>
                            <td className="p-4 text-gray-500 font-mono">{item.classTime}</td>
                            <td className="p-4">
                              <span className="font-mono bg-black px-2 py-0.5 rounded border border-zinc-800 text-white text-[10px]">
                                {item.ticketId}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded font-mono text-[10px] font-bold uppercase ${
                                item.status === 'checked-in'
                                  ? 'bg-green-950 text-green-300 border border-green-800/40'
                                  : item.status === 'canceled'
                                    ? 'bg-zinc-800 text-gray-500'
                                    : 'bg-gold-950 text-energy-yellow border border-gold-800/30 animate-pulse'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleUpdateClassStatus(item.id, 'checked-in')}
                                className="bg-green-950 hover:bg-green-900 border border-green-800/50 p-2 rounded text-green-300 inline-flex items-center cursor-pointer"
                                title="Check In Participant"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateClassStatus(item.id, 'canceled')}
                                className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 p-2 rounded text-gray-400 inline-flex items-center cursor-pointer"
                                title="Cancel Roster Spot"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              
                              {confirmDeleteClassId === item.id ? (
                                <span className="inline-flex gap-1 ml-1">
                                  <button
                                    onClick={() => handleDeleteClassRes(item.id)}
                                    className="bg-red-650 hover:bg-red-600 text-white font-mono text-[9px] font-bold px-2 py-1 rounded shadow-md uppercase transition-all duration-200 cursor-pointer"
                                  >
                                    Confirm?
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteClassId(null)}
                                    className="bg-zinc-850 hover:bg-zinc-800 text-gray-405 font-mono text-[9px] font-bold px-2 py-1 rounded transition-all duration-200 cursor-pointer"
                                  >
                                    No
                                  </button>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteClassId(item.id)}
                                  className="bg-zinc-950 hover:bg-red-950 hover:text-red-300 hover:border-red-800 p-2 rounded text-gray-600 border border-zinc-850 inline-flex items-center cursor-pointer"
                                  title="Delete Document permanently"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

            </div>
          )}

        </div>

        {/* FEEDBACK SLIDE-IN TOASTS PORTAL */}
        {toast && (
          <div id="dashboard-toast" className={`fixed bottom-6 right-6 z-55 px-5 py-4 rounded-md border text-xs font-mono font-bold tracking-wide flex items-center gap-3 shadow-2xl animate-fade-in ${
            toast.type === 'success'
              ? 'bg-zinc-900 text-green-300 border-green-800/80 shadow-green-950/20'
              : toast.type === 'error'
                ? 'bg-zinc-900 text-red-300 border-red-800/80 shadow-red-950/20'
                : 'bg-zinc-900 text-energy-yellow border-zinc-800/80'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
            <span>{toast.message}</span>
          </div>
        )}

        {/* FOOTER COUNTER BRACKET */}
        <footer className="bg-zinc-900 border-t border-zinc-800 p-4 shrink-0 flex items-center justify-between text-[11px] font-mono text-gray-500 z-10">
          <span>Salinas Drive Lahug Command Center</span>
          <span>© 2026 Admin Dashboard Suite v1.5</span>
        </footer>

      </div>

    </div>
  );
}
