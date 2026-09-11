import { useState, useRef } from 'react';
import './App.css';

// Complete Official Indian Sign Language (ISL) Alphabet Specifications (A to Z)
const ISL_ALPHABET = {
  A: {
    letter: 'A',
    type: 'Vowel (Two-Handed)',
    image: '/signs/sign_a.jpg',
    instructions: 'Point the dominant index finger directly to the THUMB TIP of the open non-dominant hand.'
  },
  B: {
    letter: 'B',
    type: 'Consonant (Two-Handed)',
    image: '/signs/sign_b.jpg',
    instructions: 'Touch thumbs and curved index fingers of both hands together to form two circular loops (like binoculars / 8).'
  },
  C: {
    letter: 'C',
    type: 'Consonant (One-Handed)',
    image: '/signs/sign_c.jpg',
    instructions: 'Curve one hand in front of the chest in a distinct "C" arc, fingers and thumb curved like holding a cup.'
  },
  D: {
    letter: 'D',
    type: 'Consonant (Two-Handed)',
    image: '/signs/sign_d.jpg',
    instructions: 'Non-dominant index points straight UP; dominant thumb and index form a curved loop touching it.'
  },
  E: {
    letter: 'E',
    type: 'Vowel (Two-Handed)',
    instructions: 'Point the dominant index finger directly to the INDEX FINGER TIP of the open non-dominant hand.'
  },
  F: {
    letter: 'F',
    type: 'Consonant (Two-Handed)',
    instructions: 'Cross both index fingers over each other to form a cross / plus shape (+).'
  },
  G: {
    letter: 'G',
    type: 'Consonant (Two-Handed)',
    instructions: 'Place both closed fists stacked directly on top of each other.'
  },
  H: {
    letter: 'H',
    type: 'Consonant (Two-Handed)',
    instructions: 'Open dominant hand sweeps horizontally across the flat palm of the non-dominant hand.'
  },
  I: {
    letter: 'I',
    type: 'Vowel (Two-Handed)',
    instructions: 'Point the dominant index finger directly to the MIDDLE FINGER TIP of the open non-dominant hand.'
  },
  J: {
    letter: 'J',
    type: 'Consonant (Two-Handed)',
    instructions: 'Trace the curved letter "J" using your dominant index finger onto the open palm of the other hand.'
  },
  K: {
    letter: 'K',
    type: 'Consonant (Two-Handed)',
    instructions: 'Hook your dominant index finger and place the knuckle against the side of the non-dominant index.'
  },
  L: {
    letter: 'L',
    type: 'Consonant (Two-Handed)',
    instructions: 'Make an "L" shape with thumb and index of dominant hand, place it flat on the other palm.'
  },
  M: {
    letter: 'M',
    type: 'Consonant (Two-Handed)',
    instructions: 'Rest 3 fingers (index, middle, ring) of dominant hand flat onto the open non-dominant palm.'
  },
  N: {
    letter: 'N',
    type: 'Consonant (Two-Handed)',
    instructions: 'Rest 2 fingers (index, middle) of dominant hand flat onto the open non-dominant palm.'
  },
  O: {
    letter: 'O',
    type: 'Vowel (Two-Handed)',
    instructions: 'Point the dominant index finger directly to the RING FINGER TIP of the open non-dominant hand.'
  },
  P: {
    letter: 'P',
    type: 'Consonant (Two-Handed)',
    instructions: 'Dominant index and thumb form a circle touching the tip of the vertical non-dominant index finger.'
  },
  Q: {
    letter: 'Q',
    type: 'Consonant (Two-Handed)',
    instructions: 'Hook dominant thumb and index into a ring, place it over the base of the non-dominant thumb.'
  },
  R: {
    letter: 'R',
    type: 'Consonant (Two-Handed)',
    instructions: 'Hook dominant index finger around the straight non-dominant index finger.'
  },
  S: {
    letter: 'S',
    type: 'Consonant (Two-Handed)',
    instructions: 'Hook the little fingers (pinkies) of both hands tightly together.'
  },
  T: {
    letter: 'T',
    type: 'Consonant (Two-Handed)',
    instructions: 'Touch the dominant index finger against the edge/side of the flat non-dominant hand.'
  },
  U: {
    letter: 'U',
    type: 'Vowel (Two-Handed)',
    instructions: 'Point the dominant index finger directly to the PINKY FINGER TIP of the open non-dominant hand.'
  },
  V: {
    letter: 'V',
    type: 'Consonant (Two-Handed)',
    instructions: 'Form a "V" (peace sign) with dominant hand and place the tips onto the open non-dominant palm.'
  },
  W: {
    letter: 'W',
    type: 'Consonant (Two-Handed)',
    instructions: 'Interlace and spread the fingers of both hands together with palms facing inward.'
  },
  X: {
    letter: 'X',
    type: 'Consonant (Two-Handed)',
    instructions: 'Cross both index fingers in an "X" shape in front of the chest.'
  },
  Y: {
    letter: 'Y',
    type: 'Consonant (Two-Handed)',
    instructions: 'Place dominant index finger into the "V" groove between the thumb and index of non-dominant hand.'
  },
  Z: {
    letter: 'Z',
    type: 'Consonant (Two-Handed)',
    instructions: 'Hold non-dominant hand flat; place dominant fingertips on palm pointing outward like an angled "Z".'
  }
};

