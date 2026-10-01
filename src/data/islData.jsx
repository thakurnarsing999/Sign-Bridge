// Comprehensive Indian Sign Language (ISL) Dataset and Hand Gesture Glyphs

export const ISL_ALPHABETS = [
  { letter: 'A', name: 'Letter A', desc: 'Closed fist with thumb resting vertically alongside the index finger', tip: 'Keep fingers tightly folded into a fist facing forward' },
  { letter: 'B', name: 'Letter B', desc: 'Open flat hand with all 4 fingers extended upright, thumb folded across palm', tip: 'Hold fingers close together pointing upward' },
  { letter: 'C', name: 'Letter C', desc: 'Hand curved into a clean semi-circular C-shape facing forward', tip: 'Curve fingers and thumb as if grasping a cup' },
  { letter: 'D', name: 'Letter D', desc: 'Index finger pointing straight up, thumb and other three fingers touching in a circle', tip: 'Keep index finger vertical and stiff' },
  { letter: 'E', name: 'Letter E', desc: 'All four fingertips curved down touching the curled thumb tip', tip: 'Form a compact claw shape facing camera' },
  { letter: 'F', name: 'Letter F', desc: 'Thumb and index fingertip touching in an O-ring, remaining three fingers extended straight', tip: 'Spread the top three fingers slightly' },
  { letter: 'G', name: 'Letter G', desc: 'Index finger and thumb pointing horizontally sideways parallel to each other', tip: 'Point index finger across the chest' },
  { letter: 'H', name: 'Letter H', desc: 'Index and middle fingers extended together horizontally sideways', tip: 'Keep both extended fingers touching' },
  { letter: 'I', name: 'Letter I', desc: 'Pinky finger extended straight up, remaining fingers and thumb folded in a fist', tip: 'Hold pinky tall and vertical' },
  { letter: 'J', name: 'Letter J', desc: 'Pinky finger tracing a curved J-hook in the air', tip: 'Start in I-pose and trace downward curve' },
  { letter: 'K', name: 'Letter K', desc: 'Index finger vertical, middle finger pointing forward, thumb wedged between them', tip: 'Thumb knuckle presses between index and middle' },
  { letter: 'L', name: 'Letter L', desc: 'Index finger vertical and thumb horizontal forming a 90-degree right angle (L)', tip: 'Palm faces outward toward lens' },
  { letter: 'M', name: 'Letter M', desc: 'Three fingers folded over the thumb tucked underneath', tip: 'Thumb peeks out below pinky' },
  { letter: 'N', name: 'Letter N', desc: 'Two fingers (index and middle) folded over the thumb tucked underneath', tip: 'Thumb peeks out between middle and ring' },
  { letter: 'O', name: 'Letter O', desc: 'All fingertips curved together touching the thumb tip to form an open circle', tip: 'Ensure circular opening is visible' },
  { letter: 'P', name: 'Letter P', desc: 'Like K-shape but tilted downward toward the floor', tip: 'Index points down, middle extends forward' },
  { letter: 'Q', name: 'Letter Q', desc: 'Like G-shape but pointing downward toward the floor', tip: 'Index and thumb pinch downward' },
  { letter: 'R', name: 'Letter R', desc: 'Index and middle fingers crossed over each other upright', tip: 'Middle finger crosses behind index' },
  { letter: 'S', name: 'Letter S', desc: 'Tight closed fist with thumb wrapped securely across the front of folded fingers', tip: 'Thumb wraps horizontally over fingers' },
  { letter: 'T', name: 'Letter T', desc: 'Thumb tucked vertically between the index and middle fingers of a fist', tip: 'Thumb tip pops between index and middle knuckles' },
  { letter: 'U', name: 'Letter U', desc: 'Index and middle fingers extended straight upright touching together tightly', tip: 'Fingers held straight with no gap' },
  { letter: 'V', name: 'Letter V', desc: 'Index and middle fingers extended upright spread apart in an open V-shape', tip: 'Traditional peace sign facing outward' },
  { letter: 'W', name: 'Letter W', desc: 'Index, middle, and ring fingers extended upright spread apart forming a W', tip: 'Thumb holds down pinky fingertip' },
  { letter: 'X', name: 'Letter X', desc: 'Index finger curved into a bent hook, other fingers closed in a fist', tip: 'Hook the index finger like a pirate hook' },
  { letter: 'Y', name: 'Letter Y', desc: 'Thumb and pinky extended wide outward, three middle fingers folded down', tip: 'Classic phone / shaka pose facing forward' },
  { letter: 'Z', name: 'Letter Z', desc: 'Index finger pointing forward tracing a zigzag Z-stroke in the air', tip: 'Trace the three strokes of letter Z' },
];

