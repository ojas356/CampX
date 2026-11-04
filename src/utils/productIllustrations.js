/**
 * Custom SVG Data-URI Illustrations for CampX Campus Products
 * Styled to match the warm Corkboard + Claymorphism + Glassmorphism palette.
 */

function svgToDataUri(svgString) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const PRODUCT_ILLUSTRATIONS = {
  calculator: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f6ebd4"/>
          <stop offset="100%" stop-color="#e5d2ab"/>
        </linearGradient>
        <linearGradient id="calcBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3c332a"/>
          <stop offset="100%" stop-color="#231c15"/>
        </linearGradient>
        <filter id="clayShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="4" dy="8" stdDeviation="6" flood-color="#2c2115" flood-opacity="0.28"/>
        </filter>
      </defs>
      <rect width="400" height="300" fill="url(#bg)"/>
      <circle cx="320" cy="60" r="45" fill="#fff9ee" opacity="0.45"/>
      <circle cx="80" cy="240" r="55" fill="#b3352c" opacity="0.08"/>
      <!-- Grid sheet behind calculator -->
      <g transform="rotate(-6 200 150)" filter="url(#clayShadow)">
        <rect x="75" y="45" width="160" height="210" rx="10" fill="#fdf8ec" stroke="#c9a86a" stroke-width="2"/>
        <line x1="90" y1="80" x2="220" y2="80" stroke="#e6d9b8" stroke-width="2"/>
        <line x1="90" y1="105" x2="220" y2="105" stroke="#e6d9b8" stroke-width="2"/>
        <line x1="90" y1="130" x2="200" y2="130" stroke="#e6d9b8" stroke-width="2"/>
        <path d="M 95 190 Q 130 140 165 190 T 215 180" fill="none" stroke="#b3352c" stroke-width="3" stroke-linecap="round"/>
      </g>
      <!-- Claymorphic Calculator -->
      <g transform="rotate(4 235 150)" filter="url(#clayShadow)">
        <rect x="165" y="38" width="135" height="220" rx="18" fill="url(#calcBody)" stroke="#5a4a34" stroke-width="2"/>
        <!-- LCD Screen -->
        <rect x="180" y="56" width="105" height="44" rx="8" fill="#cfe0c3" stroke="#8fa882" stroke-width="2"/>
        <text x="190" y="76" font-family="monospace" font-size="11" fill="#2c2115" font-weight="bold">∫(x²+2x)dx</text>
        <text x="242" y="93" font-family="monospace" font-size="13" fill="#2c2115" font-weight="bold">= 850.00</text>
        <!-- Solar Panel -->
        <rect x="245" y="43" width="36" height="8" rx="2" fill="#5c4938"/>
        <!-- Keypad Buttons -->
        <g fill="#fdf8ec">
          <rect x="182" y="114" width="20" height="14" rx="4" fill="#b3352c"/>
          <rect x="209" y="114" width="20" height="14" rx="4" fill="#d99b38"/>
          <rect x="236" y="114" width="20" height="14" rx="4" fill="#7a6a58"/>
          <rect x="263" y="114" width="20" height="14" rx="4" fill="#7a6a58"/>

          <rect x="182" y="138" width="20" height="16" rx="4"/>
          <rect x="209" y="138" width="20" height="16" rx="4"/>
          <rect x="236" y="138" width="20" height="16" rx="4"/>
          <rect x="263" y="138" width="20" height="16" rx="4"/>

          <rect x="182" y="162" width="20" height="16" rx="4"/>
          <rect x="209" y="162" width="20" height="16" rx="4"/>
          <rect x="236" y="162" width="20" height="16" rx="4"/>
          <rect x="263" y="162" width="20" height="16" rx="4"/>

          <rect x="182" y="186" width="20" height="16" rx="4"/>
          <rect x="209" y="186" width="20" height="16" rx="4"/>
          <rect x="236" y="186" width="20" height="16" rx="4"/>
          <rect x="263" y="186" width="20" height="16" rx="4"/>

          <rect x="182" y="210" width="20" height="16" rx="4"/>
          <rect x="209" y="210" width="20" height="16" rx="4"/>
          <rect x="236" y="210" width="47" height="16" rx="4" fill="#2f5b8a"/>
        </g>
      </g>
    </svg>
  `),

  drafter: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f3e6c8"/>
          <stop offset="100%" stop-color="#dec799"/>
        </linearGradient>
        <filter id="shadow2" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#2c2115" flood-opacity="0.25"/>
        </filter>
      </defs>
      <rect width="400" height="300" fill="url(#bg2)"/>
      <!-- Blueprint sheet -->
      <g transform="rotate(-3 200 150)" filter="url(#shadow2)">
        <rect x="55" y="40" width="290" height="215" rx="12" fill="#fdf8ec" stroke="#2c2115" stroke-width="2"/>
        <rect x="68" y="52" width="264" height="191" fill="none" stroke="#2f5b8a" stroke-width="1.5" stroke-dasharray="4 4"/>
        <!-- Isometric drawing lines -->
        <circle cx="155" cy="145" r="42" fill="none" stroke="#2f5b8a" stroke-width="2"/>
        <circle cx="155" cy="145" r="20" fill="none" stroke="#b3352c" stroke-width="1.5" stroke-dasharray="3 3"/>
        <line x1="105" y1="145" x2="205" y2="145" stroke="#2f5b8a" stroke-width="1.5"/>
        <line x1="155" y1="95" x2="155" y2="195" stroke="#2f5b8a" stroke-width="1.5"/>
      </g>
      <!-- Mini Drafter Arms & L-Scale -->
      <g filter="url(#shadow2)">
        <!-- Clamp -->
        <rect x="65" y="32" width="38" height="28" rx="6" fill="#b3352c" stroke="#2c2115" stroke-width="2"/>
        <circle cx="84" cy="46" r="6" fill="#f0cf8a"/>
        <!-- Steel rods -->
        <line x1="95" y1="54" x2="215" y2="115" stroke="#5a4a34" stroke-width="6" stroke-linecap="round"/>
        <line x1="82" y1="58" x2="202" y2="122" stroke="#7a6855" stroke-width="5" stroke-linecap="round"/>
        <!-- Protractor Pivot -->
        <circle cx="212" cy="120" r="22" fill="#2f5b8a" stroke="#2c2115" stroke-width="2"/>
        <circle cx="212" cy="120" r="9" fill="#fdf8ec"/>
        <!-- Transparent L-Scale -->
        <path d="M 212 110 L 335 110 L 335 134 L 236 134 L 236 225 L 212 225 Z" fill="rgba(255,253,245,0.82)" stroke="#2c2115" stroke-width="2"/>
      </g>
    </svg>
  `),

  book: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f7ecd5"/>
          <stop offset="100%" stop-color="#e3cca1"/>
        </linearGradient>
        <filter id="shadow3" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="4" dy="8" stdDeviation="6" flood-color="#2c2115" flood-opacity="0.26"/>
        </filter>
      </defs>
      <rect width="400" height="300" fill="url(#bg3)"/>
      <!-- Bottom Book -->
      <g transform="rotate(5 200 160)" filter="url(#shadow3)">
        <rect x="95" y="60" width="195" height="195" rx="12" fill="#2f5b8a" stroke="#2c2115" stroke-width="2.5"/>
        <rect x="103" y="68" width="180" height="180" rx="8" fill="#fdf8ec"/>
      </g>
      <!-- Top Textbook Cover -->
      <g transform="rotate(-4 195 148)" filter="url(#shadow3)">
        <rect x="95" y="42" width="195" height="215" rx="14" fill="#b3352c" stroke="#2c2115" stroke-width="2.5"/>
        <rect x="95" y="42" width="24" height="215" rx="6" fill="#87241c" stroke="#2c2115" stroke-width="2"/>
        <!-- Label Card on Cover -->
        <rect x="134" y="68" width="136" height="86" rx="8" fill="#fdf8ec" stroke="#2c2115" stroke-width="2"/>
        <text x="202" y="95" text-anchor="middle" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#2c2115">APPLIED MATHS</text>
        <text x="202" y="114" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#b3352c">VOLUME III • SEM 3</text>
        <text x="202" y="136" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#5a4a34">G.V. Kumbhojkar</text>
        <!-- Math symbols badge -->
        <circle cx="202" cy="198" r="26" fill="#f0cf8a" stroke="#2c2115" stroke-width="2"/>
        <text x="202" y="205" text-anchor="middle" font-family="serif" font-size="20" font-weight="bold" fill="#2c2115">∑ π</text>
      </g>
    </svg>
  `),

  labcoat: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eef2e6"/>
          <stop offset="100%" stop-color="#d8dfc9"/>
        </linearGradient>
        <filter id="shadow4" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="3" dy="7" stdDeviation="6" flood-color="#2c2115" flood-opacity="0.22"/>
        </filter>
      </defs>
      <rect width="400" height="300" fill="url(#bg4)"/>
      <!-- Folded Crisp White Lab Coat -->
      <g filter="url(#shadow4)">
        <path d="M 125 55 L 165 42 L 235 42 L 275 55 L 315 115 L 285 135 L 265 98 L 265 245 L 135 245 L 135 98 L 115 135 L 85 115 Z" fill="#fffdf9" stroke="#2c2115" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Lapels -->
        <path d="M 165 42 L 200 105 L 235 42" fill="#f2ead8" stroke="#2c2115" stroke-width="2" stroke-linejoin="round"/>
        <line x1="200" y1="105" x2="200" y2="245" stroke="#2c2115" stroke-width="2"/>
        <!-- Buttons -->
        <circle cx="190" cy="135" r="4.5" fill="#2f5b8a"/>
        <circle cx="190" cy="168" r="4.5" fill="#2f5b8a"/>
        <circle cx="190" cy="201" r="4.5" fill="#2f5b8a"/>
        <!-- Chest Pocket with APSIT Badge & Pen -->
        <rect x="218" y="115" width="34" height="38" rx="4" fill="#fdf8ec" stroke="#2c2115" stroke-width="2"/>
        <line x1="228" y1="102" x2="228" y2="122" stroke="#b3352c" stroke-width="4" stroke-linecap="round"/>
      </g>
    </svg>
  `),

  arduino: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="bg5" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f5ead4"/>
          <stop offset="100%" stop-color="#dfc79e"/>
        </linearGradient>
        <filter id="shadow5" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="4" dy="7" stdDeviation="6" flood-color="#2c2115" flood-opacity="0.26"/>
        </filter>
      </defs>
      <rect width="400" height="300" fill="url(#bg5)"/>
      <!-- Microcontroller Board -->
      <g transform="rotate(-3 200 150)" filter="url(#shadow5)">
        <rect x="75" y="55" width="245" height="185" rx="16" fill="#2f5b8a" stroke="#2c2115" stroke-width="2.5"/>
        <!-- USB Port & Power Jack -->
        <rect x="62" y="82" width="28" height="36" rx="4" fill="#d6d1c4" stroke="#2c2115" stroke-width="2"/>
        <rect x="65" y="175" width="26" height="30" rx="4" fill="#2c2115"/>
        <!-- IC Chip -->
        <rect x="155" y="135" width="110" height="36" rx="4" fill="#2c2115"/>
        <!-- IC Pins -->
        <g fill="#f0cf8a">
          <rect x="165" y="127" width="6" height="8"/>
          <rect x="182" y="127" width="6" height="8"/>
          <rect x="199" y="127" width="6" height="8"/>
          <rect x="216" y="127" width="6" height="8"/>
          <rect x="233" y="127" width="6" height="8"/>
          <rect x="250" y="127" width="6" height="8"/>
          <rect x="165" y="171" width="6" height="8"/>
          <rect x="182" y="171" width="6" height="8"/>
          <rect x="199" y="171" width="6" height="8"/>
          <rect x="216" y="171" width="6" height="8"/>
          <rect x="233" y="171" width="6" height="8"/>
          <rect x="250" y="171" width="6" height="8"/>
        </g>
        <!-- Header strips -->
        <rect x="115" y="68" width="180" height="14" rx="3" fill="#2c2115"/>
        <rect x="115" y="212" width="180" height="14" rx="3" fill="#2c2115"/>
        <!-- Infinity/UNO mark -->
        <circle cx="122" cy="115" r="14" fill="none" stroke="#fdf8ec" stroke-width="3"/>
        <circle cx="144" cy="115" r="14" fill="none" stroke="#fdf8ec" stroke-width="3"/>
        <circle cx="285" cy="105" r="8" fill="#b3352c" stroke="#fdf8ec" stroke-width="2"/>
      </g>
    </svg>
  `)
};

export function getProductIllustration(product) {
  if (product?.imageUrl && product.imageUrl.startsWith('data:image/')) {
    return product.imageUrl;
  }
  const text = `${product?.productName || ''} ${product?.category || ''}`.toLowerCase();
  if (text.includes('calc') || text.includes('casio')) return PRODUCT_ILLUSTRATIONS.calculator;
  if (text.includes('draft') || text.includes('omega') || text.includes('tool') || text.includes('drawing')) return PRODUCT_ILLUSTRATIONS.drafter;
  if (text.includes('coat') || text.includes('lab') || text.includes('chem')) return PRODUCT_ILLUSTRATIONS.labcoat;
  if (text.includes('arduino') || text.includes('sensor') || text.includes('iot') || text.includes('electronic')) return PRODUCT_ILLUSTRATIONS.arduino;
  return PRODUCT_ILLUSTRATIONS.book;
}
