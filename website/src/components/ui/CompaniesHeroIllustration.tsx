import React from 'react';

/**
 * CompaniesHeroIllustration
 * Self-contained, responsive Apple-Google-Meta animated hero illustration.
 * Integrated surgically into the Companies page header empty space.
 */
export default function CompaniesHeroIllustration() {
  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none"
      role="img"
      aria-label="Abstract blue glass skyscrapers with floating Apple, Google, and Meta brand tiles and orbital light paths"
      style={{
        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
      }}
    >
      <svg viewBox="320 85 1360 495" preserveAspectRatio="xMidYMid meet" className="cw-hero-svg w-full h-full block select-none pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cwFloatA {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-11px); }
          }
          @keyframes cwFloatB {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }
          @keyframes cwFloatC {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes cwPulse {
            0%, 100% { opacity: 0.88; }
            50% { opacity: 0.45; }
          }
          .cw-hero-svg .bob-apple { animation: cwFloatA 5.7s ease-in-out infinite; }
          .cw-hero-svg .bob-google { animation: cwFloatB 6.4s ease-in-out infinite; }
          .cw-hero-svg .bob-meta { animation: cwFloatC 6.1s ease-in-out infinite; }
          .cw-hero-svg .orbital-point-a { animation: cwPulse 4s ease-in-out infinite; }
          .cw-hero-svg .orbital-point-b { animation: cwPulse 4s ease-in-out infinite 1.1s; }
          .cw-hero-svg .orbital-point-c { animation: cwPulse 4s ease-in-out infinite 2.2s; }
          @media (prefers-reduced-motion: reduce) {
            .cw-hero-svg .bob-apple,
            .cw-hero-svg .bob-google,
            .cw-hero-svg .bob-meta,
            .cw-hero-svg .orbital-point-a,
            .cw-hero-svg .orbital-point-b,
            .cw-hero-svg .orbital-point-c {
              animation: none;
            }
          }
` }} />
        <linearGradient id="paleGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f8ff" stopOpacity=".9"/>
          <stop offset=".58" stopColor="#b7ceff" stopOpacity=".55"/>
          <stop offset="1" stopColor="#7ba5ff" stopOpacity=".16"/>
        </linearGradient>
        <linearGradient id="blueFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9bbaff" stopOpacity=".82"/>
          <stop offset=".45" stopColor="#75a0ff" stopOpacity=".65"/>
          <stop offset="1" stopColor="#5d8ff9" stopOpacity=".17"/>
        </linearGradient>
        <linearGradient id="deepBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#797afb" stopOpacity=".94"/>
          <stop offset=".38" stopColor="#6679ff" stopOpacity=".86"/>
          <stop offset="1" stopColor="#77a5ff" stopOpacity=".15"/>
        </linearGradient>
        <linearGradient id="rightBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8daeff" stopOpacity=".56"/>
          <stop offset="1" stopColor="#83a6f2" stopOpacity=".1"/>
        </linearGradient>
        <linearGradient id="buildingHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity=".68"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="glassCard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".99"/>
          <stop offset=".55" stopColor="#fefeff" stopOpacity=".9"/>
          <stop offset="1" stopColor="#eaf1ff" stopOpacity=".82"/>
        </linearGradient>
        <linearGradient id="cardInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity=".92"/>
          <stop offset="1" stopColor="#f9fbff" stopOpacity=".48"/>
        </linearGradient>
        <linearGradient id="orbitLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0"/>
          <stop offset=".16" stopColor="white" stopOpacity=".88"/>
          <stop offset=".52" stopColor="#c2dcff" stopOpacity=".65"/>
          <stop offset=".88" stopColor="white" stopOpacity=".95"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <radialGradient id="orb" cx=".28" cy=".23" r=".76">
          <stop offset="0" stopColor="#c7f4ff"/>
          <stop offset=".35" stopColor="#64b9fa"/>
          <stop offset=".8" stopColor="#397ff6"/>
          <stop offset="1" stopColor="#6592fa"/>
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#a8c5ff" stopOpacity=".46"/>
          <stop offset="1" stopColor="#b7d1ff" stopOpacity="0"/>
        </radialGradient>
        <filter id="blur20" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="softShadow" x="-65%" y="-75%" width="230%" height="260%">
          <feDropShadow dx="0" dy="17" stdDeviation="22" floodColor="#5f7fc3" floodOpacity=".14"/>
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#9bb6e9" floodOpacity=".13"/>
        </filter>
        <filter id="sphereShadow" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="8" floodColor="#6093f7" floodOpacity=".23"/></filter>
      </defs>

      {/*  Ground and diffuse blue atmosphere  */}
      <ellipse cx="1150" cy="494" rx="900" ry="300" fill="url(#glow)"/>
      <ellipse cx="970" cy="568" rx="690" ry="48" fill="#b0c9ff" opacity=".22" filter="url(#blur20)"/>

      {/*  Low-poly glass architectural landscape  */}
      <path d="M0 535 L160 432 L486 552 L0 565Z" fill="url(#paleGlass)"/>
      <path d="M160 432 L486 552 L332 514Z" fill="#bcd3ff" opacity=".38"/>
      <path d="M485 296 L780 184 L1170 380 L1170 565 L485 565Z" fill="#c2d8ff" opacity=".12"/>
      <path d="M572 264 L854 151 L1080 254 L1080 565 L572 565Z" fill="#a2c2ff" opacity=".16"/>

      {/*  Central background tower: top, front and right faces  */}
      <polygon points="626,253 849,140 1025,226 793,338" fill="#e1ebff" opacity=".85"/>
      <polygon points="626,253 849,140 849,560 626,560" fill="url(#paleGlass)"/>
      <polygon points="849,140 1025,226 1025,560 849,560" fill="url(#blueFace)"/>
      <path d="M849 140 V561" stroke="white" strokeOpacity=".88" strokeWidth="2.3"/>
      <path d="M627 253 L849 140 L1025 226" fill="none" stroke="white" strokeOpacity=".7" strokeWidth="2"/>
      <path d="M880 206 V555 M908 224 V554 M935 240 V552" stroke="#ecf4ff" strokeOpacity=".24" strokeWidth="2"/>
      <polygon points="704,307 819,355 819,560 704,560" fill="#6f98f8" opacity=".35"/>
      <path d="M704 307 L819 355" stroke="white" strokeOpacity=".5" strokeWidth="2"/>
      <path d="M792 350 V560" stroke="#ecf3ff" strokeOpacity=".36" strokeWidth="2"/>

      {/*  Tall center-right blue glass structure  */}
      <polygon points="1116,219 1310,108 1461,182 1270,294" fill="#adbcff" opacity=".55"/>
      <polygon points="1116,219 1310,108 1310,568 1116,568" fill="#88a0ff" opacity=".30"/>
      <polygon points="1310,108 1461,182 1461,570 1310,570" fill="url(#deepBlue)"/>
      <path d="M1310 108 L1310 568 M1310 108 L1461 182" stroke="#eff3ff" strokeOpacity=".88" strokeWidth="2.2"/>
      <path d="M1359 247 V526 M1388 270 V530 M1418 262 V535" stroke="#e0e9ff" strokeOpacity=".18" strokeWidth="2"/>
      <polygon points="1445,220 1712,337 1712,564 1445,564" fill="url(#rightBlue)" opacity=".85"/>
      <polygon points="1461,224 1712,337 1797,297 1564,180" fill="#c5daff" opacity=".25"/>
      <path d="M1461 224 L1712 337 L1797 297" fill="none" stroke="white" strokeOpacity=".45" strokeWidth="2"/>
      <polygon points="1712,337 1797,297 1797,564 1712,564" fill="#8fb3ff" opacity=".18"/>
      <path d="M1797 297 L1920 352 L1920 561 L1797 561Z" fill="#a5bfff" opacity=".13"/>
      <polygon points="1700,520 1920,420 1920,570 1700,570" fill="#b2ccff" opacity=".18"/>
      <path d="M1700 520 L1920 420" stroke="white" strokeOpacity=".5" strokeWidth="2"/>

      {/*  Glass edge accents  */}
      <path d="M1108 222 L1310 108 L1461 182 L1712 337" fill="none" stroke="#fff" strokeOpacity=".48" strokeWidth="1.8"/>
      <path d="M1025 226 L1025 540 M1116 220 L1116 535" fill="none" stroke="#e7f2ff" strokeOpacity=".25" strokeWidth="2"/>

      {/*  Orbital trails, behind the logo cards  */}
      <path d="M347 415 C320 351 568 323 777 348 S1265 486 1616 301 S1800 204 1755 174" fill="none" stroke="url(#orbitLine)" strokeWidth="3" opacity=".8"/>
      <path d="M357 417 C398 517 809 547 1160 443 S1686 312 1722 296" fill="none" stroke="#fff" strokeWidth="3.2" strokeOpacity=".86"/>
      <path d="M960 287 Q1284 176 1650 236" fill="none" stroke="#dbe9ff" strokeWidth="2" opacity=".45"/>

      {/*  Orbiting blue spheres  */}
      <g className="orbital-point-a" filter="url(#sphereShadow)"><circle cx="397" cy="479" r="15" fill="url(#orb)"/><circle cx="390" cy="472" r="4" fill="white" opacity=".36"/></g>
      <g className="orbital-point-b" filter="url(#sphereShadow)"><circle cx="1615" cy="238" r="22" fill="url(#orb)"/><ellipse cx="1607" cy="228" rx="7" ry="4" fill="white" opacity=".25"/></g>
      <g className="orbital-point-c"><circle cx="1207" cy="332" r="6" fill="#bbd8ff" opacity=".72"/></g>

      {/*  Apple glass tile  */}
      <g transform="translate(486 312)"><g className="bob-apple" filter="url(#softShadow)">
        <rect width="182" height="171" rx="33" fill="url(#glassCard)" stroke="white" strokeOpacity=".9" strokeWidth="2"/>
        <rect x="24" y="20" width="134" height="129" rx="31" fill="url(#cardInner)" opacity=".74"/>
        {/*  Apple brand silhouette: native vector viewBox prevents skewing or clipping.  */}
        <svg x="44" y="22" width="94" height="125" viewBox="0 0 384 512" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill="#0a0c11"/>
        </svg>
      </g></g>

      {/*  Google main glass tile  */}
      <g transform="translate(943 300)"><g className="bob-google" filter="url(#softShadow)">
        <rect width="266" height="233" rx="38" fill="url(#glassCard)" stroke="white" strokeOpacity=".95" strokeWidth="2.5"/>
        <rect x="41" y="28" width="184" height="178" rx="38" fill="url(#cardInner)" stroke="white" strokeOpacity=".28" strokeWidth="1.5"/>
        {/*  Native 24x24 four-color Google G: centred and proportion-preserving.  */}
        <svg x="63" y="46" width="140" height="140" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path fill="#4285F4" d="M21.35 12.22c0-.73-.06-1.42-.19-2.1H12v3.96h5.23c-.23 1.28-.95 2.37-2.03 3.1v2.56h3.29c1.92-1.77 3.03-4.38 3.03-7.52z"/>
          <path fill="#34A853" d="M12 21.7c2.74 0 5.04-.91 6.72-2.47l-3.29-2.56c-.91.61-2.08.98-3.43.98-2.64 0-4.87-1.78-5.67-4.17H2.95v2.62C4.62 19.42 8.04 21.7 12 21.7z"/>
          <path fill="#FBBC05" d="M6.33 13.48c-.2-.61-.31-1.27-.31-1.95s.11-1.34.31-1.95V6.96H2.95C2.27 8.32 1.88 9.87 1.88 11.53s.39 3.21 1.07 4.57l3.38-2.62z"/>
          <path fill="#EA4335" d="M12 5.41c1.49 0 2.83.51 3.88 1.54L18.78 4C16.99 2.34 14.7 1.35 12 1.35c-3.96 0-7.38 2.27-9.05 5.61l3.38 2.62c.8-2.39 3.03-4.17 5.67-4.17z"/>
        </svg>
      </g></g>

      {/*  Meta glass tile  */}
      <g transform="translate(1449 323)"><g className="bob-meta" filter="url(#softShadow)">
        <rect width="182" height="169" rx="33" fill="url(#glassCard)" stroke="white" strokeOpacity=".92" strokeWidth="2"/>
        <rect x="20" y="19" width="142" height="133" rx="31" fill="url(#cardInner)" opacity=".7"/>
        {/*  Meta brand mark: balanced infinity curves with exact aspect ratio.  */}
        <svg x="23" y="37" width="136" height="95" viewBox="0 40 640 430" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M640 317.9C640 409.2 600.6 466.4 529.7 466.4C467.1 466.4 433.9 431.8 372.8 329.8L341.4 277.2C333.1 264.7 326.9 253 320.2 242.2C300.1 276 273.1 325.2 273.1 325.2C206.1 441.8 168.5 466.4 116.2 466.4C43.42 466.4 0 409.1 0 320.5C0 177.5 79.78 42.4 183.9 42.4C234.1 42.4 277.7 67.08 328.7 131.9C365.8 81.8 406.8 42.4 459.3 42.4C558.4 42.4 640 168.1 640 317.9H640zM287.4 192.2C244.5 130.1 216.5 111.7 183 111.7C121.1 111.7 69.22 217.8 69.22 321.7C69.22 370.2 87.7 397.4 118.8 397.4C149 397.4 167.8 378.4 222 293.6C222 293.6 246.7 254.5 287.4 192.2V192.2zM531.2 397.4C563.4 397.4 578.1 369.9 578.1 322.5C578.1 198.3 523.8 97.08 454.9 97.08C421.7 97.08 393.8 123 360 175.1C369.4 188.9 379.1 204.1 389.3 220.5L426.8 282.9C485.5 377 500.3 397.4 531.2 397.4L531.2 397.4z" fill="#0866FF"/>
        </svg>
      </g></g>

      {/*  Subtle lower fade above the parent CSS fade  */}
      <rect x="0" y="548" width="1920" height="92" fill="url(#buildingHighlight)" opacity=".35"/>
    </svg>

    </div>
  );
}
