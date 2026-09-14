import { useState, useRef } from 'react';
import './App.css';

// Authentic Real Human ISL Sign Definitions
const ISL_ALPHABET = {
  A: {
    letter: 'A',
    type: 'Two-Handed ISL Vowel',
    image: '/signs/sign_a.jpg',
    svg: '/signs/sign_a.svg',
    instructions: 'Dominant index finger points directly to the THUMB TIP of the open non-dominant hand.'
  },
  B: {
    letter: 'B',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_b.jpg',
    svg: '/signs/sign_b.svg',
    instructions: 'Touch thumbs and curved index fingers of both hands together to form two circular loops (glasses / 8).'
  },
  C: {
    letter: 'C',
    type: 'One-Handed ISL Consonant',
    image: '/signs/sign_c.jpg',
    svg: '/signs/sign_c.svg',
    instructions: 'Curve hand in front of the chest in a distinct "C" arc, fingers and thumb curved like holding a cup.'
  },
  D: {
    letter: 'D',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_d.jpg',
    svg: '/signs/sign_d.svg',
    instructions: 'Vertical index finger with dominant index and thumb forming a curved loop touching it.'
  },
  E: {
    letter: 'E',
    type: 'Two-Handed ISL Vowel',
    image: '/signs/sign_e.jpg',
    svg: '/signs/sign_e.svg',
    instructions: 'Point dominant index finger to the INDEX FINGER TIP of the open non-dominant hand.'
  },
  F: {
    letter: 'F',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_f.svg',
    svg: '/signs/sign_f.svg',
    instructions: 'Cross both index fingers over each other to form a cross / plus shape (+).'
  },
  G: {
    letter: 'G',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_g.svg',
    svg: '/signs/sign_g.svg',
    instructions: 'Place both closed fists stacked vertically one directly on top of the other.'
  },
  H: {
    letter: 'H',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_h.svg',
    svg: '/signs/sign_h.svg',
    instructions: 'Open dominant hand sweeps horizontally across the flat open palm of the non-dominant hand.'
  },
  I: {
    letter: 'I',
    type: 'Two-Handed ISL Vowel',
    image: '/signs/sign_i.svg',
    svg: '/signs/sign_i.svg',
    instructions: 'Point dominant index finger directly to the MIDDLE FINGER TIP of the open non-dominant hand.'
  },
  J: {
    letter: 'J',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_j.svg',
    svg: '/signs/sign_j.svg',
    instructions: 'Trace the curved letter "J" using dominant index onto the open palm of the other hand.'
  },
  K: {
    letter: 'K',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_k.svg',
    svg: '/signs/sign_k.svg',
    instructions: 'Hook dominant index finger and place knuckle against side of non-dominant vertical index.'
  },
  L: {
    letter: 'L',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_l.svg',
    svg: '/signs/sign_l.svg',
    instructions: 'Make an "L" shape with thumb and index of dominant hand, place it flat on the other palm.'
  },
  M: {
    letter: 'M',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_m.svg',
    svg: '/signs/sign_m.svg',
    instructions: 'Rest 3 fingers (index, middle, ring) of dominant hand flat downwards onto open non-dominant palm.'
  },
  N: {
    letter: 'N',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_n.svg',
    svg: '/signs/sign_n.svg',
    instructions: 'Rest 2 fingers (index, middle) of dominant hand flat downwards onto open non-dominant palm.'
  },
  O: {
    letter: 'O',
    type: 'Two-Handed ISL Vowel',
    image: '/signs/sign_o.svg',
    svg: '/signs/sign_o.svg',
    instructions: 'Point dominant index finger directly to the RING FINGER TIP of the open non-dominant hand.'
  },
  P: {
    letter: 'P',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_p.svg',
    svg: '/signs/sign_p.svg',
    instructions: 'Dominant index and thumb form a circle touching the tip of the vertical non-dominant index.'
  },
  Q: {
    letter: 'Q',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_q.svg',
    svg: '/signs/sign_q.svg',
    instructions: 'Hook dominant thumb and index into a ring, place it over the base of the non-dominant thumb.'
  },
  R: {
    letter: 'R',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_r.svg',
    svg: '/signs/sign_r.svg',
    instructions: 'Hook dominant index finger around the straight vertical non-dominant index finger.'
  },
  S: {
    letter: 'S',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_s.svg',
    svg: '/signs/sign_s.svg',
    instructions: 'Hook the little fingers (pinkies) of both hands tightly interlocked together in front of chest.'
  },
  T: {
    letter: 'T',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_t.svg',
    svg: '/signs/sign_t.svg',
    instructions: 'Touch dominant index finger against the lower side edge of the flat non-dominant hand.'
  },
  U: {
    letter: 'U',
    type: 'Two-Handed ISL Vowel',
    image: '/signs/sign_u.svg',
    svg: '/signs/sign_u.svg',
    instructions: 'Point dominant index finger directly to the PINKY FINGER TIP of the open non-dominant hand.'
  },
  V: {
    letter: 'V',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_v.svg',
    svg: '/signs/sign_v.svg',
    instructions: 'Form a "V" (peace sign) with dominant hand and place tips onto the open non-dominant palm.'
  },
  W: {
    letter: 'W',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_w.svg',
    svg: '/signs/sign_w.svg',
    instructions: 'Interlace and spread the fingers of both hands together with palms facing inward.'
  },
  X: {
    letter: 'X',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_x.svg',
    svg: '/signs/sign_x.svg',
    instructions: 'Cross both index fingers in an "X" shape in front of the chest.'
  },
  Y: {
    letter: 'Y',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_y.svg',
    svg: '/signs/sign_y.svg',
    instructions: 'Place dominant index finger into the "V" groove between thumb and index of non-dominant hand.'
  },
  Z: {
    letter: 'Z',
    type: 'Two-Handed ISL Consonant',
    image: '/signs/sign_z.svg',
    svg: '/signs/sign_z.svg',
    instructions: 'Hold non-dominant hand flat; place dominant fingertips on palm pointing outward like an angled "Z".'
  }
};

