/**
 * CHOP CHOP Digital Ordering System — Central Configuration
 * Bold, modern, fast, youthful street-food digital menu identity.
 */

export const CHOP_CHOP_CONFIG = {
  brand: {
    name: 'CHOP CHOP',
    fullName: 'CHOP CHOP GRILL HOUSE & COFFEE SHOP',
    legalName: 'CHOP CHOP Zimbabwe',
    shortName: 'CHOP CHOP',
    accentWord: 'CHOP',
    tagline: 'Flame-grilled steaks, artisan burgers, hearty breakfasts, platters, barista coffee & stone-baked pizza.',
    subtext: 'GRILL HOUSE & COFFEE SHOP',
    description: 'Official digital ordering for CHOP CHOP Grill House & Coffee Shop in Harare, Zimbabwe. Aged steaks, flame-grilled chicken, craft burgers, breakfast, platters, coffee, and stone-baked pizza.',
    location: 'Harare, Zimbabwe',
    city: 'Harare',
    country: 'Zimbabwe',
    flagEmoji: '🇿🇼',
    version: '1.0.0',
    currency: '$',
    storeHours: '7:30 AM - 10:30 PM',
  },

  colors: {
    primary: '#0B0D13',      // Obsidian street charcoal
    accent: '#F5A623',       // Golden flame amber
    accentHover: '#E09418',
    highlight: '#E65100',    // Street orange
    redAccent: '#D9230F',    // Energetic flame red
    surface: '#FFFFFF',
    canvas: '#EDE8DE',
  },

  ordering: {
    modes: [
      { id: 'pickup', label: 'Pickup', default: true },
      { id: 'dinein', label: 'Dine-In', default: false },
    ],
    confirmHeading: 'READY TO SEND?',
    confirmSubtext: 'Review your order before sending it to Chop Chop.',
    successTitle: 'ORDER SENT',
    successLead: 'Your order has been successfully sent to Chop Chop.',
    successNote: 'Your order is now being received by the Chop Chop kitchen team.',
    defaultCategory: 'all',
  },

  launch: {
    welcomeText: 'WELCOME TO CHOP CHOP',
    subText: 'GRILL HOUSE & COFFEE SHOP',
    transitionText: 'FRESH. FLAME-GRILLED. READY.',
    duration: 2100,
  },

  features: {
    cart: true,
    checkout: true,
    pickupDineIn: true,
    tableOrdering: true,
    orderTracking: false,
    enableAlcohol: false, // Alcohol catalog cleanly structured and disabled by default
  },

  ui: {
    scrollThreshold: 10,
    animationDuration: 200,
  }
};

// Backwards-compatible export alias for any legacy references
export const FOODIES_CONFIG = CHOP_CHOP_CONFIG;
