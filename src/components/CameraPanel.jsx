import {
  Camera,
  CameraOff,
  Play,
  Square,
  RefreshCw,
  Sun,
  Hand,
  Smartphone,
} from "lucide-react";

export default function CameraPanel({
  videoRef,
  canvasRef,
  isCameraActive,
  isCalibrating,
  downloadProgress,
  downloadStageText,
  onToggleCamera,
  onFlipCamera,
  cameraFacingMode,
  currentLetter,
  confidence,
}) {
  // Request landscape orientation for phone devices
  const handleLandscapeRequest = async () => {
    try {
      const docEl = document.documentElement;
      if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
      }
      if (window.screen?.orientation?.lock) {
        await window.screen.orientation.lock("landscape");
      }
    } catch {
      // Silently fall back if orientation lock not permitted by browser
    }
  };

  const handleStartCameraWithLandscape = () => {
    // Attempt landscape on phone
    if ("ontouchstart" in window || window.innerWidth < 768) {
      handleLandscapeRequest();
    }
    onToggleCamera();
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs">
      {/* Top Header of Camera Card */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Live Vision Sensor
            </h2>
            <p className="text-[11px] text-secondary">
              MediaPipe Dual-Hand 3D Landmark Tracking
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        {isCameraActive ? (
          <span className="flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-0.5 font-mono text-xs font-bold text-white shadow-xs">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
            LIVE
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 border border-slate-200">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
            Offline
          </span>
        )}
      </div>

      {/* Viewport Container — Elongated spacious camera monitor */}
      <div className="relative flex w-full h-[360px] xs:h-[400px] sm:h-[460px] lg:h-[520px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-slate-950 shadow-inner">
        {/* Subtle recommended hand positioning guide frame overlay */}
        {isCameraActive && (
          <div className="pointer-events-none absolute inset-4 sm:inset-6 z-10 flex items-center justify-center">
            <div className="w-full h-full border-2 border-dashed border-teal/25 rounded-2xl flex items-center justify-center">
              <span className="text-[11px] font-medium text-teal/40 bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-xs">
                Keep hands inside this zone
              </span>
            </div>
          </div>
        )}

        {/* Hidden video element used by MediaPipe */}
        <video ref={videoRef} style={{ display: "none" }} playsInline muted />

        {/* Canvas showing video frame + landmark overlay */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="h-full w-full object-cover"
          style={{ display: isCameraActive ? "block" : "none" }}
        />

        {/* Floating detected sign badge inside camera frame when active */}
        {isCameraActive && currentLetter && currentLetter !== "-" && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-xl bg-slate-900/85 px-3 py-1.5 backdrop-blur-md border border-white/10 shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Detected
            </span>
            <span className="text-xl font-black text-teal">
              {currentLetter}
            </span>
            <span className="text-xs font-bold text-slate-300 font-mono">
              ({confidence}%)
            </span>
          </div>
        )}

        {/* Camera Standby Screen */}
        {!isCameraActive && (
          <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm">
            {isCalibrating ? (
              <div className="w-full">
                <div className="mb-2 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-300 font-medium">
                    {downloadStageText}
                  </span>
                  <span className="font-bold text-teal">
                    {downloadProgress}%
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="progress-sweep relative h-full rounded-full bg-teal transition-all duration-150"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Loading hand tracking vision runtime...
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
                  <CameraOff className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="mb-1 text-base font-bold text-white">
                  Camera is off
                </h3>
                <p className="mb-4 text-xs text-slate-400 leading-relaxed">
                  Enable your camera to begin detecting Indian Sign Language
                  gestures in real time.
                </p>
                <button
                  onClick={handleStartCameraWithLandscape}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Enable Camera</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Landscape Recommendation Pill when camera is active */}
      {isCameraActive && (
        <div className="sm:hidden mt-2.5 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-teal-soft border border-teal/20 text-teal-dark text-[11px] font-semibold">
          <Smartphone className="h-3.5 w-3.5 rotate-90 text-teal shrink-0" />
          <span>Rotate phone horizontally for full landscape tracking</span>
        </div>
      )}

      {/* Camera Controls Bar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Start / Stop Camera Button */}
        <button
          onClick={handleStartCameraWithLandscape}
          disabled={isCalibrating}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isCameraActive
              ? "bg-danger text-white hover:bg-danger-hover focus-visible:ring-danger"
              : "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary"
          }`}
          aria-label={isCameraActive ? "Stop camera" : "Start camera"}
        >
          {isCameraActive ? (
            <Square className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span>
            {isCalibrating
              ? "Starting Camera..."
              : isCameraActive
                ? "Stop Camera"
                : "Start Camera"}
          </span>
        </button>

        {/* Rotate to Landscape Button (Mobile/Tablet Friendly) */}
        <button
          onClick={handleLandscapeRequest}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5 text-xs sm:text-sm font-semibold text-secondary hover:text-foreground hover:bg-slate-50 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="Switch to full landscape orientation"
          aria-label="Rotate screen to landscape"
        >
          <Smartphone className="h-4 w-4 rotate-90 text-teal" />
          <span className="hidden xs:inline">Landscape</span>
        </button>

        {/* Camera Flip Button (Front vs Rear Camera) */}
        <button
          onClick={onFlipCamera}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5 text-xs sm:text-sm font-semibold text-secondary hover:text-foreground hover:bg-slate-50 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title={`Currently using ${cameraFacingMode === "user" ? "Front camera" : "Rear camera"}. Click to flip.`}
          aria-label="Flip camera between front and rear"
        >
          <RefreshCw className="h-4 w-4 text-primary" />
          <span className="hidden xs:inline">Flip</span>
        </button>
      </div>

      {/* Helpful Lighting & Hand Position Tips */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] text-secondary">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 p-2">
          <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>Use clear front lighting</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 p-2">
          <Hand className="h-3.5 w-3.5 text-teal shrink-0" />
          <span>Keep both hands visible</span>
        </div>
      </div>
    </div>
  );
}