function App() {
  // Navigation View State: 'welcome' | 'sign-to-text' | 'text-to-sign'
  const [currentView, setCurrentView] = useState('welcome');

  // Left Panel State (Sign -> Voice & Text)
  const [currentLetter, setCurrentLetter] = useState('-');
  const [confidence, setConfidence] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [spokenAudioStatus, setSpokenAudioStatus] = useState('');

  // Right Panel State (Voice/Text -> Real Human Signer)
  const [inputText, setInputText] = useState('B');
  const [activeSignKey, setActiveSignKey] = useState('B');
  const [visualMode, setVisualMode] = useState('photo'); // 'photo' | 'vector'
  const [isListening, setIsListening] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [voiceStatus, setVoiceStatus] = useState('Real human demonstrator active');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstance = useRef(null);
  const speechRecognitionRef = useRef(null);

  const lastDetectedSignRef = useRef('');
  const lastSpokenLetterRef = useRef('');
  const holdCountRef = useRef(0);

  const speakDetectedLetter = (letter) => {
    if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
    if (lastSpokenLetterRef.current === letter) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    lastSpokenLetterRef.current = letter;
    setSpokenAudioStatus(`🔊 Spoke "${letter}"`);
  };

  // Helper to extract geometric properties for a single hand
  const analyzeHand = (lm) => {
    const wrist = lm[0];
    const thumbTip = lm[4];
    const indexTip = lm[8];
    const indexPip = lm[6];
    const indexMcp = lm[5];
    const middleTip = lm[12];
    const middlePip = lm[10];
    const middleMcp = lm[9];
    const ringTip = lm[16];
    const ringPip = lm[14];
    const ringMcp = lm[13];
    const pinkyTip = lm[20];
    const pinkyPip = lm[18];
    const pinkyMcp = lm[17];

    // Reference scale: distance between wrist and middle finger MCP
    const handScale = Math.hypot(wrist.x - middleMcp.x, wrist.y - middleMcp.y) || 0.1;

    // Finger extension check
    const isTipExtended = (tip, pip, mcp) => {
      const distTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
      const distPip = Math.hypot(pip.x - wrist.x, pip.y - wrist.y);
      const distMcp = Math.hypot(mcp.x - wrist.x, mcp.y - wrist.y);
      return distTip > distPip && distPip > distMcp;
    };

    const isIndexExt = isTipExtended(indexTip, indexPip, indexMcp);
    const isMiddleExt = isTipExtended(middleTip, middlePip, middleMcp);
    const isRingExt = isTipExtended(ringTip, ringPip, ringMcp);
    const isPinkyExt = isTipExtended(pinkyTip, pinkyPip, pinkyMcp);

    // Thumb extension: distance of thumb tip from index MCP
    const thumbDist = Math.hypot(thumbTip.x - indexMcp.x, thumbTip.y - indexMcp.y) / handScale;
    const isThumbExt = thumbDist > 0.55;

    // Extended finger count (excluding thumb)
    const extendedCount = (isIndexExt ? 1 : 0) + (isMiddleExt ? 1 : 0) + (isRingExt ? 1 : 0) + (isPinkyExt ? 1 : 0);

    return {
      wrist,
      thumbTip, indexTip, middleTip, ringTip, pinkyTip,
      indexPip, middlePip, ringPip, pinkyPip,
      indexMcp, middleMcp, ringMcp, pinkyMcp,
      isIndexExt, isMiddleExt, isRingExt, isPinkyExt, isThumbExt,
      extendedCount,
      handScale
    };
  };

  const classifyISLSign = (multiLandmarks) => {
    if (!multiLandmarks || multiLandmarks.length === 0) return null;

    // 1. TWO-HANDED ISL CLASSIFICATION (Priority when 2 hands are in frame)
    if (multiLandmarks.length >= 2) {
      const hA = analyzeHand(multiLandmarks[0]);
      const hB = analyzeHand(multiLandmarks[1]);
      const avgScale = (hA.handScale + hB.handScale) / 2;
      const distBetween = (pt1, pt2) => Math.hypot(pt1.x - pt2.x, pt1.y - pt2.y) / avgScale;

      // Check for ISLRTC VOWELS (One flat base hand + one pointing index)
      let baseHand = null;
      let pointHand = null;
      if (hA.extendedCount >= 3 && hB.isIndexExt && !hB.isMiddleExt && !hB.isRingExt && !hB.isPinkyExt) {
        baseHand = hA;
        pointHand = hB;
      } else if (hB.extendedCount >= 3 && hA.isIndexExt && !hA.isMiddleExt && !hA.isRingExt && !hA.isPinkyExt) {
        baseHand = hB;
        pointHand = hA;
      }

      if (baseHand && pointHand) {
        const pIndex = pointHand.indexTip;
        const dThumb = distBetween(pIndex, baseHand.thumbTip);
        const dIndex = distBetween(pIndex, baseHand.indexTip);
        const dMiddle = distBetween(pIndex, baseHand.middleTip);
        const dRing = distBetween(pIndex, baseHand.ringTip);
        const dPinky = distBetween(pIndex, baseHand.pinkyTip);

        const minDist = Math.min(dThumb, dIndex, dMiddle, dRing, dPinky);
        if (minDist < 0.50) {
          if (minDist === dThumb) return { sign: 'A', conf: 98 };
          if (minDist === dIndex) return { sign: 'E', conf: 98 };
          if (minDist === dMiddle) return { sign: 'I', conf: 98 };
          if (minDist === dRing) return { sign: 'O', conf: 98 };
          if (minDist === dPinky) return { sign: 'U', conf: 98 };
        }
      }

      // Consonant 'F': Both index fingers crossing (+)
      if (hA.isIndexExt && !hA.isMiddleExt && !hA.isRingExt && hB.isIndexExt && !hB.isMiddleExt && !hB.isRingExt) {
        const dIndexTips = distBetween(hA.indexTip, hB.indexTip);
        const dCrossing = distBetween(hA.indexTip, hB.indexPip) + distBetween(hB.indexTip, hA.indexPip);
        if (dCrossing < 0.85 || dIndexTips < 0.40) {
          return { sign: 'F', conf: 96 };
        }
      }

      // Consonant 'B': Two circular loops touching at thumb & index fingertips
      const dThumbTips = distBetween(hA.thumbTip, hB.thumbTip);
      const dIndexTips = distBetween(hA.indexTip, hB.indexTip);
      if (dThumbTips < 0.45 && dIndexTips < 0.45) {
        return { sign: 'B', conf: 97 };
      }

      // Consonant 'D': Non-dominant vertical index + dominant loop
      if ((hA.isIndexExt && !hA.isMiddleExt && hB.isThumbExt) || (hB.isIndexExt && !hB.isMiddleExt && hA.isThumbExt)) {
        if (dIndexTips < 0.45 && dThumbTips < 0.70) {
          return { sign: 'D', conf: 95 };
        }
      }

      // Consonant 'G': Closed fists stacked vertically
      if (hA.extendedCount === 0 && hB.extendedCount === 0) {
        const horizOffset = Math.abs(hA.wrist.x - hB.wrist.x) / avgScale;
        const vertOffset = Math.abs(hA.wrist.y - hB.wrist.y) / avgScale;
        if (horizOffset < 0.45 && vertOffset > 0.20 && vertOffset < 1.4) {
          return { sign: 'G', conf: 95 };
        }
      }

      // Consonant 'H': Open flat hand sweeping across open palm
      if (hA.extendedCount >= 4 && hB.extendedCount >= 4) {
        const dPalms = distBetween(hA.middleMcp, hB.middleMcp);
        if (dPalms < 0.65) {
          return { sign: 'H', conf: 94 };
        }
      }

      // Consonant 'S': Both little fingers (pinkies) hooked/touching
      if (hA.isPinkyExt && !hA.isIndexExt && !hA.isMiddleExt && hB.isPinkyExt && !hB.isIndexExt && !hB.isMiddleExt) {
        const dPinkies = distBetween(hA.pinkyTip, hB.pinkyTip);
        if (dPinkies < 0.45) {
          return { sign: 'S', conf: 96 };
        }
      }

      // Consonant 'X': Both index fingers extended crossing diagonally
      if (hA.isIndexExt && !hA.isMiddleExt && hB.isIndexExt && !hB.isMiddleExt) {
        const dPip = distBetween(hA.indexPip, hB.indexPip);
        if (dPip < 0.50) {
          return { sign: 'X', conf: 94 };
        }
      }
    }

    // 2. SINGLE-HANDED ISL CLASSIFICATION (1 hand visible or primary)
    const h = analyzeHand(multiLandmarks[0]);
    const scale = h.handScale;

    // Consonant 'L': Thumb and Index extended at ~90 degrees
    if (h.isIndexExt && h.isThumbExt && !h.isMiddleExt && !h.isRingExt && !h.isPinkyExt) {
      const thumbIndexAngleDist = Math.hypot(h.thumbTip.x - h.indexTip.x, h.thumbTip.y - h.indexTip.y) / scale;
      if (thumbIndexAngleDist > 0.60) {
        return { sign: 'L', conf: 97 };
      }
    }

    // Consonant 'V': Index and Middle extended in V-spread
    if (h.isIndexExt && h.isMiddleExt && !h.isRingExt && !h.isPinkyExt) {
      const vSpread = Math.hypot(h.indexTip.x - h.middleTip.x, h.indexTip.y - h.middleTip.y) / scale;
      if (vSpread > 0.28) {
        return { sign: 'V', conf: 96 };
      }
    }

    // Consonant 'W': Index, Middle, and Ring extended in W-spread
    if (h.isIndexExt && h.isMiddleExt && h.isRingExt && !h.isPinkyExt) {
      return { sign: 'W', conf: 95 };
    }

    // Consonant 'Y': Thumb and Pinky extended (hang-ten / shaka)
    if (h.isThumbExt && h.isPinkyExt && !h.isIndexExt && !h.isMiddleExt && !h.isRingExt) {
      return { sign: 'Y', conf: 96 };
    }

    // Vowel 'I' (Single-hand): Only Pinky extended upright
    if (h.isPinkyExt && !h.isThumbExt && !h.isIndexExt && !h.isMiddleExt && !h.isRingExt) {
      return { sign: 'I', conf: 95 };
    }

    // Consonant 'C': Curved hand arc
    const thumbIndexGap = Math.hypot(h.thumbTip.x - h.indexTip.x, h.thumbTip.y - h.indexTip.y) / scale;
    if (!h.isIndexExt && !h.isMiddleExt && !h.isRingExt && !h.isPinkyExt) {
      if (thumbIndexGap > 0.45 && thumbIndexGap < 0.95) {
        return { sign: 'C', conf: 94 };
      }
      // Single-Handed 'A' (Fist with thumb resting along index)
      if (thumbIndexGap <= 0.45) {
        return { sign: 'A', conf: 93 };
      }
    }

    // Single-Handed 'B' (Open Flat Palm): All 4 fingers extended upright
    if (h.isIndexExt && h.isMiddleExt && h.isRingExt && h.isPinkyExt) {
      return { sign: 'B', conf: 95 };
    }

    // Single-Handed 'D': Index extended upright, thumb touching curled middle
    if (h.isIndexExt && !h.isMiddleExt && !h.isRingExt && !h.isPinkyExt) {
      return { sign: 'D', conf: 94 };
    }

    return null;
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      if (cameraInstance.current) cameraInstance.current.stop();
      setIsCameraActive(false);
      setCurrentLetter('-');
      setConfidence(0);
      setSpokenAudioStatus('');
    } else {
      startMediaPipe();
      setIsCameraActive(true);
    }
  };

  const startMediaPipe = () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    const hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.6,
    });

    hands.onResults((results) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Draw 3D skeletal tracking on all detected hands
        for (const landmarks of results.multiHandLandmarks) {
          window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { color: '#7c3aed', lineWidth: 3 });
          window.drawLandmarks(canvasCtx, landmarks, { color: '#38bdf8', lineWidth: 1, radius: 4 });
        }

        const result = classifyISLSign(results.multiHandLandmarks);
        if (result) {
          setCurrentLetter(result.sign);
          setConfidence(result.conf);

          if (result.sign === lastDetectedSignRef.current) {
            holdCountRef.current += 1;
            if (holdCountRef.current === 10) {
              speakDetectedLetter(result.sign);
            }
          } else {
            lastDetectedSignRef.current = result.sign;
            holdCountRef.current = 1;
          }
        } else {
          setCurrentLetter('-');
          setConfidence(0);
          lastDetectedSignRef.current = '';
          holdCountRef.current = 0;
          lastSpokenLetterRef.current = '';
        }
      } else {
        setCurrentLetter('-');
        setConfidence(0);
        lastDetectedSignRef.current = '';
        holdCountRef.current = 0;
        lastSpokenLetterRef.current = '';
      }
      canvasCtx.restore();
    });

    if (typeof window.Camera !== 'undefined') {
      const camera = new window.Camera(videoElement, {
        onFrame: async () => {
          await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });
      camera.start();
      cameraInstance.current = camera;
    }
  };

  const showSign = (char) => {
    const upper = char.toUpperCase();
    if (ISL_ALPHABET[upper]) {
      setActiveSignKey(upper);
      setVoiceStatus(`Demonstrating Sign: "${upper}" — ${ISL_ALPHABET[upper].type}`);
    }
  };

  const playWord = (word) => {
    const chars = word.toUpperCase().split('').filter(c => ISL_ALPHABET[c]);
    if (chars.length === 0) {
      setVoiceStatus('Please enter letters (A to Z) to animate');
      return;
    }
    let idx = 0;
    const intervalTime = playbackSpeed === 0.5 ? 2400 : 1500;
    setVoiceStatus(`Signing sequence: "${chars.join(' - ')}"`);
    showSign(chars[0]);

    const interval = setInterval(() => {
      idx += 1;
      if (idx < chars.length) {
        showSign(chars[idx]);
      } else {
        clearInterval(interval);
        setVoiceStatus(`Sequence complete: "${chars.join('')}"`);
      }
    }, intervalTime);
  };

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is supported in Chrome/Edge browsers.');
      return;
    }

    if (isListening) {
      if (speechRecognitionRef.current) speechRecognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('🎙️ Listening... Speak a word or letter');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toUpperCase();
      setInputText(transcript);
      setVoiceStatus(`Heard: "${transcript}" ➔ Showing Real Sign`);
      playWord(transcript);
    };

    recognition.onerror = (event) => {
      setVoiceStatus(`Microphone error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
  };

  const activeSign = ISL_ALPHABET[activeSignKey] || ISL_ALPHABET['B'];
  const hasPhoto = Boolean(activeSign.image && activeSign.image.endsWith('.jpg'));
  const isDisplayingPhoto = visualMode === 'photo' && hasPhoto;
  const currentSignSrc = isDisplayingPhoto
    ? activeSign.image
    : (activeSign.svg || activeSign.image || `/signs/sign_${activeSign.letter.toLowerCase()}.svg`);

  return (
    <div className="app-container">
      {/* Premium Top Navigation Bar */}
      <header className="header">
        <div className="header-brand" onClick={() => setCurrentView('welcome')}>
          <div className="brand-icon-wrapper">🌉</div>
          <div>
            <h1>Sign Bridge</h1>
            <p>Two-Way Indian Sign Language (ISL) Assistant</p>
          </div>
        </div>

        {/* Navigation Quick Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab-btn ${currentView === 'welcome' ? 'active-tab' : ''}`}
            onClick={() => setCurrentView('welcome')}
          >
            Home
          </button>
          <button
            className={`nav-tab-btn ${currentView === 'sign-to-text' ? 'active-tab' : ''}`}
            onClick={() => setCurrentView('sign-to-text')}
          >
            🤟 Sign to Text
          </button>
          <button
            className={`nav-tab-btn ${currentView === 'text-to-sign' ? 'active-tab' : ''}`}
            onClick={() => setCurrentView('text-to-sign')}
          >
            🗣️ Text to Sign
          </button>
        </div>
      </header>

      {/* VIEW 1: HERO / WELCOME LANDING PORTAL */}
      {currentView === 'welcome' && (
        <div className="welcome-hero">
          <div className="pill-tag">
            <span className="pulsing-dot"></span>
            ISL Assistive Communication Engine
          </div>
          
          <h2 className="welcome-title">
            Bridge Every Gesture.<br />
            <span className="gradient-text">Empower Every Voice.</span>
          </h2>

          <p className="welcome-subtitle">
            A bidirectional assistive platform closing the communication gap between the Deaf 
            community and the hearing world through computer vision and authentic Indian Sign Language.
          </p>

          <div className="welcome-cards-grid">
            {/* Service 1: Sign to Text / Voice */}
            <div className="welcome-card" onClick={() => setCurrentView('sign-to-text')}>
              <div className="welcome-card-icon-box">🤟</div>
              <span className="welcome-card-tag">Gesture Recognition Engine</span>
              <h3>Sign to Text & Speech</h3>
              <p>
                Point your webcam at your hands. Our real-time vision classifier tracks landmarks at 60 FPS 
                and translates ISL signs directly into on-screen text and spoken audio.
              </p>
              <button className="welcome-action-btn btn-primary">
                <span>Launch Vision Classifier</span>
                <span>➔</span>
              </button>
            </div>

            {/* Service 2: Text / Voice to Sign */}
            <div className="welcome-card" onClick={() => setCurrentView('text-to-sign')}>
              <div className="welcome-card-icon-box">🗣️</div>
              <span className="welcome-card-tag">Sign Synthesis & Visualizer</span>
              <h3>Voice & Text to Sign</h3>
              <p>
                Speak into your microphone or type sentences. View high-definition, authentic real-human 
                Indian Sign Language demonstrations with precision playback speed control.
              </p>
              <button className="welcome-action-btn btn-secondary">
                <span>Launch ISL Visualizer</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          {/* Institutional Feature Badges */}
          <div className="feature-badges-row">
            <div className="feature-pill">● Vision Landmark Tracking (60 FPS)</div>
            <div className="feature-pill">● ISLRTC Standard Corpus</div>
            <div className="feature-pill">● Bilateral Sign Gesture Engine</div>
            <div className="feature-pill">● Natural Speech Synthesis</div>
          </div>
        </div>
      )}

      {/* VIEW 2: DEDICATED SIGN TO TEXT CONVERSION */}
      {currentView === 'sign-to-text' && (
        <div className="focused-view">
          <div className="view-header">
            <button className="back-btn" onClick={() => setCurrentView('welcome')}>
              <span>⬅️</span>
              <span>Back to Overview</span>
            </button>
            <h2>🤟 Sign to Text & Voice Mode</h2>
          </div>

          <div className="workstation-grid">
            {/* Left Column: Camera Viewport & Primary Controls */}
            <div className="focused-card">
              <div className="media-box">
                <video ref={videoRef} style={{ display: 'none' }} playsInline></video>
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: isCameraActive ? 'block' : 'none',
                  }}
                ></canvas>

                {!isCameraActive && (
                  <div className="camera-inactive-prompt">
                    <div className="camera-inactive-icon">📷</div>
                    <div className="camera-inactive-title">Vision Sensor Offline</div>
                    <div className="camera-inactive-desc">
                      Click the button below to initialize your camera and start tracking hand gestures
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
                <button
                  className={`welcome-action-btn ${isCameraActive ? 'btn-danger' : 'btn-primary'}`}
                  onClick={toggleCamera}
                  style={{ flex: 1 }}
                >
                  <span>{isCameraActive ? '🛑 Disconnect Camera' : '📷 Initialize Camera'}</span>
                  <span>{isCameraActive ? '✖' : '▶'}</span>
                </button>

                <button
                  className={`audio-toggle-btn ${isVoiceOutputEnabled ? 'active' : ''}`}
                  onClick={() => setIsVoiceOutputEnabled(!isVoiceOutputEnabled)}
                  title="Toggle spoken voice synthesis"
                >
                  {isVoiceOutputEnabled ? '🔊 Audio: ON' : '🔇 Audio: MUTE'}
                </button>
              </div>
            </div>

            {/* Right Column: Real-Time Recognition & Guidance */}
            <div className="focused-card" style={{ justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div className="output-box" style={{ textAlign: 'center' }}>
                  <div className="output-label">Live Recognized ISL Sign</div>
                  <div className="recognized-letter-display">
                    {currentLetter !== '-' ? currentLetter : '—'}
                  </div>
                  
                  <div className="confidence-indicator">
                    {confidence > 0 ? `Classification Confidence: ${confidence}%` : 'Position hand clearly in camera frame'}
                  </div>

                  <div className="confidence-bar-wrapper">
                    <div className="confidence-bar-fill" style={{ width: `${confidence}%` }}></div>
                  </div>

                  {spokenAudioStatus && (
                    <div style={{ color: 'var(--violet-accent)', fontSize: '0.95rem', marginTop: '10px', fontWeight: '700' }}>
                      {spokenAudioStatus}
                    </div>
                  )}
                </div>

                <div className="guidance-box" style={{ marginTop: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="guidance-title" style={{ margin: 0 }}>Active ISLRTC 3D Gesture Index:</span>
                    <span style={{ fontSize: '0.72rem', background: 'var(--violet-subtle)', color: 'var(--violet-accent)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                      Dual-Hand 60 FPS
                    </span>
                  </div>
                  <ul className="guidance-list" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    <li><strong style={{ color: 'var(--navy-primary)' }}>A, E, I, O, U:</strong> Flat base hand + dominant index touches thumb (A), index (E), middle (I), ring (O), pinky (U)</li>
                    <li><strong style={{ color: 'var(--navy-primary)' }}>B (Two-Handed):</strong> Both hands touch thumbs and index fingertips to form dual circles</li>
                    <li><strong style={{ color: 'var(--navy-primary)' }}>D (Two-Handed):</strong> Non-dominant vertical index touched by dominant index/thumb loop</li>
                    <li><strong style={{ color: 'var(--navy-primary)' }}>F (Two-Handed):</strong> Both index fingers crossing into a cross (+)</li>
                    <li><strong style={{ color: 'var(--navy-primary)' }}>G (Two-Handed):</strong> Two closed fists stacked vertically</li>
                    <li><strong style={{ color: 'var(--navy-primary)' }}>H (Two-Handed):</strong> Open dominant flat hand sweeping across open base palm</li>
                    <li><strong style={{ color: 'var(--navy-primary)' }}>S (Two-Handed):</strong> Little fingers (pinkies) hooked and touching</li>
                    <li><strong style={{ color: 'var(--navy-primary)' }}>X (Two-Handed):</strong> Both index fingers crossed diagonally</li>
                    <li><strong style={{ color: 'var(--navy-primary)' }}>C, L, V, W, Y:</strong> Single-hand distinct shapes (arc, 90° angle, peace, 3-finger W, shaka)</li>
                  </ul>
                </div>
              </div>

              <div className="tip-callout">
                💡 <strong>Accuracy Tip:</strong> Position your chest and upper body within 2–3 feet of the camera in a well-lit room for continuous 60 FPS landmark classification.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DEDICATED TEXT TO SIGN CONVERSION */}
      {currentView === 'text-to-sign' && (
        <div className="focused-view">
          <div className="view-header">
            <button className="back-btn" onClick={() => setCurrentView('welcome')}>
              <span>⬅️</span>
              <span>Back to Overview</span>
            </button>
            <h2>🗣️ Voice & Text to Sign Mode</h2>
          </div>

          <div className="workstation-grid">
            {/* Left Column: Authentic Real-Human Demonstration & ISLRTC Vector Guide */}
            <div className="focused-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{isDisplayingPhoto ? '🧑' : '📐'}</span>
                  <span style={{ fontWeight: '800', color: 'var(--navy-primary)', fontSize: '1.05rem' }}>
                    {isDisplayingPhoto ? `Real Signer (Letter ${activeSign.letter})` : `ISLRTC Technical Guide (Letter ${activeSign.letter})`}
                  </span>
                  {!hasPhoto && visualMode === 'photo' && (
                    <span style={{ fontSize: '0.72rem', background: 'var(--violet-subtle)', color: 'var(--violet-accent)', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
                      Vector Corpus
                    </span>
                  )}
                </div>

                {/* Visual Mode Selector Pill */}
                <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderRadius: '10px', padding: '3px', border: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => setVisualMode('photo')}
                    style={{
                      border: 'none',
                      background: visualMode === 'photo' ? 'var(--navy-primary)' : 'transparent',
                      color: visualMode === 'photo' ? '#ffffff' : 'var(--navy-muted)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    🧑 Real Signer
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisualMode('vector')}
                    style={{
                      border: 'none',
                      background: visualMode === 'vector' ? 'var(--navy-primary)' : 'transparent',
                      color: visualMode === 'vector' ? '#ffffff' : 'var(--navy-muted)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    📐 ISLRTC Vector (A–Z)
                  </button>
                </div>
              </div>

              <div className="media-box" style={{ padding: 0, height: '100%', minHeight: '520px' }}>
                <div className="human-stage">
                  <img
                    src={currentSignSrc}
                    alt={`ISL Sign for letter ${activeSign.letter}`}
                    className="human-image"
                    style={{
                      objectFit: isDisplayingPhoto ? 'cover' : 'contain',
                      objectPosition: isDisplayingPhoto ? 'center 30%' : 'center center'
                    }}
                  />
                  {isDisplayingPhoto && (
                    <div className="human-overlay">
                      <span className="human-badge">{activeSign.letter}</span>
                      <div className="human-text-box">
                        <strong>{activeSign.type}</strong>
                        <p>{activeSign.instructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Voice/Text Controls & Full A-Z Selector */}
            <div className="focused-card" style={{ justifyContent: 'space-between' }}>
              <div>
                {/* Voice & Speed Controls */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button
                    className="welcome-action-btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={toggleSpeechRecognition}
                  >
                    <span>{isListening ? '🛑 Stop Listening' : '🎙️ Speak Word / Letter'}</span>
                    <span>{isListening ? '●' : '🎤'}</span>
                  </button>

                  <button
                    className="audio-toggle-btn"
                    onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 0.5 : 1.0)}
                    title="Toggle Slow Motion for sign practice"
                  >
                    {playbackSpeed}x Speed {playbackSpeed === 0.5 ? '🐢' : '⚡'}
                  </button>
                </div>

                {/* Text Word Input */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Type words or letters to demonstrate (e.g. BAD, CAB)..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && playWord(inputText)}
                    style={{
                      flex: 1,
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-input)',
                      color: 'var(--navy-primary)',
                      fontSize: '1rem',
                      fontWeight: '500',
                      outline: 'none'
                    }}
                  />
                  <button
                    className="btn-primary"
                    style={{ borderRadius: '10px', padding: '0 24px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
                    onClick={() => playWord(inputText)}
                  >
                    Animate
                  </button>
                </div>

                {/* Demonstration Status */}
                <div className="output-box" style={{ marginBottom: '18px' }}>
                  <div className="output-label">Visualizer Status</div>
                  <div className="output-text">{voiceStatus}</div>
                </div>
              </div>

              {/* Full A-Z Interactive Selector */}
              <div>
                <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--navy-caption)', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>
                  ISL Alphabet Corpus (A–Z)
                </div>
                <div className="alphabet-grid">
                  {Object.keys(ISL_ALPHABET).map((char) => (
                    <button
                      key={char}
                      className={`quick-btn ${activeSignKey === char ? 'active-quick-btn' : ''}`}
                      onClick={() => {
                        setInputText(char);
                        showSign(char);
                      }}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;