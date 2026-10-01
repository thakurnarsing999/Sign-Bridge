// Clean vector hand pose glyph for visual guidance and speech-to-sign playback
export default function SignGlyph({
  symbol,
  className = "w-6 h-6",
  color = "currentColor",
}) {
  const s = String(symbol).toUpperCase();
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (s) {
    case "1":
      return (
        <svg {...props} strokeWidth="2.4">
          <line x1="12" y1="4" x2="12" y2="20" />
          <circle cx="12" cy="4" r="2" fill={color} />
          <path d="M8 20h8" />
        </svg>
      );
    case "2":
      return (
        <svg {...props} strokeWidth="2.4">
          <line x1="8" y1="5" x2="11" y2="20" />
          <line x1="16" y1="5" x2="13" y2="20" />
          <circle cx="8" cy="5" r="1.8" fill={color} />
          <circle cx="16" cy="5" r="1.8" fill={color} />
        </svg>
      );
    case "3":
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
    case "4":
      return (
        <svg {...props} strokeWidth="2">
          <line x1="6" y1="6" x2="8" y2="20" />
          <line x1="10" y1="4" x2="11" y2="20" />
          <line x1="14" y1="4" x2="13" y2="20" />
          <line x1="18" y1="6" x2="16" y2="20" />
          <path d="M6 18h12" />
        </svg>
      );
    case "5":
      return (
        <svg {...props} strokeWidth="2">
          <line x1="4" y1="12" x2="9" y2="20" />
          <line x1="7" y1="6" x2="10.5" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="17" y1="6" x2="13.5" y2="20" />
          <line x1="20" y1="12" x2="15" y2="20" />
        </svg>
      );
    case "6":
      return (
        <svg {...props} strokeWidth="2.2">
          <line x1="4" y1="10" x2="10" y2="18" />
          <line x1="20" y1="10" x2="14" y2="18" />
          <circle cx="4" cy="10" r="2" fill={color} />
          <circle cx="20" cy="10" r="2" fill={color} />
          <rect x="9" y="10" width="6" height="8" rx="2" strokeWidth="1.8" />
        </svg>
      );
    case "7":
      return (
        <svg {...props} strokeWidth="2.2">
          <circle cx="12" cy="10" r="4.5" />
          <line x1="12" y1="14.5" x2="12" y2="21" />
          <circle cx="12" cy="10" r="1.5" fill={color} />
        </svg>
      );
    case "8":
      return (
        <svg {...props} strokeWidth="2.2">
          <circle cx="12" cy="8" r="3.8" />
          <circle cx="12" cy="16" r="4.5" />
          <circle cx="12" cy="8" r="1.5" fill={color} />
        </svg>
      );
    case "9":
      return (
        <svg {...props} strokeWidth="2.2">
          <circle cx="12" cy="9" r="4" />
          <line x1="16" y1="9" x2="16" y2="21" />
          <circle cx="12" cy="9" r="1.5" fill={color} />
        </svg>
      );
    case "A":
      return (
        <svg {...props} strokeWidth="2.2">
          <rect x="7" y="8" width="10" height="12" rx="3" />
          <line x1="17" y1="9" x2="17" y2="18" strokeWidth="3" />
          <circle cx="17" cy="8" r="1.8" fill={color} />
        </svg>
      );
    case "B":
      return (
        <svg {...props} strokeWidth="2">
          <rect x="7" y="4" width="10" height="13" rx="2" />
          <line x1="10" y1="4" x2="10" y2="17" />
          <line x1="14" y1="4" x2="14" y2="17" />
          <path d="M7 17c0 2 2 3 5 3s5-1 5-3" />
        </svg>
      );
    case "C":
      return (
        <svg {...props} strokeWidth="2.5">
          <path d="M17 7a6.5 6.5 0 0 0-10 5 6.5 6.5 0 0 0 10 5" />
          <circle cx="17" cy="7" r="1.5" fill={color} />
          <circle cx="17" cy="17" r="1.5" fill={color} />
        </svg>
      );
    case "D":
      return (
        <svg {...props} strokeWidth="2.2">
          <line x1="10" y1="4" x2="10" y2="20" strokeWidth="2.8" />
          <circle cx="10" cy="4" r="1.8" fill={color} />
          <circle cx="14" cy="14" r="4.5" />
        </svg>
      );
    case "E":
      return (
        <svg {...props} strokeWidth="2.2">
          <rect x="7" y="8" width="10" height="10" rx="2.5" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="7" y1="15" x2="17" y2="15" />
        </svg>
      );
    case "L":
      return (
        <svg {...props} strokeWidth="2.6">
          <line x1="9" y1="4" x2="9" y2="18" />
          <line x1="9" y1="18" x2="19" y2="18" />
          <circle cx="9" cy="4" r="2" fill={color} />
          <circle cx="19" cy="18" r="2" fill={color} />
        </svg>
      );
    case "O":
      return (
        <svg {...props} strokeWidth="2.5">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
        </svg>
      );
    case "V":
      return (
        <svg {...props} strokeWidth="2.4">
          <line x1="8" y1="6" x2="12" y2="18" />
          <line x1="16" y1="6" x2="12" y2="18" />
          <circle cx="8" cy="6" r="1.8" fill={color} />
          <circle cx="16" cy="6" r="1.8" fill={color} />
          <rect x="9" y="15" width="6" height="5" rx="2" />
        </svg>
      );
    case "Y":
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
          <text
            x="12"
            y="15"
            fontSize="7"
            fontWeight="bold"
            textAnchor="middle"
            fill={color}
            stroke="none"
          >
            {s}
          </text>
        </svg>
      );
  }
}
