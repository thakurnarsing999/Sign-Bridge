import { useState, useRef, useEffect, useCallback } from "react";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import ModeSelector from "./components/ModeSelector";
import CameraPanel from "./components/CameraPanel";
import TranscriptPanel from "./components/TranscriptPanel";
import SpeechToSignPanel from "./components/SpeechToSignPanel";
import ReferenceGuideDrawer from "./components/ReferenceGuideDrawer";
import FloatingActions from "./components/FloatingActions";
import SettingsModal from "./components/SettingsModal";
import OnboardingModal from "./components/OnboardingModal";
import "./App.css";

export default function App() {
  // Navigation View: 'home' (Landing Page) | 'studio' (Unified Sign to Text & Speech) | 'two-way'
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return ["home", "studio", "two-way"].includes(hash) ? hash : "home";
  });

  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // Input Recognition Mode: 'alphabets' | 'digits'
  const [activeMode, setActiveMode] = useState(() => {
    return localStorage.getItem("signbridge_mode") || "alphabets";
  });

  // Camera & Calibration State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStageText, setDownloadStageText] = useState("Camera ready");
  const [cameraFacingMode, setCameraFacingMode] = useState("user"); // 'user' (front) | 'environment' (rear)

  // Real-Time Sign Detection State
  const [currentLetter, setCurrentLetter] = useState("-");
  const [confidence, setConfidence] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Settings State (Persisted in localStorage)
  const [confidenceThreshold, setConfidenceThreshold] = useState(() => {
    const saved = localStorage.getItem("signbridge_threshold");
    return saved ? Number(saved) : 75;
  });
  const [speechRate, setSpeechRate] = useState(() => {
    const saved = localStorage.getItem("signbridge_speech_rate");
    return saved ? Number(saved) : 1.0;
  });

  // Sentence Accumulator & Transcript State
  const [transcript, setTranscript] = useState("");
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [lastAddedLetter, setLastAddedLetter] = useState("");
  const [autoSpaceProgress, setAutoSpaceProgress] = useState(0);

  // Audio Speech State
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const isVoiceOutputEnabledRef = useRef(true);
  const [spokenAudioStatus, setSpokenAudioStatus] = useState("");

  // Modals & Drawers State
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Accessibility Live Region Announcement
  const [announcement, setAnnouncement] = useState("");

  // DOM Refs & Model Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstance = useRef(null);
  const modelRef = useRef(null);

  // Internal Stable Gesture Tracking Refs
  const lastDetectedSignRef = useRef("");
  const lastCommittedSignRef = useRef("");
  const stableFrameCountRef = useRef(0);
  const silenceTimerRef = useRef(null);
  const autoSpaceIntervalRef = useRef(null);
  const confidenceThresholdRef = useRef(confidenceThreshold);
  useEffect(() => {
    confidenceThresholdRef.current = confidenceThreshold;
  }, [confidenceThreshold]);

  // Persist mode preference
  useEffect(() => {
    localStorage.setItem("signbridge_mode", activeMode);
  }, [activeMode]);

  // Persist confidence threshold
  const handleUpdateThreshold = (val) => {
    setConfidenceThreshold(val);
    localStorage.setItem("signbridge_threshold", String(val));
    setAnnouncement(`Detection threshold updated to ${val}%`);
  };

  const handleUpdateSpeechRate = (val) => {
    setSpeechRate(val);
    localStorage.setItem("signbridge_speech_rate", String(val));
  };

  const handleResetDefaults = () => {
    handleUpdateThreshold(75);
    handleUpdateSpeechRate(1.0);
    setAnnouncement("Settings reset to default values");
  };

  const announce = (msg) => {
    setAnnouncement(msg);
  };

  const handleSelectMode = useCallback((mode) => {
    setActiveMode((prev) => {
      if (prev !== mode) {
        setIsModelLoaded(false);
        return mode;
      }
      return prev;
    });
  }, []);

  // Load Neural Network Model (A–Z or 1–9)
  useEffect(() => {
    let isMounted = true;
    const modelUrl =
      activeMode === "alphabets"
        ? "/model/isl_alphabets_model.json"
        : "/model/isl_digits_model.json";

    fetch(modelUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          modelRef.current = data;
          setIsModelLoaded(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load ISL model:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [activeMode]);

  // Web Speech API Voice Output
  const speakText = useCallback(
    (textToSpeak, label = "") => {
      if (
        !isVoiceOutputEnabledRef.current ||
        !("speechSynthesis" in window) ||
        !textToSpeak
      )
        return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speechRate;
      utterance.lang = "en-IN";

      utterance.onend = () => {
        setTimeout(() => setSpokenAudioStatus(""), 2500);
      };

      window.speechSynthesis.speak(utterance);
      setSpokenAudioStatus(label || `Spoke: "${textToSpeak}"`);
    },
    [speechRate],
  );

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpokenAudioStatus("");
  }, []);

  const toggleVoiceOutput = () => {
    setIsVoiceOutputEnabled((prev) => {
      const next = !prev;
      isVoiceOutputEnabledRef.current = next;
      if (!next) {
        stopSpeaking();
      }
      announce(next ? "Voice output enabled" : "Voice output muted");
      return next;
    });
  };

  // Neural Network Forward Pass (< 0.1ms)
  const classifyISLSign = useCallback((multiLandmarks) => {
    if (!modelRef.current || !multiLandmarks || multiLandmarks.length === 0)
      return null;

    const features = [];
    for (let h = 0; h < 2; h++) {
      if (h < multiLandmarks.length) {
        const lm = multiLandmarks[h];
        const wrist = lm[0];
        const mcp = lm[9];
        const dx = wrist.x - mcp.x;
        const dy = wrist.y - mcp.y;
        let scale = Math.hypot(dx, dy);
        if (scale === 0) scale = 1.0;

        for (let i = 0; i < 21; i++) {
          features.push((lm[i].x - wrist.x) / scale);
          features.push((lm[i].y - wrist.y) / scale);
          features.push(((lm[i].z || 0) - (wrist.z || 0)) / scale);
        }
      } else {
        for (let i = 0; i < 63; i++) {
          features.push(0);
        }
      }
    }

    let current = features;
    for (const layer of modelRef.current.layers) {
      const weights = layer.weights;
      const bias = layer.bias;
      const inDim = current.length;
      const outDim = bias.length;
      const next = new Float32Array(outDim);

      for (let j = 0; j < outDim; j++) {
        let sum = bias[j];
        for (let i = 0; i < inDim; i++) {
          sum += current[i] * weights[i][j];
        }
        if (layer.activation === "relu") {
          next[j] = sum > 0 ? sum : 0;
        } else {
          next[j] = sum;
        }
      }

      if (layer.activation === "softmax") {
        let maxVal = -Infinity;
        for (let j = 0; j < outDim; j++) {
          if (next[j] > maxVal) maxVal = next[j];
        }
        let sumExp = 0;
        for (let j = 0; j < outDim; j++) {
          next[j] = Math.exp(next[j] - maxVal);
          sumExp += next[j];
        }
        for (let j = 0; j < outDim; j++) {
          next[j] /= sumExp;
        }
      }
      current = next;
    }

    let maxIdx = 0;
    let maxProb = current[0];
    for (let j = 1; j < current.length; j++) {
      if (current[j] > maxProb) {
        maxProb = current[j];
        maxIdx = j;
      }
    }

    const confPct = Math.round(maxProb * 100);
    if (confPct < confidenceThresholdRef.current) return null;

    return {
      sign: modelRef.current.classes[maxIdx],
      conf: confPct,
    };
  }, []);

  // Append a character to the transcript
  const commitCharacterToTranscript = useCallback(
    (char) => {
      setTranscript((prev) => {
        setTranscriptHistory((hist) => [...hist.slice(-20), prev]);
        return prev + char;
      });

      setLastAddedLetter(char);
      setTimeout(() => setLastAddedLetter(""), 1500);

      announce(`Letter ${char} added`);

      // Real-time voice speech
      speakText(char, `Spoke "${char}"`);
    },
    [speakText],
  );

  // Auto-Space Timer: 1.5s pause without signing adds a space
  const resetAutoSpaceCountdown = useCallback(() => {
    clearInterval(autoSpaceIntervalRef.current);
    clearTimeout(silenceTimerRef.current);
    setAutoSpaceProgress(0);

    const startTime = Date.now();
    const duration = 1500;

    autoSpaceIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setAutoSpaceProgress(progress);
    }, 100);

    silenceTimerRef.current = setTimeout(() => {
      clearInterval(autoSpaceIntervalRef.current);
      setAutoSpaceProgress(0);

      setTranscript((prev) => {
        if (prev.length > 0 && !prev.endsWith(" ")) {
          setTranscriptHistory((hist) => [...hist.slice(-20), prev]);
          announce("Space added");
          return prev + " ";
        }
        return prev;
      });

      lastCommittedSignRef.current = "";
    }, duration);
  }, []);

  const handleAddSpace = useCallback(() => {
    setTranscript((prev) => {
      if (!prev.endsWith(" ")) {
        setTranscriptHistory((hist) => [...hist.slice(-20), prev]);
        setAnnouncement("Space added");
        return prev + " ";
      }
      return prev;
    });
  }, []);

  const handleBackspace = () => {
    setTranscript((prev) => {
      if (prev.length > 0) {
        setTranscriptHistory((hist) => [...hist.slice(-20), prev]);
        const next = prev.slice(0, -1);
        announce("Character deleted");
        return next;
      }
      return prev;
    });
  };

  const handleUndo = () => {
    if (transcriptHistory.length > 0) {
      const lastState = transcriptHistory[transcriptHistory.length - 1];
      setTranscriptHistory((hist) => hist.slice(0, -1));
      setTranscript(lastState);
      announce("Undo applied");
    }
  };

  const handleClearTranscript = () => {
    if (!transcript) return;
    setTranscriptHistory((hist) => [...hist.slice(-20), transcript]);
    setTranscript("");
    stopSpeaking();
    lastCommittedSignRef.current = "";
    announce("Transcript cleared");
  };

  const handleCopyTranscript = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    announce("Sentence copied to clipboard");
  };

  const handleSpeakSentence = () => {
    if (!transcript) return;
    speakText(transcript, `Speaking sentence: "${transcript}"`);
  };

  // Start MediaPipe Hand Detection
  const startMediaPipe = useCallback(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    const canvasCtx = canvasElement.getContext("2d");

    const hands = new window.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
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
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height,
      );

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
          window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, {
            color: "#2563eb",
            lineWidth: 2.2,
          });
          window.drawLandmarks(canvasCtx, landmarks, {
            color: "#14b8a6",
            lineWidth: 1,
            radius: 3.5,
          });
        }

        const result = classifyISLSign(results.multiHandLandmarks);
        if (result) {
          setCurrentLetter(result.sign);
          setConfidence(result.conf);

          clearInterval(autoSpaceIntervalRef.current);
          clearTimeout(silenceTimerRef.current);
          setAutoSpaceProgress(0);

          if (result.sign === lastDetectedSignRef.current) {
            stableFrameCountRef.current += 1;
            if (stableFrameCountRef.current === 9) {
              if (result.sign !== lastCommittedSignRef.current) {
                commitCharacterToTranscript(result.sign);
                lastCommittedSignRef.current = result.sign;
              }
            }
          } else {
            lastDetectedSignRef.current = result.sign;
            stableFrameCountRef.current = 1;
          }
        } else {
          setCurrentLetter("-");
          setConfidence(0);
          lastDetectedSignRef.current = "";
          stableFrameCountRef.current = 0;
          resetAutoSpaceCountdown();
        }
      } else {
        setCurrentLetter("-");
        setConfidence(0);
        lastDetectedSignRef.current = "";
        stableFrameCountRef.current = 0;
        resetAutoSpaceCountdown();
      }
      canvasCtx.restore();
    });

    if (typeof window.Camera !== "undefined") {
      const camera = new window.Camera(videoElement, {
        onFrame: async () => {
          await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480,
        facingMode: cameraFacingMode,
      });
      camera.start();
      cameraInstance.current = camera;
    }
  }, [
    cameraFacingMode,
    classifyISLSign,
    commitCharacterToTranscript,
    resetAutoSpaceCountdown,
  ]);

  // Toggle Camera
  const toggleCamera = useCallback(() => {
    if (isCameraActive || isCalibrating) {
      if (cameraInstance.current) cameraInstance.current.stop();
      stopSpeaking();
      setIsCameraActive(false);
      setIsCalibrating(false);
      setDownloadProgress(0);
      setDownloadStageText("Camera ready");
      setCurrentLetter("-");
      setConfidence(0);
      lastDetectedSignRef.current = "";
      lastCommittedSignRef.current = "";
      stableFrameCountRef.current = 0;
      setAnnouncement("Camera disabled");
    } else {
      setIsCalibrating(true);
      setDownloadProgress(15);
      setDownloadStageText("Initializing camera stream...");

      let step = 15;
      const interval = setInterval(() => {
        step += 25;
        if (step >= 100) {
          clearInterval(interval);
          setDownloadProgress(100);
          setDownloadStageText("Vision tracking active");
          setTimeout(() => {
            setIsCalibrating(false);
            setIsCameraActive(true);
            startMediaPipe();
            setAnnouncement("Camera connected and live");
          }, 250);
        } else {
          setDownloadProgress(step);
          if (step < 60) {
            setDownloadStageText("Calibrating landmark sensors...");
          } else {
            setDownloadStageText("Starting 60 FPS video capture...");
          }
        }
      }, 100);
    }
  }, [isCameraActive, isCalibrating, startMediaPipe, stopSpeaking]);

  const flipCamera = () => {
    const nextMode = cameraFacingMode === "user" ? "environment" : "user";
    setCameraFacingMode(nextMode);
    setAnnouncement(
      `Switched to ${nextMode === "user" ? "front" : "rear"} camera`,
    );

    if (isCameraActive && cameraInstance.current) {
      cameraInstance.current.stop();
      startMediaPipe();
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (e.key === "a" || e.key === "A") {
        handleSelectMode("alphabets");
        setAnnouncement("Switched to Alphabet Mode");
      } else if (e.key === "n" || e.key === "N") {
        handleSelectMode("digits");
        setAnnouncement("Switched to Number Mode");
      } else if (e.key === "c" || e.key === "C") {
        toggleCamera();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        handleAddSpace();
      } else if (e.key === "?") {
        setIsOnboardingOpen((o) => !o);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCamera, handleAddSpace, handleSelectMode]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-teal-soft selection:text-teal-dark">
      {/* Screen Reader Live Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Top Navbar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 pb-24 sm:pb-12">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
          {/* 1. LANDING PAGE / HOME */}
          {activeTab === "home" && (
            <LandingPage onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {/* 2. UNIFIED SIGN TO TEXT & SIGN TO SPEECH STUDIO */}
          {activeTab === "studio" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface border border-border rounded-xl p-3 px-4 shadow-2xs">
                <ModeSelector
                  activeMode={activeMode}
                  onSelectMode={(mode) => {
                    handleSelectMode(mode);
                    setCurrentLetter("-");
                    setConfidence(0);
                    lastCommittedSignRef.current = "";
                  }}
                />

                <div className="flex items-center gap-3 text-xs text-secondary font-medium">
                  <span className="hidden sm:inline">
                    Status:{" "}
                    <strong className="text-teal font-semibold">
                      {isModelLoaded ? "Model Ready" : "Loading..."}
                    </strong>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span>
                    Output:{" "}
                    <strong className="text-foreground">
                      Text &amp; Voice Enabled
                    </strong>
                  </span>
                </div>
              </div>

              {/* Two-Column Responsive Detection Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 sm:gap-5">
                {/* Left: Camera Viewport Panel */}
                <CameraPanel
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  isCameraActive={isCameraActive}
                  isCalibrating={isCalibrating}
                  downloadProgress={downloadProgress}
                  downloadStageText={downloadStageText}
                  onToggleCamera={toggleCamera}
                  onFlipCamera={flipCamera}
                  cameraFacingMode={cameraFacingMode}
                  currentLetter={currentLetter}
                  confidence={confidence}
                  confidenceThreshold={confidenceThreshold}
                />

                {/* Right: Unified Sign to Text & Speech Output Panel */}
                <TranscriptPanel
                  currentLetter={currentLetter}
                  confidence={confidence}
                  confidenceThreshold={confidenceThreshold}
                  transcript={transcript}
                  onCopyTranscript={handleCopyTranscript}
                  onSpeakSentence={handleSpeakSentence}
                  onStopSpeaking={stopSpeaking}
                  onBackspace={handleBackspace}
                  onUndo={handleUndo}
                  onClearTranscript={handleClearTranscript}
                  onAddSpace={handleAddSpace}
                  isVoiceOutputEnabled={isVoiceOutputEnabled}
                  onToggleVoiceOutput={toggleVoiceOutput}
                  spokenAudioStatus={spokenAudioStatus}
                  lastAddedLetter={lastAddedLetter}
                  autoSpaceProgress={autoSpaceProgress}
                  isCameraActive={isCameraActive}
                  activeMode={activeMode}
                  canUndo={transcriptHistory.length > 0}
                  speechRate={speechRate}
                  onChangeSpeechRate={handleUpdateSpeechRate}
                  speakText={speakText}
                />
              </div>
            </div>
          )}

          {/* 3. SPEECH TO SIGN (Two-Way Communication Preview) */}
          {activeTab === "two-way" && <SpeechToSignPanel />}
        </div>
      </main>

      {/* Slide-over Reference Guide Drawer */}
      <ReferenceGuideDrawer
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentLetter={currentLetter}
        onPracticeSign={() => {
          setIsGuideOpen(false);
          setActiveTab("studio");
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        confidenceThreshold={confidenceThreshold}
        onChangeConfidenceThreshold={handleUpdateThreshold}
        speechRate={speechRate}
        onChangeSpeechRate={handleUpdateSpeechRate}
        onResetDefaults={handleResetDefaults}
      />

      {/* How SignBridge Works Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Floating Action Controls (Guide, Help, Settings - moves with screen at bottom right) */}
      <FloatingActions
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />
    </div>
  );
}