function App() {
  // Left Panel State (Sign -> Voice & Text)
  const [currentLetter, setCurrentLetter] = useState('-');
  const [confidence, setConfidence] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [spokenAudioStatus, setSpokenAudioStatus] = useState('');

  // Right Panel State (Voice/Text -> A-Z Signer)
  const [inputText, setInputText] = useState('HELLO');
  const [activeSignKey, setActiveSignKey] = useState('B');
  const [isListening, setIsListening] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [voiceStatus, setVoiceStatus] = useState('Type any word (e.g. INDIA, HELP, HELLO) to animate signs');

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

  const classifySign = (landmarks) => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const indexPip = landmarks[6];
    const middleTip = landmarks[12];
    const middlePip = landmarks[10];
    const ringTip = landmarks[16];
    const ringPip = landmarks[14];
    const pinkyTip = landmarks[20];
    const pinkyPip = landmarks[18];
    const wrist = landmarks[0];

    const isIndexExtended = indexTip.y < indexPip.y;
    const isMiddleExtended = middleTip.y < middlePip.y;
    const isRingExtended = ringTip.y < ringPip.y;
    const isPinkyExtended = pinkyTip.y < pinkyPip.y;

    const thumbIndexDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
    const handSize = Math.hypot(wrist.x - middlePip.x, wrist.y - middlePip.y);
    const normalizedGap = thumbIndexDist / (handSize || 1);

    if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
      return { sign: 'B', conf: 96 };
    }
    if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return { sign: 'D', conf: 94 };
    }
    if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      if (normalizedGap > 0.45) return { sign: 'C', conf: 93 };
      if (normalizedGap <= 0.45) return { sign: 'A', conf: 95 };
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
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { color: '#38bdf8', lineWidth: 3 });
        window.drawLandmarks(canvasCtx, landmarks, { color: '#f43f5e', lineWidth: 1, radius: 4 });

        const result = classifySign(landmarks);
        if (result) {
          setCurrentLetter(result.sign);
          setConfidence(result.conf);

          if (result.sign === lastDetectedSignRef.current) {
            holdCountRef.current += 1;
            if (holdCountRef.current === 12) {
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
      setVoiceStatus(`Showing ISL Letter "${upper}" (${ISL_ALPHABET[upper].type})`);
    }
  };

  const playWord = (word) => {
    const chars = word.toUpperCase().split('').filter(c => ISL_ALPHABET[c]);
    if (chars.length === 0) {
      setVoiceStatus('Please enter letters (A through Z) to animate');
      return;
    }
    let idx = 0;
    const intervalTime = playbackSpeed === 0.5 ? 2400 : 1500;
    setVoiceStatus(`Signing Word: "${chars.join(' - ')}"`);
    showSign(chars[0]);

    const interval = setInterval(() => {
      idx += 1;
      if (idx < chars.length) {
        showSign(chars[idx]);
      } else {
        clearInterval(interval);
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
      setVoiceStatus('🎙️ Listening... Speak any word or letter');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toUpperCase();
      setInputText(transcript);
      setVoiceStatus(`Heard: "${transcript}" ➔ Translating to ISL`);
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

  return (
    <div className="app-container">
      <header className="header">
        <h1>🌉 Sign Bridge</h1>
        <p>Two-Way Indian Sign Language (ISL) Communication Assistant (A to Z)</p>
      </header>

      <div className="dashboard-grid">
        
        {/* Left Side: Deaf to Hearing */}
        <div className="card">
          <div className="card-title">
            <span>🤟</span>
            <h2>Deaf Person to Hearing Person (Sign ➔ Voice)</h2>
          </div>
          
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
                borderRadius: '12px',
                display: isCameraActive ? 'block' : 'none',
              }}
            ></canvas>

            {!isCameraActive && (
              <p>📷 Webcam is currently turned off</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`btn ${isCameraActive ? 'btn-danger' : ''}`}
              onClick={toggleCamera}
              style={{ flex: 1 }}
            >
              {isCameraActive ? '🛑 Turn Off Camera' : '📷 Turn On Camera'}
            </button>

            <button
              className="btn"
              style={{ background: isVoiceOutputEnabled ? '#0284c7' : '#475569' }}
              onClick={() => setIsVoiceOutputEnabled(!isVoiceOutputEnabled)}
              title="Toggle computer speaking aloud"
            >
              {isVoiceOutputEnabled ? '🔊 Voice: ON' : '🔇 Voice: MUTE'}
            </button>
          </div>

          <div className="output-box" style={{ textAlign: 'center', marginTop: '14px' }}>
            <div className="output-label">Live Recognized Sign</div>
            <div style={{ fontSize: '2.8rem', fontWeight: 'bold', color: '#38bdf8', margin: '4px 0' }}>
              {currentLetter !== '-' ? currentLetter : '—'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {confidence > 0 ? `Confidence: ${confidence}%` : 'Hold a sign in front of the camera'}
            </div>
            {spokenAudioStatus && (
              <div style={{ color: '#38bdf8', fontSize: '0.85rem', marginTop: '4px', fontWeight: 'bold' }}>
                {spokenAudioStatus}
              </div>
            )}
          </div>

          <div style={{ marginTop: '12px', background: '#090d16', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
            <strong style={{ color: '#38bdf8' }}>💡 Core Signs:</strong>
            <span style={{ marginLeft: '8px' }}>A (Fist) • B (Two Loops) • C (Curved Arc) • D (Vertical Index)</span>
          </div>
        </div>

        {/* Right Side: Hearing to Deaf (A-Z ISL Visualizer) */}
        <div className="card">
          <div className="card-title">
            <span>🗣️</span>
            <h2>Hearing Person to Deaf Person (Voice ➔ Sign)</h2>
          </div>

          <div className="media-box" style={{ padding: 0 }}>
            {activeSign.image ? (
              <div className="human-stage">
                <img
                  src={activeSign.image}
                  alt={activeSign.letter}
                  className="human-image"
                />
                <div className="human-overlay">
                  <span className="human-badge">{activeSign.letter}</span>
                  <div className="human-text-box">
                    <strong>{activeSign.type}</strong>
                    <p>{activeSign.instructions}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="avatar-stage">
                <span className="avatar-badge">{activeSign.letter}</span>
                <div style={{ fontSize: '3rem', margin: '8px 0' }}>🤟</div>
                <div className="avatar-label">ISL Letter "{activeSign.letter}" ({activeSign.type})</div>
                <div className="avatar-instructions" style={{ maxWidth: '85%' }}>
                  {activeSign.instructions}
                </div>
              </div>
            )}
          </div>

          {/* Voice Button & Speed Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.95rem' }}
              onClick={toggleSpeechRecognition}
            >
              {isListening ? '🛑 Stop Listening' : '🎙️ Speak Word (e.g. "INDIA", "HELP")'}
            </button>

            <button
              className="quick-btn"
              onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 0.5 : 1.0)}
              title="Toggle Slow Motion for sign practice"
            >
              Speed: {playbackSpeed}x {playbackSpeed === 0.5 ? '🐢' : '⚡'}
            </button>
          </div>

          {/* Text Word Input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Type ANY word (e.g. WATER, HELLO, INDIA)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && playWord(inputText)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #3a506b',
                background: '#090d16',
                color: '#f8fafc',
                fontSize: '0.9rem'
              }}
            />
            <button
              className="btn"
              onClick={() => playWord(inputText)}
            >
              Animate Word
            </button>
          </div>

          {/* Full A-Z Quick Bar */}
          <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
            <div style={{ display: 'flex', gap: '5px', minWidth: 'max-content' }}>
              {Object.keys(ISL_ALPHABET).map((char) => (
                <button
                  key={char}
                  className={`quick-btn ${activeSignKey === char ? 'active-quick-btn' : ''}`}
                  style={{ padding: '4px 10px', fontSize: '0.85rem' }}
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

          <div className="output-box" style={{ marginTop: '12px' }}>
            <div className="output-label">Word / Translation Status</div>
            <div className="output-text" style={{ fontSize: '1rem' }}>{voiceStatus}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;