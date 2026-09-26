/**
 * CHOP CHOP Grill House & Coffee Shop — Vector Food Visuals
 * Zero-network crisp SVG illustrations for Chop Chop menu items and categories.
 */

export function getItemGraphic(itemId, category = '') {
  // 1. Specific dish visual match
  if (itemId.includes('steak') || itemId.includes('tbone') || itemId.includes('rib-eye') || itemId.includes('fillet') || itemId.includes('rump') || itemId.includes('tomahawk') || itemId.includes('lamb')) {
    return getSteakGraphic();
  }
  if (itemId.includes('burger')) {
    return getBurgerGraphic();
  }
  if (itemId.includes('platter')) {
    return getPlatterGraphic();
  }
  if (itemId.includes('bream') || itemId.includes('fish')) {
    return getFishGraphic();
  }
  if (itemId.includes('chicken') || itemId.includes('wings') || itemId.includes('thigh')) {
    return getChickenGraphic();
  }
  if (itemId.includes('breakfast') || itemId.includes('egg') || itemId.includes('avo') || itemId.includes('benedict') || itemId.includes('shakshuka') || itemId.includes('omelette')) {
    return getBreakfastGraphic();
  }
  if (itemId.includes('sub') || itemId.includes('club') || itemId.includes('sandwich')) {
    return getSandwichGraphic();
  }
  if (itemId.includes('chips') || itemId.includes('potato') || itemId.includes('rice') || itemId.includes('vegetable')) {
    return getSideGraphic();
  }
  if (itemId.includes('salad') || itemId.includes('caesar')) {
    return getSaladGraphic();
  }
  if (itemId.includes('cake') || itemId.includes('dessert') || itemId.includes('treat')) {
    return getCakeGraphic();
  }
  if (itemId.includes('coffee') || itemId.includes('cappuccino') || itemId.includes('latte') || itemId.includes('milkshake')) {
    return getCoffeeGraphic();
  }
  if (itemId.includes('tea')) {
    return getTeaGraphic();
  }
  if (itemId.includes('mojito') || itemId.includes('shandy') || itemId.includes('daiquiri') || itemId.includes('colada') || itemId.includes('lemonade') || itemId.includes('mocktail') || itemId.includes('cocktail')) {
    return getMocktailGraphic();
  }

  // 2. Category fallback
  switch (category) {
    case 'breakfast': return getBreakfastGraphic();
    case 'mains': return getSteakGraphic();
    case 'burgers': return getBurgerGraphic();
    case 'platters': return getPlatterGraphic();
    case 'allday': return getSandwichGraphic();
    case 'sides': return getSideGraphic();
    case 'salads': return getSaladGraphic();
    case 'desserts': return getCakeGraphic();
    case 'drinks': return getCoffeeGraphic();
    case 'mocktails': return getMocktailGraphic();
    case 'pizza':
    default:
      return getPizzaGraphic();
  }
}

