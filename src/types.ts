export interface MembershipTier {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  savingsAndDiscounts: string;
  popular?: boolean;
  gifts: string[];
  perks: string[];
}

export interface GroupClass {
  id: string;
  name: string;
  instructor: string;
  time: string;
  duration: string;
  intensity: 'Low' | 'Medium' | 'High' | 'Extremely High';
  day: string;
  description: string;
}

export interface BookingClaim {
  fullName: string;
  email: string;
  phone: string;
  tierId: string;
  timestamp: string;
  ticketId: string;
}