export const ISL_DIGITS = [
  { digit: '1', name: 'Number 1', desc: 'Index finger pointing straight up, remaining fingers folded in a fist', tip: 'Single upright finger facing camera' },
  { digit: '2', name: 'Number 2', desc: 'Index and middle fingers extended upward in a clean V-shape', tip: 'Spread index and middle with palm forward' },
  { digit: '3', name: 'Number 3', desc: 'Index, middle, and ring fingers extended upward together', tip: 'Thumb holds pinky across palm' },
  { digit: '4', name: 'Number 4', desc: 'Four fingers extended upward, thumb folded flat across palm', tip: 'All fingers except thumb pointing straight' },
  { digit: '5', name: 'Number 5', desc: 'All five fingers fully open, spread wide facing camera', tip: 'Open palm facing camera' },
  { digit: '6', name: 'Number 6', desc: 'Thumb and pinky finger extended, three middle fingers folded', tip: 'Palm outward with thumb and pinky wide' },
  { digit: '7', name: 'Number 7', desc: 'Thumb and index fingertips pinch-touching, remaining fingers extended', tip: 'Form a ring with index and thumb' },
  { digit: '8', name: 'Number 8', desc: 'Thumb and middle fingertips touching together, remaining fingers extended', tip: 'Touch middle to thumb' },
  { digit: '9', name: 'Number 9', desc: 'Thumb and ring fingertips touching together, remaining fingers extended', tip: 'Touch ring finger to thumb' },
];

