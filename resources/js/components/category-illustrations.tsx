const colors = {
  bg: "#0D1B2A",
  orange: "#F97316",
  teal: "#5EEAD4",
  green: "#4ADE80",
  coral: "#FB923C",
  mint: "#6EE7B7",
  skin: "#8B4513",
  skinLight: "#A0522D"
}

const Confetti = () => (
  <g>
    <circle cx="15" cy="20" r="3" fill={colors.orange} />
    <circle cx="105" cy="15" r="2" fill={colors.teal} />
    <circle cx="90" cy="95" r="2.5" fill={colors.coral} />
    <path d="M25 90 Q28 85 31 90" stroke={colors.teal} strokeWidth="2" fill="none" />
    <path d="M85 25 Q88 20 91 25" stroke={colors.mint} strokeWidth="2" fill="none" />
    <path d="M20 50 L22 55 L18 55 Z" fill={colors.orange} />
    <path d="M95 60 L97 65 L93 65 Z" fill={colors.green} />
    <rect x="10" y="70" width="4" height="4" fill={colors.teal} transform="rotate(45 12 72)" />
    <rect x="100" y="40" width="3" height="3" fill={colors.coral} transform="rotate(45 101.5 41.5)" />
  </g>
)

export const categoryIllustrations: Record<string, JSX.Element> = {
  "Venues": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <path d="M60 25 L95 55 L95 95 L25 95 L25 55 Z" fill={colors.orange} />
      <path d="M60 25 L25 55 L95 55 Z" fill={colors.coral} />
      <rect x="50" y="65" width="20" height="30" fill={colors.bg} />
      <rect x="32" y="62" width="12" height="15" fill={colors.teal} />
      <rect x="76" y="62" width="12" height="15" fill={colors.teal} />
      <circle cx="60" cy="45" r="8" fill={colors.teal} />
      <path d="M15 95 L105 95" stroke={colors.green} strokeWidth="3" />
      <polygon points="60,8 63,18 57,18" fill={colors.mint} />
    </svg>
  ),
  "Caterers": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <ellipse cx="60" cy="85" rx="40" ry="10" fill={colors.coral} />
      <ellipse cx="60" cy="80" rx="40" ry="12" fill={colors.orange} />
      <path d="M25 80 Q60 30 95 80" fill={colors.teal} />
      <ellipse cx="60" cy="55" rx="22" ry="25" fill={colors.orange} />
      <circle cx="50" cy="50" r="6" fill={colors.green} />
      <circle cx="68" cy="55" r="5" fill={colors.coral} />
      <circle cx="55" cy="65" r="4" fill={colors.mint} />
      <path d="M50 22 Q47 12 50 5" stroke={colors.teal} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M60 20 Q57 10 60 3" stroke={colors.teal} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M70 22 Q67 12 70 5" stroke={colors.teal} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  ),
  "Catering & Food Services": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <ellipse cx="60" cy="85" rx="40" ry="10" fill={colors.coral} />
      <ellipse cx="60" cy="80" rx="40" ry="12" fill={colors.orange} />
      <path d="M25 80 Q60 30 95 80" fill={colors.teal} />
      <ellipse cx="60" cy="55" rx="22" ry="25" fill={colors.orange} />
      <circle cx="50" cy="50" r="6" fill={colors.green} />
      <circle cx="68" cy="55" r="5" fill={colors.coral} />
      <circle cx="55" cy="65" r="4" fill={colors.mint} />
      <path d="M50 22 Q47 12 50 5" stroke={colors.teal} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M60 20 Q57 10 60 3" stroke={colors.teal} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M70 22 Q67 12 70 5" stroke={colors.teal} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  ),
  "Decorators": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <path d="M20 20 L25 100" stroke={colors.teal} strokeWidth="2" />
      <path d="M40 20 L45 100" stroke={colors.orange} strokeWidth="2" />
      <path d="M60 20 L65 100" stroke={colors.teal} strokeWidth="2" />
      <path d="M80 20 L85 100" stroke={colors.orange} strokeWidth="2" />
      <path d="M100 20 L105 100" stroke={colors.teal} strokeWidth="2" />
      <circle cx="40" cy="50" r="20" fill={colors.orange} />
      <circle cx="75" cy="45" r="16" fill={colors.teal} />
      <circle cx="55" cy="75" r="14" fill={colors.green} />
      <polygon points="30,30 35,20 40,30 35,28" fill={colors.mint} />
      <polygon points="85,65 90,55 95,65 90,63" fill={colors.coral} />
      <circle cx="60" cy="35" r="5" fill={colors.coral} />
    </svg>
  ),
  "Decor & Styling": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <path d="M20 20 L25 100" stroke={colors.teal} strokeWidth="2" />
      <path d="M40 20 L45 100" stroke={colors.orange} strokeWidth="2" />
      <path d="M60 20 L65 100" stroke={colors.teal} strokeWidth="2" />
      <path d="M80 20 L85 100" stroke={colors.orange} strokeWidth="2" />
      <path d="M100 20 L105 100" stroke={colors.teal} strokeWidth="2" />
      <circle cx="40" cy="50" r="20" fill={colors.orange} />
      <circle cx="75" cy="45" r="16" fill={colors.teal} />
      <circle cx="55" cy="75" r="14" fill={colors.green} />
      <polygon points="30,30 35,20 40,30 35,28" fill={colors.mint} />
      <polygon points="85,65 90,55 95,65 90,63" fill={colors.coral} />
      <circle cx="60" cy="35" r="5" fill={colors.coral} />
    </svg>
  ),
  "Photographers": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <rect x="20" y="40" width="55" height="45" rx="5" fill={colors.orange} />
      <circle cx="47" cy="62" r="16" fill={colors.bg} />
      <circle cx="47" cy="62" r="11" fill={colors.teal} />
      <circle cx="47" cy="62" r="5" fill={colors.bg} />
      <rect x="58" y="47" width="12" height="8" rx="2" fill={colors.coral} />
      <circle cx="68" cy="51" r="3" fill={colors.mint} />
      <rect x="80" y="35" width="25" height="50" rx="4" fill={colors.teal} />
      <rect x="84" y="40" width="17" height="35" rx="2" fill={colors.bg} />
      <circle cx="92" cy="82" r="4" fill={colors.orange} />
      <circle cx="92" cy="57" r="3" fill={colors.green} />
      <path d="M86 50 L90 55 L98 48" stroke={colors.mint} strokeWidth="2" fill="none" />
    </svg>
  ),
  "Videographers": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <rect x="20" y="40" width="55" height="45" rx="5" fill={colors.orange} />
      <circle cx="47" cy="62" r="16" fill={colors.bg} />
      <circle cx="47" cy="62" r="11" fill={colors.teal} />
      <circle cx="47" cy="62" r="5" fill={colors.bg} />
      <rect x="58" y="47" width="12" height="8" rx="2" fill={colors.coral} />
      <circle cx="68" cy="51" r="3" fill={colors.mint} />
      <rect x="80" y="35" width="25" height="50" rx="4" fill={colors.teal} />
      <rect x="84" y="40" width="17" height="35" rx="2" fill={colors.bg} />
      <circle cx="92" cy="82" r="4" fill={colors.orange} />
      <circle cx="92" cy="57" r="3" fill={colors.green} />
      <path d="M86 50 L90 55 L98 48" stroke={colors.mint} strokeWidth="2" fill="none" />
    </svg>
  ),
  "Photography & Videography": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <rect x="20" y="40" width="55" height="45" rx="5" fill={colors.orange} />
      <circle cx="47" cy="62" r="16" fill={colors.bg} />
      <circle cx="47" cy="62" r="11" fill={colors.teal} />
      <circle cx="47" cy="62" r="5" fill={colors.bg} />
      <rect x="58" y="47" width="12" height="8" rx="2" fill={colors.coral} />
      <circle cx="68" cy="51" r="3" fill={colors.mint} />
      <rect x="80" y="35" width="25" height="50" rx="4" fill={colors.teal} />
      <rect x="84" y="40" width="17" height="35" rx="2" fill={colors.bg} />
      <circle cx="92" cy="82" r="4" fill={colors.orange} />
      <circle cx="92" cy="57" r="3" fill={colors.green} />
      <path d="M86 50 L90 55 L98 48" stroke={colors.mint} strokeWidth="2" fill="none" />
    </svg>
  ),
  "DJs": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <ellipse cx="45" cy="70" rx="22" ry="28" fill={colors.orange} />
      <ellipse cx="45" cy="70" rx="8" ry="10" fill={colors.bg} />
      <rect x="65" y="35" width="5" height="55" fill={colors.coral} />
      <circle cx="67" cy="32" r="10" fill={colors.teal} />
      <circle cx="67" cy="38" r="7" fill={colors.mint} />
      <path d="M67 20 L70 10 M75 25 L85 18 M60 25 L50 18" stroke={colors.green} strokeWidth="2" />
      <polygon points="25,30 30,18 35,30 30,27" fill={colors.mint} />
      <polygon points="90,45 95,35 100,45 95,42" fill={colors.coral} />
      <circle cx="85" cy="75" r="4" fill={colors.teal} />
      <circle cx="20" cy="60" r="3" fill={colors.orange} />
    </svg>
  ),
  "Entertainment": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <ellipse cx="45" cy="70" rx="22" ry="28" fill={colors.orange} />
      <ellipse cx="45" cy="70" rx="8" ry="10" fill={colors.bg} />
      <rect x="65" y="35" width="5" height="55" fill={colors.coral} />
      <circle cx="67" cy="32" r="10" fill={colors.teal} />
      <circle cx="67" cy="38" r="7" fill={colors.mint} />
      <path d="M67 20 L70 10 M75 25 L85 18 M60 25 L50 18" stroke={colors.green} strokeWidth="2" />
      <polygon points="25,30 30,18 35,30 30,27" fill={colors.mint} />
      <polygon points="90,45 95,35 100,45 95,42" fill={colors.coral} />
      <circle cx="85" cy="75" r="4" fill={colors.teal} />
      <circle cx="20" cy="60" r="3" fill={colors.orange} />
    </svg>
  ),
  "PA Systems": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <rect x="15" y="45" width="30" height="50" rx="3" fill={colors.orange} />
      <rect x="75" y="45" width="30" height="50" rx="3" fill={colors.orange} />
      <circle cx="30" cy="60" r="8" fill={colors.bg} />
      <circle cx="30" cy="80" r="5" fill={colors.bg} />
      <circle cx="90" cy="60" r="8" fill={colors.bg} />
      <circle cx="90" cy="80" r="5" fill={colors.bg} />
      <path d="M45 15 L50 40 L55 15" fill={colors.teal} />
      <path d="M65 15 L70 40 L75 15" fill={colors.teal} />
      <ellipse cx="52" cy="45" rx="10" ry="6" fill={colors.mint} />
      <ellipse cx="68" cy="45" rx="10" ry="6" fill={colors.mint} />
      <path d="M48 52 L45 100" stroke={colors.green} strokeWidth="2" opacity="0.6" />
      <path d="M72 52 L75 100" stroke={colors.green} strokeWidth="2" opacity="0.6" />
      <polygon points="60,5 55,15 65,15" fill={colors.coral} />
    </svg>
  ),
  "Sound, Stage & Lighting": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <rect x="15" y="45" width="30" height="50" rx="3" fill={colors.orange} />
      <rect x="75" y="45" width="30" height="50" rx="3" fill={colors.orange} />
      <circle cx="30" cy="60" r="8" fill={colors.bg} />
      <circle cx="30" cy="80" r="5" fill={colors.bg} />
      <circle cx="90" cy="60" r="8" fill={colors.bg} />
      <circle cx="90" cy="80" r="5" fill={colors.bg} />
      <path d="M45 15 L50 40 L55 15" fill={colors.teal} />
      <path d="M65 15 L70 40 L75 15" fill={colors.teal} />
      <ellipse cx="52" cy="45" rx="10" ry="6" fill={colors.mint} />
      <ellipse cx="68" cy="45" rx="10" ry="6" fill={colors.mint} />
      <path d="M48 52 L45 100" stroke={colors.green} strokeWidth="2" opacity="0.6" />
      <path d="M72 52 L75 100" stroke={colors.green} strokeWidth="2" opacity="0.6" />
      <polygon points="60,5 55,15 65,15" fill={colors.coral} />
    </svg>
  ),
  "Florists": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <path d="M55 100 L55 55" stroke={colors.green} strokeWidth="5" />
      <path d="M55 75 Q38 68 32 50" stroke={colors.green} strokeWidth="4" fill="none" />
      <path d="M55 65 Q72 58 80 45" stroke={colors.green} strokeWidth="4" fill="none" />
      <ellipse cx="30" cy="48" rx="10" ry="6" fill={colors.mint} />
      <ellipse cx="82" cy="42" rx="10" ry="6" fill={colors.mint} />
      <circle cx="55" cy="38" r="20" fill={colors.orange} />
      <circle cx="55" cy="38" r="8" fill={colors.mint} />
      <circle cx="43" cy="28" r="8" fill={colors.coral} />
      <circle cx="67" cy="28" r="8" fill={colors.coral} />
      <circle cx="43" cy="48" r="8" fill={colors.coral} />
      <circle cx="67" cy="48" r="8" fill={colors.coral} />
      <circle cx="90" cy="70" r="12" fill={colors.teal} />
      <circle cx="90" cy="70" r="5" fill={colors.mint} />
      <path d="M90 84 L90 100" stroke={colors.green} strokeWidth="4" />
    </svg>
  ),
  "Flowers & Plants": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <path d="M55 100 L55 55" stroke={colors.green} strokeWidth="5" />
      <path d="M55 75 Q38 68 32 50" stroke={colors.green} strokeWidth="4" fill="none" />
      <path d="M55 65 Q72 58 80 45" stroke={colors.green} strokeWidth="4" fill="none" />
      <ellipse cx="30" cy="48" rx="10" ry="6" fill={colors.mint} />
      <ellipse cx="82" cy="42" rx="10" ry="6" fill={colors.mint} />
      <circle cx="55" cy="38" r="20" fill={colors.orange} />
      <circle cx="55" cy="38" r="8" fill={colors.mint} />
      <circle cx="43" cy="28" r="8" fill={colors.coral} />
      <circle cx="67" cy="28" r="8" fill={colors.coral} />
      <circle cx="43" cy="48" r="8" fill={colors.coral} />
      <circle cx="67" cy="48" r="8" fill={colors.coral} />
      <circle cx="90" cy="70" r="12" fill={colors.teal} />
      <circle cx="90" cy="70" r="5" fill={colors.mint} />
      <path d="M90 84 L90 100" stroke={colors.green} strokeWidth="4" />
    </svg>
  ),
  "Rentals": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <path d="M15 35 L60 12 L105 35 L105 45 L60 22 L15 45 Z" fill={colors.orange} />
      <path d="M20 45 L20 95 L100 95 L100 45" fill={colors.coral} opacity="0.3" />
      <rect x="28" y="52" width="25" height="38" fill={colors.teal} rx="2" />
      <rect x="60" y="70" width="18" height="25" fill={colors.bg} rx="1" />
      <circle cx="74" cy="82" r="2" fill={colors.orange} />
      <rect x="82" y="52" width="15" height="20" fill={colors.mint} />
      <line x1="82" y1="62" x2="97" y2="62" stroke={colors.bg} strokeWidth="2" />
      <line x1="89" y1="52" x2="89" y2="72" stroke={colors.bg} strokeWidth="2" />
      <rect x="32" y="58" width="8" height="12" fill={colors.bg} />
      <rect x="42" y="58" width="8" height="12" fill={colors.bg} />
    </svg>
  ),
  "Fashion & Beauty": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <path d="M60 20 L42 45 L30 100 L60 90 L90 100 L78 45 Z" fill={colors.orange} />
      <path d="M42 45 Q60 58 78 45" fill={colors.coral} />
      <ellipse cx="60" cy="25" rx="10" ry="7" fill={colors.coral} />
      <circle cx="28" cy="40" r="15" fill={colors.teal} />
      <ellipse cx="28" cy="40" rx="10" ry="12" fill={colors.mint} opacity="0.5" />
      <rect x="25" y="55" width="6" height="20" fill={colors.coral} />
      <path d="M90 35 Q102 28 108 40 Q102 52 90 45 Q96 40 90 35" fill={colors.green} />
      <circle cx="98" cy="40" r="3" fill={colors.mint} />
      <circle cx="55" cy="60" r="3" fill={colors.teal} />
      <circle cx="65" cy="72" r="2" fill={colors.teal} />
    </svg>
  ),
  "Transport & Logistics": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <rect x="12" y="45" width="65" height="35" rx="3" fill={colors.orange} />
      <path d="M77 45 L77 80 L105 80 L105 58 L93 45 Z" fill={colors.coral} />
      <rect x="80" y="50" width="18" height="14" fill={colors.teal} rx="2" />
      <circle cx="32" cy="82" r="12" fill={colors.teal} />
      <circle cx="32" cy="82" r="6" fill={colors.bg} />
      <circle cx="88" cy="82" r="12" fill={colors.teal} />
      <circle cx="88" cy="82" r="6" fill={colors.bg} />
      <rect x="18" y="52" width="22" height="15" fill={colors.bg} rx="2" />
      <rect x="45" y="52" width="22" height="15" fill={colors.bg} rx="2" />
      <path d="M25 30 L30 42 L35 30" stroke={colors.mint} strokeWidth="3" fill="none" />
      <path d="M55 25 L60 38 L65 25" stroke={colors.mint} strokeWidth="3" fill="none" />
    </svg>
  ),
  "Security & Safety": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <path d="M60 15 L95 32 L95 60 Q95 95 60 105 Q25 95 25 60 L25 32 Z" fill={colors.orange} />
      <path d="M60 25 L85 38 L85 58 Q85 85 60 93 Q35 85 35 58 L35 38 Z" fill={colors.teal} />
      <path d="M48 58 L55 68 L75 45" stroke={colors.bg} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="50" r="4" fill={colors.mint} />
      <circle cx="102" cy="70" r="3" fill={colors.green} />
    </svg>
  ),
  "Printing & Branding": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <rect x="20" y="35" width="50" height="65" fill={colors.teal} rx="3" />
      <rect x="26" y="43" width="28" height="5" fill={colors.bg} rx="1" />
      <rect x="26" y="52" width="38" height="3" fill={colors.mint} rx="1" />
      <rect x="26" y="58" width="32" height="3" fill={colors.mint} rx="1" />
      <rect x="26" y="64" width="38" height="3" fill={colors.mint} rx="1" />
      <rect x="26" y="78" width="22" height="15" fill={colors.orange} rx="2" />
      <rect x="55" y="25" width="45" height="55" fill={colors.orange} rx="4" />
      <circle cx="77" cy="52" r="15" fill={colors.teal} />
      <text x="77" y="58" textAnchor="middle" fill={colors.bg} fontSize="18" fontWeight="bold">B</text>
      <rect x="62" y="85" width="32" height="10" fill={colors.mint} rx="2" />
    </svg>
  ),
  "Gifts & Crafts": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <rect x="25" y="50" width="55" height="50" fill={colors.orange} rx="4" />
      <rect x="25" y="50" width="55" height="14" fill={colors.coral} rx="2" />
      <rect x="48" y="50" width="10" height="50" fill={colors.mint} />
      <rect x="18" y="42" width="70" height="14" fill={colors.mint} rx="3" />
      <path d="M52 42 Q40 25 52 18 Q58 25 52 42" fill={colors.orange} />
      <path d="M52 42 Q64 25 52 18" fill={colors.coral} />
      <circle cx="95" cy="38" r="10" fill={colors.teal} />
      <circle cx="95" cy="38" r="5" fill={colors.green} />
      <path d="M90 50 L95 75 L100 50" stroke={colors.teal} strokeWidth="3" fill="none" />
      <circle cx="18" cy="75" r="6" fill={colors.green} />
      <path d="M12 75 L6 82 M18 68 L18 60 M24 75 L30 82" stroke={colors.green} strokeWidth="2" />
    </svg>
  ),
  "Technology": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <rect x="18" y="28" width="60" height="45" rx="4" fill={colors.orange} />
      <rect x="24" y="34" width="48" height="32" fill={colors.bg} rx="2" />
      <rect x="40" y="73" width="28" height="6" fill={colors.coral} />
      <rect x="30" y="79" width="48" height="10" fill={colors.teal} rx="2" />
      <rect x="82" y="30" width="25" height="50" rx="4" fill={colors.teal} />
      <rect x="86" y="36" width="17" height="35" fill={colors.bg} rx="2" />
      <circle cx="94" cy="76" r="3" fill={colors.orange} />
      <circle cx="35" cy="45" r="4" fill={colors.teal} />
      <circle cx="48" cy="52" r="3" fill={colors.green} />
      <circle cx="60" cy="48" r="3" fill={colors.coral} />
      <path d="M32 55 L42 55 L48 48 L58 58 L65 50" stroke={colors.mint} strokeWidth="2" fill="none" />
    </svg>
  ),
  "Staffing": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <circle cx="35" cy="38" r="14" fill={colors.skin} />
      <path d="M18 95 Q18 65 35 58 Q52 65 52 95" fill={colors.orange} />
      <circle cx="85" cy="38" r="14" fill={colors.skinLight} />
      <path d="M68 95 Q68 65 85 58 Q102 65 102 95" fill={colors.teal} />
      <circle cx="60" cy="48" r="12" fill={colors.skin} />
      <path d="M45 100 Q45 75 60 68 Q75 75 75 100" fill={colors.green} />
      <rect x="28" y="25" width="14" height="6" rx="2" fill={colors.teal} />
      <rect x="78" y="25" width="14" height="6" rx="2" fill={colors.orange} />
      <ellipse cx="60" cy="38" rx="10" ry="4" fill={colors.mint} />
    </svg>
  ),
  "Kids Party Services": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <ellipse cx="30" cy="45" rx="14" ry="18" fill={colors.orange} />
      <path d="M30 63 L30 95" stroke={colors.teal} strokeWidth="2" />
      <ellipse cx="50" cy="35" rx="12" ry="15" fill={colors.teal} />
      <path d="M50 50 L50 95" stroke={colors.teal} strokeWidth="2" />
      <ellipse cx="70" cy="40" rx="13" ry="16" fill={colors.green} />
      <path d="M70 56 L70 95" stroke={colors.teal} strokeWidth="2" />
      <ellipse cx="90" cy="50" rx="11" ry="14" fill={colors.coral} />
      <path d="M90 64 L90 95" stroke={colors.teal} strokeWidth="2" />
      <polygon points="60,70 54,95 66,95" fill={colors.orange} />
      <rect x="48" y="70" width="24" height="8" fill={colors.mint} />
      <circle cx="60" cy="62" r="10" fill={colors.teal} />
      <circle cx="60" cy="62" r="5" fill={colors.mint} />
      <polygon points="20,20 25,8 30,20 25,17" fill={colors.mint} />
      <polygon points="95,25 100,15 105,25 100,22" fill={colors.coral} />
    </svg>
  ),
  "Utility Services": (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <Confetti />
      <circle cx="60" cy="55" r="28" fill={colors.orange} />
      <circle cx="60" cy="55" r="20" fill={colors.teal} />
      <circle cx="60" cy="55" r="5" fill={colors.bg} />
      <rect x="57" y="38" width="6" height="17" fill={colors.bg} rx="2" />
      <rect x="68" y="52" width="14" height="6" fill={colors.bg} rx="2" />
      <path d="M25 82 L32 70 L50 76 L44 88 Z" fill={colors.mint} />
      <rect x="38" y="85" width="28" height="8" fill={colors.green} rx="2" />
      <circle cx="90" cy="35" r="12" fill={colors.mint} />
      <path d="M90 23 L90 17 M100 35 L106 35 M90 47 L90 53 M80 35 L74 35" stroke={colors.green} strokeWidth="3" />
      <path d="M97 28 L102 23 M97 42 L102 47 M83 28 L78 23" stroke={colors.green} strokeWidth="3" />
    </svg>
  ),
}

// Default fallback illustration
export const defaultIllustration = (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <Confetti />
    <circle cx="60" cy="55" r="28" fill={colors.orange} />
    <circle cx="60" cy="55" r="20" fill={colors.teal} />
    <circle cx="60" cy="55" r="8" fill={colors.mint} />
  </svg>
)

export function CategoryIllustration({ name, className = "" }: { name: string; className?: string }) {
  const illustration = categoryIllustrations[name] || defaultIllustration
  return <div className={className}>{illustration}</div>
}
