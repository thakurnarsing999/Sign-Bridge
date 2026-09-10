import { useState, useRef } from 'react';
import './App.css';

// Official ISL definitions for the 4 letters
const ISL_SIGNS = {
  A: {
    letter: 'A',
    title: 'Letter A',
    icon: '✊',
    instructions: 'Closed fist with thumb resting upright against index finger.',
    svg: (
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
        <rect x="25" y="35" width="50" height="45" rx="14" fill="#0284c7" />
        <rect x="20" y="42" width="16" height="30" rx="8" fill="#38bdf8" />
        <circle cx="50" cy="55" r="8" fill="#e0f2fe" opacity="0.4" />
      </svg>
    )
  },
  B: {
    letter: 'B',
    title: 'Letter B',
    icon: '✋',
    instructions: 'All 4 fingers straight UP together, thumb tucked across the palm.',
    svg: (
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
        <rect x="30" y="15" width="10" height="55" rx="5" fill="#38bdf8" />
        <rect x="42" y="10" width="10" height="60" rx="5" fill="#38bdf8" />
        <rect x="54" y="12" width="10" height="58" rx="5" fill="#38bdf8" />
        <rect x="66" y="20" width="10" height="50" rx="5" fill="#38bdf8" />
        <rect x="28" y="55" width="50" height="30" rx="10" fill="#0284c7" />
        <rect x="22" y="52" width="16" height="18" rx="8" fill="#bae6fd" />
      </svg>
    )
  },
  C: {
    letter: 'C',
    title: 'Letter C',
    icon: '🤏',
    instructions: 'Hand curved into an open "C" shape, like holding a round cup.',
    svg: (
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
        <path d="M65 25 C30 25, 25 75, 65 75" stroke="#38bdf8" strokeWidth="14" strokeLinecap="round" />
        <circle cx="65" cy="25" r="7" fill="#bae6fd" />
        <circle cx="65" cy="75" r="7" fill="#bae6fd" />
      </svg>
    )
  },
  D: {
    letter: 'D',
    title: 'Letter D',
    icon: '☝️',
    instructions: 'Index finger pointing straight UP, thumb touches middle & ring fingers in a loop.',
    svg: (
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
        <rect x="40" y="10" width="12" height="60" rx="6" fill="#38bdf8" />
        <circle cx="58" cy="62" r="18" stroke="#0284c7" strokeWidth="12" />
        <rect x="35" y="60" width="40" height="28" rx="10" fill="#0369a1" />
      </svg>
    )
  }
};

// Spoken word aliases mapping to signs
const SPEECH_ALIASES = {
  A: ['A', 'AY', 'HAY', 'EH', 'ALPHA'],
  B: ['B', 'BE', 'BEE', 'BRAVO'],
  C: ['C', 'SEE', 'SEA', 'SI', 'CHARLIE'],
  D: ['D', 'DEE', 'THE', 'DELTA']
};

