import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [currentLetter, setCurrentLetter] = useState('-');
  const [confidence, setConfidence] = useState(0);
  const [spokenText, setSpokenText] = useState('Click "Start Speaking" and talk...');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstance = useRef(null);

  // The Classifier: Inspects finger landmarks and detects ONE letter
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

    // Check if fingers are extended straight UP
    const isIndexExtended = indexTip.y < indexPip.y;
    const isMiddleExtended = middleTip.y < middlePip.y;
    const isRingExtended = ringTip.y < ringPip.y;
    const isPinkyExtended = pinkyTip.y < pinkyPip.y;

    // Measure gap between thumb and index
    const thumbIndexDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
    const handSize = Math.hypot(wrist.x - middlePip.x, wrist.y - middlePip.y);
    const normalizedGap = thumbIndexDist / (handSize || 1);

    // Rule 1: Letter B (All 4 fingers pointing UP)
    if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
      return { sign: 'B', conf: 96 };
    }

    // Rule 2: Letter D (Only index finger pointing straight UP)
    if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return { sign: 'D', conf: 94 };
    }

    // When fingers are curled:
    if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      // Rule 3: Letter C (Open curved C shape)
      if (normalizedGap > 0.45) {
        return { sign: 'C', conf: 93 };
      }
      // Rule 4: Letter A (Closed fist)
      if (normalizedGap <= 0.45) {
        return { sign: 'A', conf: 95 };
      }
    }

    return null;
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      if (cameraInstance.current) {
        cameraInstance.current.stop();
      }
      setIsCameraActive(false);
      setCurrentLetter('-');
      setConfidence(0);
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

      // Draw the video frame
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        // Draw skeleton lines
        window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, {
          color: '#38bdf8',
          lineWidth: 3,
        });
        window.drawLandmarks(canvasCtx, landmarks, {
          color: '#f43f5e',
          lineWidth: 1,
          radius: 4,
        });

        // Detect the single letter
        const result = classifySign(landmarks);
        if (result) {
          setCurrentLetter(result.sign);
          setConfidence(result.conf);
        } else {
          setCurrentLetter('-');
          setConfidence(0);
        }
      } else {
        setCurrentLetter('-');
        setConfidence(0);
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
      <header className="header">
        <h1>🌉 Sign Bridge</h1>
        <p>Two-Way Indian Sign Language (ISL) Communication Assistant</p>
      </header>

      <div className="dashboard-grid">
        
        {/* Left Side: Deaf to Hearing (Sign -> Text) */}
        <div className="card">
          <div className="card-title">
            <span>🤟</span>
            <h2>Deaf Person to Hearing Person</h2>
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

          <button
            className={`btn ${isCameraActive ? 'btn-danger' : ''}`}
            onClick={toggleCamera}
          >
            {isCameraActive ? '🛑 Turn Off Camera' : '📷 Turn On Camera'}
          </button>

          {/* Clean Single Letter Output Box */}
          <div className="output-box" style={{ textAlign: 'center', marginTop: '20px' }}>
            <div className="output-label">Current Detected Letter</div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#38bdf8', margin: '10px 0' }}>
              {currentLetter !== '-' ? currentLetter : '—'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {confidence > 0 ? `Confidence: ${confidence}%` : 'Show a hand sign to the camera'}
            </div>
          </div>

          {/* Practice Guide */}
          <div style={{ marginTop: '16px', background: '#090d16', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <strong style={{ color: '#38bdf8' }}>💡 Signs:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li><strong>A:</strong> Closed fist</li>
              <li><strong>B:</strong> 4 fingers straight UP</li>
              <li><strong>C:</strong> Hand curved like a 'C' cup</li>
              <li><strong>D:</strong> Index finger pointing straight UP</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Hearing to Deaf */}
        <div className="card">
          <div className="card-title">
            <span>🗣️</span>
            <h2>Hearing Person to Deaf Person</h2>
          </div>

          <div className="media-box">
            <p>🎥 ISL Sign Video / Animation Area</p>
            <span style={{ fontSize: '0.85rem' }}>(Will play the corresponding sign)</span>
          </div>

          <button className="btn btn-secondary">
            🎙️ Start Speaking
          </button>

          <div className="output-box">
            <div className="output-label">Recognized Speech</div>
            <div className="output-text">{spokenText}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;