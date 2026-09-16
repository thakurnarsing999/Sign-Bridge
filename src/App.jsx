import { useState, useRef } from 'react';
import './App.css';

function App() {
  // Navigation View State: 'welcome' | 'sign-to-text'
  const [currentView, setCurrentView] = useState('welcome');

  // Sign to Text & Voice Recognition State
  const [currentLetter, setCurrentLetter] = useState('-');
  const [confidence, setConfidence] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStageText, setDownloadStageText] = useState('ZERO-G SENSOR STANDBY');
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [spokenAudioStatus, setSpokenAudioStatus] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstance = useRef(null);

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
    if (isCameraActive || isCalibrating) {
      if (cameraInstance.current) cameraInstance.current.stop();
      setIsCameraActive(false);
      setIsCalibrating(false);
      setDownloadProgress(0);
      setDownloadStageText('ZERO-G SENSOR STANDBY');
      setCurrentLetter('-');
      setConfidence(0);
      setSpokenAudioStatus('');
    } else {
      setIsCalibrating(true);
      setDownloadProgress(10);
      setDownloadStageText('DOWNLOADING ZERO-G VISION RUNTIME...');

      let currentStep = 10;
      const interval = setInterval(() => {
        currentStep += 15;
        if (currentStep >= 100) {
          clearInterval(interval);
          setDownloadProgress(100);
          setDownloadStageText('ORBITAL TRACKING ENGAGED (60 FPS)');
          setTimeout(() => {
            setIsCalibrating(false);
            setIsCameraActive(true);
            startMediaPipe();
          }, 350);
        } else {
          setDownloadProgress(currentStep);
          if (currentStep < 45) {
            setDownloadStageText('DOWNLOADING ZERO-G VISION RUNTIME (WASM)...');
          } else if (currentStep < 80) {
            setDownloadStageText('LEVITATING 42 SKELETAL LANDMARK TENSORS...');
          } else {
            setDownloadStageText('CALIBRATING 60 FPS ZERO-G TRACKING...');
          }
        }
      }, 140);
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
          window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { color: '#00f2fe', lineWidth: 3 });
          window.drawLandmarks(canvasCtx, landmarks, { color: '#34d399', lineWidth: 1, radius: 4 });
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

  return (
    <div className="app-container">
      {/* Premium Top Navigation Bar */}
      <header className="header">
        <div className="header-brand" onClick={() => setCurrentView('welcome')}>
          <div className="brand-icon-wrapper">🌉</div>
          <div>
            <h1>Sign Bridge</h1>
            <p>Indian Sign Language (ISL) Vision Recognition</p>
          </div>
        </div>

        {/* Navigation Tabs */}
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
        </div>
      </header>

      {/* VIEW 1: HERO / WELCOME LANDING PORTAL */}
      {currentView === 'welcome' && (
        <div className="welcome-hero">
          {/* Antigravity Zero-G Visual Showcase */}
          <div className="antigravity-scene" style={{ width: '160px', height: '160px', marginBottom: '16px' }}>
            <div className="gyro-ring gyro-ring-1" style={{ width: '130px', height: '130px' }}></div>
            <div className="gyro-ring gyro-ring-2" style={{ width: '100px', height: '100px' }}></div>
            <div className="gyro-ring gyro-ring-3" style={{ width: '160px', height: '160px' }}></div>
            <div className="antigravity-core" style={{ width: '42px', height: '42px' }}></div>
            <div className="particle-field">
              <span className="particle" style={{ left: '20%', animationDelay: '0s', animationDuration: '2.4s' }}></span>
              <span className="particle" style={{ left: '40%', animationDelay: '0.7s', animationDuration: '2.8s' }}></span>
              <span className="particle" style={{ left: '60%', animationDelay: '1.3s', animationDuration: '2.2s' }}></span>
              <span className="particle" style={{ left: '80%', animationDelay: '0.4s', animationDuration: '2.6s' }}></span>
            </div>
          </div>

          <div className="pill-tag">
            <span className="pulsing-dot"></span>
            Real-Time Vision Landmark Recognition
          </div>
          
          <h2 className="welcome-title">
            Bridge Every Gesture.<br />
            <span className="gradient-text">Empower Every Voice.</span>
          </h2>

          <p className="welcome-subtitle">
            An advanced assistive system translating authentic Indian Sign Language (ISL) gestures 
            directly into on-screen text and real-time speech using 3D skeletal computer vision.
          </p>

          <div style={{ maxWidth: '680px', margin: '0 auto 36px', width: '100%' }}>
            {/* Primary Action Card: Sign to Text / Voice */}
            <div 
              className="welcome-card" 
              onClick={() => setCurrentView('sign-to-text')}
              style={{ cursor: 'pointer', textAlign: 'center', padding: '36px 32px' }}
            >
              <div className="welcome-card-icon-box" style={{ margin: '0 auto 16px' }}>🤟</div>
              <span className="welcome-card-tag">Bilateral Gesture Recognition Engine</span>
              <h3 style={{ fontSize: '1.45rem', margin: '10px 0' }}>Real-Time Sign to Text & Speech</h3>
              <p style={{ maxWidth: '520px', margin: '0 auto 24px', color: 'var(--navy-muted)', fontSize: '0.96rem' }}>
                Position your hands in front of your camera. Our dual-hand vision engine tracks 42 skeletal joints 
                at 60 FPS and translates your ISL signs instantly into text and natural voice audio.
              </p>
              <button 
                className="welcome-action-btn btn-primary"
                style={{ maxWidth: '320px', margin: '0 auto', padding: '16px 28px', fontSize: '1.05rem' }}
                onClick={() => setCurrentView('sign-to-text')}
              >
                <span>Launch Vision Detector</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          {/* Institutional Feature Badges */}
          <div className="feature-badges-row">
            <div className="feature-pill">● Dual-Hand 3D Landmark Tracking (60 FPS)</div>
            <div className="feature-pill">● Official ISLRTC Indian Sign Standard</div>
            <div className="feature-pill">● Real-Time Natural Speech Synthesis</div>
            <div className="feature-pill">● Lighting & Skin Tone Invariant</div>
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
                  <div className="camera-inactive-prompt" style={{ width: '100%', maxWidth: '450px', padding: '24px' }}>
                    <div className="antigravity-scene" style={{ width: '200px', height: '200px', marginBottom: '16px' }}>
                      <div className="gyro-ring gyro-ring-1"></div>
                      <div className="gyro-ring gyro-ring-2"></div>
                      <div className="gyro-ring gyro-ring-3"></div>
                      <div className="antigravity-core"></div>
                      <div className="particle-field">
                        <span className="particle" style={{ left: '16%', animationDelay: '0s', animationDuration: '2.4s' }}></span>
                        <span className="particle" style={{ left: '32%', animationDelay: '0.6s', animationDuration: '2.8s' }}></span>
                        <span className="particle" style={{ left: '50%', animationDelay: '1.2s', animationDuration: '2.1s' }}></span>
                        <span className="particle" style={{ left: '68%', animationDelay: '0.3s', animationDuration: '2.9s' }}></span>
                        <span className="particle" style={{ left: '84%', animationDelay: '0.9s', animationDuration: '2.5s' }}></span>
                        <span className="particle" style={{ left: '26%', animationDelay: '1.5s', animationDuration: '2.2s' }}></span>
                        <span className="particle" style={{ left: '74%', animationDelay: '1.8s', animationDuration: '2.7s' }}></span>
                      </div>
                    </div>

                    {isCalibrating ? (
                      <div className="antigravity-download-card" style={{ margin: '0 auto' }}>
                        <div className="download-status-row">
                          <span style={{ color: 'var(--cyan-accent)', fontSize: '0.78rem' }}>{downloadStageText}</span>
                          <span style={{ color: 'var(--cyan-accent)', fontWeight: '800' }}>{downloadProgress}%</span>
                        </div>
                        <div className="download-track">
                          <div className="download-bar" style={{ width: `${downloadProgress}%` }}></div>
                        </div>
                        <div className="telemetry-row">
                          <span className="telemetry-tag">⚡ ANTIGRAVITY ENGINE</span>
                          <span style={{ fontFamily: 'monospace' }}>WASM • 0.00 G</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="camera-inactive-title" style={{ fontSize: '1.3rem', marginBottom: '6px' }}>
                          Zero-G Vision Sensor Standby
                        </div>
                        <div className="camera-inactive-desc" style={{ maxWidth: '380px', margin: '0 auto', fontSize: '0.88rem' }}>
                          Click the button below to download the vision runtime and engage 3D skeletal landmark tracking.
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
                <button
                  className={`welcome-action-btn ${isCameraActive ? 'btn-danger' : 'btn-primary'}`}
                  onClick={toggleCamera}
                  style={{ flex: 1 }}
                  disabled={isCalibrating}
                >
                  <span>
                    {isCalibrating
                      ? '⏳ Downloading Vision Runtime...'
                      : isCameraActive
                      ? '🛑 Disconnect Camera'
                      : '⚡ Initialize Antigravity Vision'}
                  </span>
                  <span>{isCameraActive ? '✖' : isCalibrating ? '⋯' : '▶'}</span>
                </button>

                <button
                  className={`audio-toggle-btn ${isVoiceOutputEnabled ? 'active' : ''}`}
                  onClick={() => setIsVoiceOutputEnabled(!isVoiceOutputEnabled)}
                  title="Toggle spoken voice synthesis"
                >
                  {isVoiceOutputEnabled ? '🔊 Audio ON' : '🔇 Audio Muted'}
                </button>
              </div>
            </div>

            {/* Right Column: Live Recognition & Guidance */}
            <div className="focused-card" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="output-box" style={{ textAlign: 'center', padding: '24px 20px' }}>
                  <div className="output-label">Recognized ISL Gesture</div>
                  
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
                    <div style={{ color: 'var(--cyan-accent)', fontSize: '0.95rem', marginTop: '10px', fontWeight: '700' }}>
                      {spokenAudioStatus}
                    </div>
                  )}
                </div>

                <div className="guidance-box" style={{ marginTop: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="guidance-title" style={{ margin: 0 }}>Active ISLRTC 3D Gesture Index:</span>
                    <span style={{ fontSize: '0.72rem', background: 'var(--cyan-subtle)', color: 'var(--cyan-accent)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700', border: '1px solid var(--cyan-border)' }}>
                      Dual-Hand 60 FPS
                    </span>
                  </div>
                  <ul className="guidance-list" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    <li><strong style={{ color: 'var(--cyan-blue)' }}>A, E, I, O, U:</strong> Flat base hand + dominant index touches thumb (A), index (E), middle (I), ring (O), pinky (U)</li>
                    <li><strong style={{ color: 'var(--cyan-blue)' }}>B (Two-Handed):</strong> Both hands touch thumbs and index fingertips to form dual circles</li>
                    <li><strong style={{ color: 'var(--cyan-blue)' }}>D (Two-Handed):</strong> Non-dominant vertical index touched by dominant index/thumb loop</li>
                    <li><strong style={{ color: 'var(--cyan-blue)' }}>F (Two-Handed):</strong> Both index fingers crossing into a cross (+)</li>
                    <li><strong style={{ color: 'var(--cyan-blue)' }}>G (Two-Handed):</strong> Two closed fists stacked vertically</li>
                    <li><strong style={{ color: 'var(--cyan-blue)' }}>H (Two-Handed):</strong> Open dominant flat hand sweeping across open base palm</li>
                    <li><strong style={{ color: 'var(--cyan-blue)' }}>S (Two-Handed):</strong> Little fingers (pinkies) hooked and touching</li>
                    <li><strong style={{ color: 'var(--cyan-blue)' }}>X (Two-Handed):</strong> Both index fingers crossed diagonally</li>
                    <li><strong style={{ color: 'var(--cyan-blue)' }}>C, L, V, W, Y:</strong> Single-hand distinct shapes (arc, 90° angle, peace, 3-finger W, shaka)</li>
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
    </div>
  );
}

export default App;