// Flame-grilled Steak / Meat Cut Graphic
function getSteakGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <defs>
        <radialGradient id="steak-plate" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="#22262E" />
          <stop offset="90%" stop-color="#14171D" />
          <stop offset="100%" stop-color="#0B0D13" />
        </radialGradient>
        <linearGradient id="steak-sear" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#5A1A12" />
          <stop offset="40%" stop-color="#3D120C" />
          <stop offset="100%" stop-color="#240A06" />
        </linearGradient>
      </defs>
      <!-- Cast iron skillet / slate plate -->
      <ellipse cx="80" cy="64" rx="66" ry="46" fill="url(#steak-plate)" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.35))" />
      <ellipse cx="80" cy="64" rx="60" ry="40" fill="#1C1F26" />
      <!-- Seared Steak Cut -->
      <path d="M44 68 C38 52 52 40 76 38 C102 36 122 48 116 68 C112 82 86 86 62 84 C48 82 46 76 44 68 Z" fill="url(#steak-sear)" />
      <!-- Golden Rosemary & Garlic Butter Melting -->
      <ellipse cx="78" cy="56" rx="10" ry="7" fill="#F5A623" opacity="0.9" />
      <ellipse cx="78" cy="56" rx="7" ry="4" fill="#FFE27A" />
      <!-- Grill Sear Lines -->
      <line x1="56" y1="50" x2="72" y2="74" stroke="#1A0604" stroke-width="3" stroke-linecap="round" />
      <line x1="72" y1="44" x2="88" y2="70" stroke="#1A0604" stroke-width="3" stroke-linecap="round" />
      <line x1="88" y1="46" x2="104" y2="68" stroke="#1A0604" stroke-width="3" stroke-linecap="round" />
      <!-- Rosemary sprig -->
      <path d="M78 48 Q86 42 98 44" stroke="#22C55E" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <circle cx="86" cy="43" r="2" fill="#16A34A" />
      <circle cx="94" cy="44" r="2" fill="#16A34A" />
    </svg>
  `;
}

// Flame-Grilled Burger Graphic
function getBurgerGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <defs>
        <radialGradient id="bun-top" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FBBF24" />
          <stop offset="70%" stop-color="#D97706" />
          <stop offset="100%" stop-color="#92400E" />
        </radialGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="80" cy="98" rx="50" ry="12" fill="#000000" opacity="0.25" />
      <!-- Bottom Bun -->
      <path d="M46 84 C46 80 50 78 80 78 C110 78 114 80 114 84 C114 90 106 94 80 94 C54 94 46 90 46 84 Z" fill="#D97706" />
      <!-- Beef Patty -->
      <rect x="42" y="70" width="76" height="12" rx="6" fill="#3D1A10" />
      <!-- Melted Cheese -->
      <path d="M44 68 L116 68 L112 75 L96 72 L88 78 L76 71 L60 76 L52 71 Z" fill="#F59E0B" />
      <!-- Lettuce -->
      <path d="M40 64 Q60 58 80 64 Q100 58 120 64 Q116 70 80 68 Q44 70 40 64 Z" fill="#22C55E" />
      <!-- Tomato Slices -->
      <rect x="52" y="58" width="56" height="7" rx="3" fill="#EF4444" />
      <!-- Top Sesame Brioche Bun -->
      <path d="M42 58 C42 34 56 22 80 22 C104 22 118 34 118 58 Z" fill="url(#bun-top)" />
      <!-- White Sesame Seeds -->
      <circle cx="68" cy="38" r="1.5" fill="#FEF3C7" />
      <circle cx="80" cy="32" r="1.5" fill="#FEF3C7" />
      <circle cx="92" cy="38" r="1.5" fill="#FEF3C7" />
      <circle cx="74" cy="46" r="1.5" fill="#FEF3C7" />
      <circle cx="86" cy="46" r="1.5" fill="#FEF3C7" />
    </svg>
  `;
}

// Sharing Platter Graphic
function getPlatterGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <!-- Wooden Board Platter -->
      <ellipse cx="80" cy="65" rx="68" ry="46" fill="#78350F" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.3))" />
      <ellipse cx="80" cy="65" rx="62" ry="40" fill="#92400E" />
      <!-- Grilled meats & skewers -->
      <!-- Skewer 1 -->
      <line x1="38" y1="52" x2="82" y2="42" stroke="#D97706" stroke-width="4" stroke-linecap="round" />
      <circle cx="50" cy="49" r="6" fill="#3D1A10" />
      <circle cx="64" cy="46" r="6" fill="#7C2D12" />
      <circle cx="76" cy="43" r="6" fill="#3D1A10" />
      <!-- Chicken Thigh Pieces -->
      <ellipse cx="64" cy="72" rx="16" ry="12" fill="#B45309" />
      <ellipse cx="94" cy="56" rx="18" ry="14" fill="#9A3412" />
      <!-- Sauce Bowl -->
      <circle cx="106" cy="76" r="12" fill="#FFFFFF" />
      <circle cx="106" cy="76" r="9" fill="#DC2626" />
      <!-- Fresh Greens -->
      <circle cx="48" cy="74" r="5" fill="#16A34A" />
      <circle cx="80" cy="80" r="5" fill="#22C55E" />
    </svg>
  `;
}

// Whole Flame-Grilled Fish Graphic
function getFishGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <!-- Slate Plate -->
      <ellipse cx="80" cy="64" rx="66" ry="44" fill="#1E293B" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.3))" />
      <!-- Grilled Bream Body -->
      <path d="M36 64 C48 46 88 44 116 56 C124 50 132 46 136 48 L130 64 L136 78 C132 80 124 76 116 70 C88 82 48 80 36 64 Z" fill="#64748B" />
      <path d="M38 64 C48 50 86 48 112 58 C100 68 60 76 38 64 Z" fill="#94A3B8" />
      <!-- Fish Eye -->
      <circle cx="48" cy="60" r="2.5" fill="#0F172A" />
      <circle cx="49" cy="59" r="1" fill="#FFFFFF" />
      <!-- Grill marks -->
      <line x1="68" y1="52" x2="74" y2="74" stroke="#334155" stroke-width="2.5" stroke-linecap="round" />
      <line x1="84" y1="53" x2="90" y2="73" stroke="#334155" stroke-width="2.5" stroke-linecap="round" />
      <line x1="100" y1="56" x2="104" y2="70" stroke="#334155" stroke-width="2.5" stroke-linecap="round" />
      <!-- Lemon Wedge -->
      <path d="M96 74 A14 14 0 0 0 114 84 Z" fill="#FBBF24" />
      <path d="M98 75 A11 11 0 0 0 112 83 Z" fill="#FEF08A" />
    </svg>
  `;
}

