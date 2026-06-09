import { MembershipTier, GroupClass } from './types';

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: '12month',
    name: '12-Month Membership',
    duration: '12 Months',
    price: 13700,
    originalPrice: 19700,
    savingsAndDiscounts: '30% OFF — Save ₱6,000! 💥',
    popular: true,
    gifts: [
      'FREE 1 Personal Training Session + Health Assessment',
      'Exclusive Rise Dri-Fit Welcome Shirt',
      '10 FREE Gym Guest Passes'
    ],
    perks: [
      'FREE Sauna Use',
      'FREE Wi-Fi Access',
      'FREE Parking',
      'Access to Group Classes',
      'Fully Air-Conditioned Fitness Facilities'
    ]
  },
  {
    id: '6month',
    name: '6-Month Membership',
    duration: '6 Months',
    price: 10000,
    originalPrice: 13700,
    savingsAndDiscounts: 'Save ₱3,700! 💥',
    gifts: [
      'FREE 1 Personal Training Session + Health Assessment',
      '5 FREE Gym Guest Passes'
    ],
    perks: [
      'FREE Sauna Use',
      'FREE Wi-Fi Access',
      'FREE Parking',
      'Access to Group Classes',
      'Fully Air-Conditioned Fitness Facilities'
    ]
  },
  {
    id: '3month',
    name: '3-Month Membership',
    duration: '3 Months',
    price: 5500,
    originalPrice: 7500,
    savingsAndDiscounts: 'Save ₱2,000! 💥',
    gifts: [
      'FREE 1 Personal Training Session + Health Assessment',
      '2 FREE Gym Guest Passes'
    ],
    perks: [
      'FREE Sauna Use',
      'FREE Wi-Fi Access',
      'FREE Parking',
      'Access to Group Classes',
      'Fully Air-Conditioned Fitness Facilities'
    ]
  },
  {
    id: 'monthly',
    name: '1-Month Membership',
    duration: '1 Month',
    price: 2500,
    originalPrice: 3500,
    savingsAndDiscounts: 'Save ₱1,000! 💥',
    gifts: [
      'FREE 1 Personal Training Session + Health Assessment'
    ],
    perks: [
      'FREE Sauna Use',
      'FREE Wi-Fi Access',
      'FREE Parking',
      'Access to Group Classes',
      'Fully Air-Conditioned Fitness Facilities'
    ]
  }
];

export const GROUP_CLASSES: GroupClass[] = [
  {
    id: 'sc1',
    name: 'Step Up Aerobics Dance',
    instructor: 'Coach JM Rivera',
    time: '06:00 PM - 07:00 PM',
    duration: '60 mins',
    intensity: 'High',
    day: 'Monday, Wednesday, Friday',
    description: 'High-energy rhythmic step aerobics choreographed with heart-pumping dance tracks. Build cardiovascular power and lose yourself in the energetic Cebu beats.'
  },
  {
    id: 'sc2',
    name: 'Iron Grit Strength',
    instructor: 'Coach Mark "Beast" Santos',
    time: '08:00 AM - 09:15 AM',
    duration: '75 mins',
    intensity: 'Extremely High',
    day: 'Tuesday, Thursday',
    description: 'Structure and lift. A group loaded barbell & heavy dumbbell circuit targeting full-body progressive overload. Focuses on strict posture, mental grit, and pure power.'
  },
  {
    id: 'sc3',
    name: 'MetCon Shred',
    instructor: 'Coach Sarah Perez',
    time: '05:30 PM - 06:15 PM',
    duration: '45 mins',
    intensity: 'Extremely High',
    day: 'Tuesday, Thursday, Saturday',
    description: 'Short but blistering metabolic conditioning workout. Rowers, assault bikes, kettlebells, and dynamic functional intervals to fire up fat oxidation and post-workout metabolic burn.'
  },
  {
    id: 'sc4',
    name: 'Vinyasa Flow Yoga',
    instructor: 'Coach Alyssa Lim',
    time: '07:30 PM - 08:30 PM',
    duration: '60 mins',
    intensity: 'Medium',
    day: 'Wednesday, Saturday',
    description: 'Decompress after a long day of lifting. Active mobility, deep breathing sequence, and alignment patterns to optimize recovery, posture, and neurological balance.'
  }
];

export const AMENITIES = [
  {
    title: 'Fully Air-Conditioned Comfort',
    description: 'Train at peak power without burning out. Our high-airflow AC system keeps the entire gym perfectly chilled.',
    icon: 'Wind'
  },
  {
    title: 'Finnish Dry-Sauna Access',
    description: 'Flush out metabolic toxins, speed up muscle repair, and enjoy total relaxation with 30-min daily sauna sessions.',
    icon: 'Flame'
  },
  {
    title: 'Group Dance & Aerobics',
    description: 'Gain full complimentary entry to high-tempo group fitness classes including our famous Step Up Aerobics Dance sessions.',
    icon: 'Music'
  },
  {
    title: 'Hot & Cold Refresh Showers',
    description: 'Luxurious private changing areas equipped with responsive temperature shower setups and secure passcode lockers.',
    icon: 'ShowerHead'
  },
  {
    title: 'Complimentary Pure Hydration',
    description: 'Stay focused with pure hot and cold filtered layouts at multiple stations. High-flow hydration throughout.',
    icon: 'Droplet'
  },
  {
    title: 'Secured Parking & High-Speed WiFi',
    description: 'No parking stress on Salinas Drive. Enjoy our dedicated free parking and up to 1 hour of free ultra-speed internet.',
    icon: 'Wifi'
  }
];

export const MOTIVATIONAL_QUOTES = [
  "Do it anyway. You just have to start.",
  "Your mind will give up 100 times before your body ever does. Rise up anyway.",
  "Discipline takes over when motivation takes a day off. Train with intent.",
  "Success isn't owned. It's leased, and rent is due every single day.",
  "Cebu City's ultimate fitness community doesn't just lift weights—we lift each other.",
  "Do not pray for an easy workout. Earn a robust body and a bulletproof mind."
];