// Clean vector hand pose glyph for visual guidance and speech-to-sign playback
export const SignGlyph = ({ symbol, className = 'w-6 h-6', color = 'currentColor' }) => {
  const s = String(symbol).toUpperCase();
  const props = { className, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (s) {
    case '1':
      return (
        <svg {...props} strokeWidth="2.4">
          <line x1="12" y1="4" x2="12" y2="20" />
          <circle cx="12" cy="4" r="2" fill={color} />
          <path d="M8 20h8" />
        </svg>
      );
    case '2':
      return (
        <svg {...props} strokeWidth="2.4">
          <line x1="8" y1="5" x2="11" y2="20" />
          <line x1="16" y1="5" x2="13" y2="20" />
          <circle cx="8" cy="5" r="1.8" fill={color} />
          <circle cx="16" cy="5" r="1.8" fill={color} />
        </svg>
      );
    case '3':
      return (
        <svg {...props} strokeWidth="2">
          <line x1="7" y1="6" x2="10" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="17" y1="6" x2="14" y2="20" />
          <circle cx="7" cy="6" r="1.6" fill={color} />
          <circle cx="12" cy="4" r="1.6" fill={color} />
          <circle cx="17" cy="6" r="1.6" fill={color} />
        </svg>
      );
    case '4':
      return (
        <svg {...props} strokeWidth="2">
          <line x1="6" y1="6" x2="8" y2="20" />
          <line x1="10" y1="4" x2="11" y2="20" />
          <line x1="14" y1="4" x2="13" y2="20" />
          <line x1="18" y1="6" x2="16" y2="20" />
          <path d="M6 18h12" />
        </svg>
      );
    case '5':
      return (
        <svg {...props} strokeWidth="2">
          <line x1="4" y1="12" x2="9" y2="20" />
          <line x1="7" y1="6" x2="10.5" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="17" y1="6" x2="13.5" y2="20" />
          <line x1="20" y1="12" x2="15" y2="20" />
        </svg>
      );
    case '6':
      return (
        <svg {...props} strokeWidth="2.2">
          <line x1="4" y1="10" x2="10" y2="18" />
          <line x1="20" y1="10" x2="14" y2="18" />
          <circle cx="4" cy="10" r="2" fill={color} />
          <circle cx="20" cy="10" r="2" fill={color} />
          <rect x="9" y="10" width="6" height="8" rx="2" strokeWidth="1.8" />
        </svg>
      );
    case '7':
      return (
        <svg {...props} strokeWidth="2.2">
          <circle cx="12" cy="10" r="4.5" />
          <line x1="12" y1="14.5" x2="12" y2="21" />
          <circle cx="12" cy="10" r="1.5" fill={color} />
        </svg>
      );
    case '8':
      return (
        <svg {...props} strokeWidth="2.2">
          <circle cx="12" cy="8" r="3.8" />
          <circle cx="12" cy="16" r="4.5" />
          <circle cx="12" cy="8" r="1.5" fill={color} />
        </svg>
      );
    case '9':
      return (
        <svg {...props} strokeWidth="2.2">
          <circle cx="12" cy="9" r="4" />
          <line x1="16" y1="9" x2="16" y2="21" />
          <circle cx="12" cy="9" r="1.5" fill={color} />
        </svg>
      );
    case 'A':
      return (
        <svg {...props} strokeWidth="2.2">
          <rect x="7" y="8" width="10" height="12" rx="3" />
          <line x1="17" y1="9" x2="17" y2="18" strokeWidth="3" />
          <circle cx="17" cy="8" r="1.8" fill={color} />
        </svg>
      );
    case 'B':
      return (
        <svg {...props} strokeWidth="2">
          <rect x="7" y="4" width="10" height="13" rx="2" />
          <line x1="10" y1="4" x2="10" y2="17" />
          <line x1="14" y1="4" x2="14" y2="17" />
          <path d="M7 17c0 2 2 3 5 3s5-1 5-3" />
        </svg>
      );
    case 'C':
      return (
        <svg {...props} strokeWidth="2.5">
          <path d="M17 7a6.5 6.5 0 0 0-10 5 6.5 6.5 0 0 0 10 5" />
          <circle cx="17" cy="7" r="1.5" fill={color} />
          <circle cx="17" cy="17" r="1.5" fill={color} />
        </svg>
      );
    case 'D':
      return (
        <svg {...props} strokeWidth="2.2">
          <line x1="10" y1="4" x2="10" y2="20" strokeWidth="2.8" />
          <circle cx="10" cy="4" r="1.8" fill={color} />
          <circle cx="14" cy="14" r="4.5" />
        </svg>
      );
    case 'E':
      return (
        <svg {...props} strokeWidth="2.2">
          <rect x="7" y="8" width="10" height="10" rx="2.5" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="7" y1="15" x2="17" y2="15" />
        </svg>
      );
    case 'L':
      return (
        <svg {...props} strokeWidth="2.6">
          <line x1="9" y1="4" x2="9" y2="18" />
          <line x1="9" y1="18" x2="19" y2="18" />
          <circle cx="9" cy="4" r="2" fill={color} />
          <circle cx="19" cy="18" r="2" fill={color} />
        </svg>
      );
    case 'O':
      return (
        <svg {...props} strokeWidth="2.5">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
        </svg>
      );
    case 'V':
      return (
        <svg {...props} strokeWidth="2.4">
          <line x1="8" y1="6" x2="12" y2="18" />
          <line x1="16" y1="6" x2="12" y2="18" />
          <circle cx="8" cy="6" r="1.8" fill={color} />
          <circle cx="16" cy="6" r="1.8" fill={color} />
          <rect x="9" y="15" width="6" height="5" rx="2" />
        </svg>
      );
    case 'Y':
      return (
        <svg {...props} strokeWidth="2.4">
          <line x1="5" y1="10" x2="10" y2="16" />
          <line x1="19" y1="10" x2="14" y2="16" />
          <circle cx="5" cy="10" r="2" fill={color} />
          <circle cx="19" cy="10" r="2" fill={color} />
          <rect x="9" y="14" width="6" height="6" rx="2" />
        </svg>
      );
    default:
      // Generic hand pose representation for other characters
      return (
        <svg {...props} strokeWidth="2">
          <rect x="7" y="7" width="10" height="12" rx="3" />
          <circle cx="12" cy="12" r="2" fill={color} />
          <text x="12" y="15" fontSize="7" fontWeight="bold" textAnchor="middle" fill={color} stroke="none">
            {s}
          </text>
        </svg>
      );
  }
};