// Chicken Graphic (Half Chicken, Wings, Pulled Chicken)
function getChickenGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <ellipse cx="80" cy="65" rx="62" ry="42" fill="#1C1F26" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.3))" />
      <!-- Golden Glazed Chicken Pieces -->
      <path d="M46 64 C42 48 64 42 86 46 C104 50 118 64 112 80 C104 90 74 88 56 82 C48 78 46 72 46 64 Z" fill="#B45309" />
      <path d="M52 62 C50 50 68 46 84 50 C98 54 108 66 102 76 C94 82 72 80 58 76 C54 72 52 68 52 62 Z" fill="#D97706" />
      <!-- Peri-peri glaze highlights -->
      <ellipse cx="76" cy="60" rx="14" ry="8" fill="#EA580C" opacity="0.8" />
      <!-- Grill marks -->
      <line x1="64" y1="52" x2="74" y2="72" stroke="#451A03" stroke-width="2.5" stroke-linecap="round" />
      <line x1="82" y1="54" x2="92" y2="72" stroke="#451A03" stroke-width="2.5" stroke-linecap="round" />
      <!-- Fresh Parsley Garnish -->
      <circle cx="70" cy="74" r="3" fill="#22C55E" />
      <circle cx="86" cy="76" r="3" fill="#16A34A" />
    </svg>
  `;
}

// Breakfast Graphic (Eggs, Toast, Avo)
function getBreakfastGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <!-- White Plate -->
      <ellipse cx="80" cy="64" rx="64" ry="44" fill="#FFFFFF" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.18))" />
      <ellipse cx="80" cy="64" rx="54" ry="36" fill="#F8FAFC" />
      <!-- Toast Triangle -->
      <polygon points="44,74 76,42 76,74" fill="#D97706" />
      <polygon points="48,72 74,46 74,72" fill="#FBBF24" />
      <!-- Sunny Side Up Egg -->
      <path d="M78 62 C74 52 88 44 100 48 C112 52 116 66 108 74 C98 82 82 72 78 62 Z" fill="#FFFFFF" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
      <circle cx="96" cy="62" r="10" fill="#F59E0B" />
      <circle cx="94" cy="60" r="8" fill="#FBBF24" />
      <circle cx="92" cy="58" r="2" fill="#FEF08A" />
      <!-- Sliced Bacon / Macon Strips -->
      <path d="M50 78 Q70 74 90 82" stroke="#991B1B" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <path d="M54 84 Q72 80 92 88" stroke="#991B1B" stroke-width="4" stroke-linecap="round" fill="none" />
    </svg>
  `;
}