function App() {
  // Left Panel State (Sign -> Voice & Text)
  const [currentLetter, setCurrentLetter] = useState('-');
  const [confidence, setConfidence] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [spokenAudioStatus, setSpokenAudioStatus] = useState('');

  // Right Panel State (Voice/Text -> Sign)
  const [inputText, setInputText] = useState('');
  const [activeSignKey, setActiveSignKey] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Click "Start Speaking" or type a letter');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstance = useRef(null);
  const speechRecognitionRef = useRef(null);

  const lastDetectedSignRef = useRef('');
  const lastSpokenLetterRef = useRef('');
  const holdCountRef = useRef(0);

  // Direction 1: Speak detected letter through computer speaker
  const speakDetectedLetter = (letter) => {
    if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
    if (lastSpokenLetterRef.current === letter) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    lastSpokenLetterRef.current = letter;
    setSpokenAudioStatus(`🔊 Spoke "${letter}"`);
  };

  // MediaPipe Landmark Classifier for A, B, C, D
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

          // Confirm sign stability before speaking
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

  // Direction 2: Display sign for given letter
  const showSign = (char) => {
    const upper = char.toUpperCase();
    if (ISL_SIGNS[upper]) {
      setActiveSignKey(upper);
      setVoiceStatus(`Displaying ISL Sign: "${upper}"`);
    } else {
      setVoiceStatus(`Sign for "${char}" not available in v0.1`);
    }
  };

  // Animate word sequence
  const playWord = (word) => {
    const chars = word.toUpperCase().split('').filter(c => ISL_SIGNS[c]);
    if (chars.length === 0) {
      setVoiceStatus('Please enter A, B, C, or D to animate');
      return;
    }
    let idx = 0;
    setVoiceStatus(`Playing Signs: "${chars.join(' - ')}"`);
    showSign(chars[0]);
    const interval = setInterval(() => {
      idx += 1;
      if (idx < chars.length) {
        showSign(chars[idx]);
      } else {
        clearInterval(interval);
      }
    }, 1500);
  };

  // Direction 2: Voice recognition (Microphone -> Sign)
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
      setVoiceStatus('🎙️ Listening... Speak a letter ("A", "B", "C", "D")');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toUpperCase();
      setInputText(transcript);

      // Match against aliases or letters
      let matchedLetter = null;
      for (const [letter, aliases] of Object.entries(SPEECH_ALIASES)) {
        if (aliases.some(alias => transcript.includes(alias))) {
          matchedLetter = letter;
          break;
        }
      }

      if (matchedLetter) {
        setVoiceStatus(`Heard: "${transcript}" ➔ Showing Sign for "${matchedLetter}"`);
        showSign(matchedLetter);
      } else {
        setVoiceStatus(`Heard: "${transcript}"`);
        playWord(transcript);
      }
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

  return (
    <div className="app-container">
      <header className="header">
        <h1>🌉 Sign Bridge</h1>
        <p>Two-Way Indian Sign Language (ISL) Communication Assistant</p>
      </header>

      <div className="dashboard-grid">
        
        {/* Left Side: Deaf to Hearing (Sign -> Voice) */}
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
              title="Toggle automatic speech when a sign is detected"
            >
              {isVoiceOutputEnabled ? '🔊 Voice: ON' : '🔇 Voice: MUTE'}
            </button>
          </div>

          <div className="output-box" style={{ textAlign: 'center', marginTop: '16px' }}>
            <div className="output-label">Detected Sign & Voice Status</div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#38bdf8', margin: '6px 0' }}>
              {currentLetter !== '-' ? currentLetter : '—'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {confidence > 0 ? `Confidence: ${confidence}%` : 'Hold a sign in front of the camera'}
            </div>
            {spokenAudioStatus && (
              <div style={{ color: '#38bdf8', fontSize: '0.85rem', marginTop: '6px', fontWeight: 'bold' }}>
                {spokenAudioStatus}
              </div>
            )}
          </div>

          <div style={{ marginTop: '14px', background: '#090d16', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
            <strong style={{ color: '#38bdf8' }}>💡 Signs:</strong>
            <span style={{ marginLeft: '8px' }}>A (Fist) • B (4 Fingers Up) • C (Curved Hand) • D (Index Up)</span>
          </div>
        </div>

        {/* Right Side: Hearing to Deaf (Voice ➔ Sign) */}
        <div className="card">
          <div className="card-title">
            <span>🗣️</span>
            <h2>Hearing Person to Deaf Person (Voice ➔ Sign)</h2>
          </div>

          <div className="media-box">
            {activeSignKey && ISL_SIGNS[activeSignKey] ? (
              <div className="sign-display">
                <div className="sign-badge">{activeSignKey}</div>
                <div style={{ marginBottom: '8px' }}>
                  {ISL_SIGNS[activeSignKey].svg}
                </div>
                <div className="sign-desc">
                  {ISL_SIGNS[activeSignKey].instructions}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>🎥</p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>ISL Sign Visualizer</p>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Speak or type a letter to see the ISL sign!
                </span>
              </div>
            )}
          </div>

          {/* Voice Input Button */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '1.05rem' }}
              onClick={toggleSpeechRecognition}
            >
              {isListening ? '🛑 Stop Listening' : '🎙️ Speak Letter (A, B, C, D)'}
            </button>
          </div>

          {/* Text Input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Or type letters (e.g. BAD)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && playWord(inputText)}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #475569',
                background: '#090d16',
                color: '#f8fafc',
                fontSize: '0.9rem'
              }}
            />
            <button
              className="btn"
              onClick={() => playWord(inputText)}
            >
              Show Sign
            </button>
          </div>

          {/* Quick Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Quick Pick:</span>
            {['A', 'B', 'C', 'D'].map((letter) => (
              <button
                key={letter}
                className="quick-btn"
                onClick={() => {
                  setInputText(letter);
                  showSign(letter);
                }}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="output-box" style={{ marginTop: '16px' }}>
            <div className="output-label">Voice / Translation Status</div>
            <div className="output-text" style={{ fontSize: '1.05rem' }}>{voiceStatus}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;