// Sandwich / Sub Graphic
function getSandwichGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <ellipse cx="80" cy="80" rx="54" ry="12" fill="#000000" opacity="0.18" />
      <!-- Sub Roll Bottom -->
      <rect x="36" y="62" width="88" height="16" rx="8" fill="#D97706" />
      <!-- Fillings: Meat, Cheese, Lettuce -->
      <rect x="34" y="56" width="92" height="8" rx="4" fill="#451A03" />
      <rect x="40" y="52" width="80" height="6" rx="3" fill="#F59E0B" />
      <path d="M38 52 Q60 48 80 52 Q100 48 122 52" stroke="#22C55E" stroke-width="4" stroke-linecap="round" />
      <!-- Sub Roll Top -->
      <path d="M36 50 C36 34 54 26 80 26 C106 26 124 34 124 50 Z" fill="#F59E0B" />
      <!-- Slits on top baguette -->
      <line x1="56" y1="36" x2="64" y2="44" stroke="#D97706" stroke-width="2" stroke-linecap="round" />
      <line x1="76" y1="34" x2="84" y2="44" stroke="#D97706" stroke-width="2" stroke-linecap="round" />
      <line x1="96" y1="36" x2="104" y2="44" stroke="#D97706" stroke-width="2" stroke-linecap="round" />
    </svg>
  `;
}

// Stone-Baked Pizza Graphic
function getPizzaGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <defs>
        <radialGradient id="crust-grad" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="#E2872A" />
          <stop offset="90%" stop-color="#C26A18" />
          <stop offset="100%" stop-color="#8F4608" />
        </radialGradient>
        <radialGradient id="cheese-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFF0A0" />
          <stop offset="70%" stop-color="#FFDD55" />
          <stop offset="95%" stop-color="#D9230F" />
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="62" rx="60" ry="46" fill="url(#crust-grad)" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.22))" />
      <ellipse cx="80" cy="61" rx="51" ry="38" fill="url(#cheese-grad)" />
      <!-- Mozzarella pools -->
      <circle cx="68" cy="54" r="10" fill="#FFFBE6" opacity="0.95" />
      <circle cx="94" cy="58" r="11" fill="#FFFBE6" opacity="0.95" />
      <circle cx="80" cy="74" r="9" fill="#FFFBE6" opacity="0.95" />
      <!-- Tomato & toppings -->
      <circle cx="62" cy="52" r="6" fill="#D9230F" />
      <circle cx="98" cy="55" r="6" fill="#D9230F" />
      <circle cx="82" cy="72" r="6" fill="#D9230F" />
      <!-- Fresh basil leaves -->
      <path d="M72 45 C75 40 82 42 80 47 C77 50 72 48 72 45 Z" fill="#15803D" />
      <path d="M88 64 C93 60 98 65 94 69 C90 70 87 67 88 64 Z" fill="#15803D" />
    </svg>
  `;
}

// Fresh Salad Graphic
function getSaladGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <ellipse cx="80" cy="70" rx="56" ry="34" fill="#FFFFFF" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.18))" />
      <ellipse cx="80" cy="68" rx="50" ry="28" fill="#F1F5F9" />
      <!-- Mixed greens & romaine -->
      <circle cx="64" cy="62" r="14" fill="#16A34A" />
      <circle cx="80" cy="56" r="16" fill="#22C55E" />
      <circle cx="96" cy="62" r="14" fill="#15803D" />
      <circle cx="80" cy="68" r="12" fill="#4ADE80" />
      <!-- Cherry tomatoes -->
      <circle cx="68" cy="60" r="5" fill="#EF4444" />
      <circle cx="92" cy="58" r="5" fill="#EF4444" />
      <!-- Cucumber slices -->
      <circle cx="80" cy="64" r="6" fill="#86EFAC" stroke="#16A34A" stroke-width="1.5" />
      <!-- Croutons -->
      <rect x="62" y="70" width="8" height="8" rx="1.5" fill="#D97706" />
      <rect x="90" y="68" width="8" height="8" rx="1.5" fill="#D97706" />
    </svg>
  `;
}

// Side Graphic (Chips / Mash)
function getSideGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <!-- Bowl / Container -->
      <ellipse cx="80" cy="70" rx="46" ry="26" fill="#FFFFFF" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.15))" />
      <!-- Crispy Golden Chips / French Fries -->
      <rect x="62" y="36" width="7" height="36" rx="2" transform="rotate(-15 62 36)" fill="#FBBF24" stroke="#D97706" stroke-width="1" />
      <rect x="74" y="32" width="7" height="40" rx="2" transform="rotate(-4 74 32)" fill="#F59E0B" stroke="#D97706" stroke-width="1" />
      <rect x="86" y="34" width="7" height="38" rx="2" transform="rotate(10 86 34)" fill="#FBBF24" stroke="#D97706" stroke-width="1" />
      <rect x="96" y="38" width="7" height="34" rx="2" transform="rotate(22 96 38)" fill="#F59E0B" stroke="#D97706" stroke-width="1" />
      <!-- Bowl Rim Highlight -->
      <ellipse cx="80" cy="66" rx="44" ry="22" fill="none" stroke="#E2E8F0" stroke-width="2" />
    </svg>
  `;
}

// Cake / Dessert Graphic
function getCakeGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <ellipse cx="80" cy="80" rx="54" ry="24" fill="#FFFFFF" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.15))" />
      <!-- Triangular Cake Slice -->
      <polygon points="50,72 108,46 120,68 62,90" fill="#78350F" />
      <!-- Sponge Layer 1 -->
      <polygon points="50,72 108,46 108,52 50,78" fill="#92400E" />
      <!-- Cream / Icing Layer -->
      <polygon points="50,78 108,52 108,56 50,82" fill="#FEF3C7" />
      <!-- Sponge Layer 2 -->
      <polygon points="50,82 108,56 108,62 50,88" fill="#92400E" />
      <!-- Top Frosting -->
      <polygon points="50,72 108,46 120,68 62,90" fill="#FBBF24" opacity="0.8" />
      <!-- Cherry / Berry Topper -->
      <circle cx="106" cy="48" r="7" fill="#DC2626" />
      <path d="M106 42 Q112 34 116 36" stroke="#15803D" stroke-width="2" fill="none" />
    </svg>
  `;
}

// Coffee Graphic
function getCoffeeGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <!-- Saucer -->
      <ellipse cx="80" cy="86" rx="46" ry="18" fill="#E2E8F0" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.15))" />
      <ellipse cx="80" cy="84" rx="38" ry="14" fill="#FFFFFF" />
      <!-- Ceramic Cup Body -->
      <path d="M52 46 L58 78 C60 84 100 84 102 78 L108 46 Z" fill="#FFFFFF" />
      <!-- Cup Handle -->
      <path d="M106 50 C118 52 118 72 104 74" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" />
      <!-- Coffee Surface / Crema / Latte Art -->
      <ellipse cx="80" cy="46" rx="28" ry="12" fill="#78350F" />
      <ellipse cx="80" cy="46" rx="24" ry="10" fill="#B45309" />
      <!-- Foamy heart latte art -->
      <path d="M76 43 C74 40 70 41 71 44 C72 47 76 50 80 52 C84 50 88 47 89 44 C90 41 86 40 84 43 Q80 47 76 43 Z" fill="#FEF3C7" />
    </svg>
  `;
}

// Tea Infusion Graphic
function getTeaGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <ellipse cx="80" cy="86" rx="44" ry="16" fill="#F1F5F9" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.12))" />
      <!-- Clear Glass Tea Cup -->
      <path d="M54 48 L60 80 C62 84 98 84 100 80 L106 48 Z" fill="#FEF08A" opacity="0.6" stroke="#CBD5E1" stroke-width="2" />
      <!-- Golden Herbal Tea Liquid -->
      <ellipse cx="80" cy="52" rx="24" ry="10" fill="#CA8A04" />
      <!-- Fresh Mint / Lemongrass Leaf Garnish -->
      <path d="M74 46 Q80 34 90 38 Q82 46 74 46 Z" fill="#16A34A" />
      <line x1="74" y1="46" x2="88" y2="38" stroke="#15803D" stroke-width="1.5" />
    </svg>
  `;
}

// Mocktail / Craft Beverage Graphic
function getMocktailGraphic() {
  return `
    <svg viewBox="0 0 160 120" class="food-illustration" aria-hidden="true">
      <!-- Highball Glass -->
      <path d="M62 30 L68 96 C68 100 92 100 92 96 L98 30 Z" fill="#F8FAFC" opacity="0.4" stroke="#CBD5E1" stroke-width="2" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.15))" />
      <!-- Vibrant Chilled Liquid -->
      <path d="M64 42 L68 94 C68 98 92 98 92 94 L96 42 Z" fill="#F59E0B" opacity="0.85" />
      <!-- Crushed Ice Cubes -->
      <rect x="70" y="52" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.75" />
      <rect x="80" y="66" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.75" />
      <rect x="72" y="76" width="9" height="9" rx="2" fill="#FFFFFF" opacity="0.75" />
      <!-- Mint Sprig & Lime Slice -->
      <circle cx="62" cy="30" r="14" fill="#84CC16" />
      <circle cx="62" cy="30" r="11" fill="#BEF264" />
      <!-- Straw -->
      <line x1="84" y1="20" x2="78" y2="90" stroke="#EF4444" stroke-width="3" stroke-linecap="round" />
    </svg>
  `;
}
