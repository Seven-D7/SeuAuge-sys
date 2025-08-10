import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { VideoStreamData, VideoQuality } from "../../services/googleCloud";
import useProgress from "../../hooks/useProgress";

interface VideoPlayerProps {
  streamData: VideoStreamData;
  autoPlay?: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamData,
  autoPlay = false,
  onProgress,
  onComplete,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Validar dados do stream
  useEffect(() => {
    if (!streamData || !streamData.qualities || streamData.qualities.length === 0) {
      setError("Dados de vídeo inválidos");
      return;
    }

    // Verificar se as URLs são válidas
    const hasValidUrls = streamData.qualities.every(quality =>
      quality.url && quality.url.startsWith('http')
    );

    if (!hasValidUrls) {
      setError("URLs de vídeo inválidas");
      return;
    }


  }, [streamData]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>(
    streamData.qualities[0],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Auto-hide controls
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      setShowControls(true);
      timeoutId = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    if (isPlaying) {
      resetTimeout();
    } else {
      setShowControls(true);
    }

    return () => clearTimeout(timeoutId);
  }, [isPlaying]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };
    const handleCanPlay = () => {
      setIsLoading(false);
    };
    const handleError = (e: Event) => {
      const videoError = (e.target as HTMLVideoElement)?.error;
      let errorMessage = "Erro ao carregar o vídeo";

      if (videoError) {
        switch (videoError.code) {
          case videoError.MEDIA_ERR_ABORTED:
            errorMessage = "Reprodução foi cancelada";
            break;
          case videoError.MEDIA_ERR_NETWORK:
            errorMessage = "Erro de rede ao carregar o vídeo";
            break;
          case videoError.MEDIA_ERR_DECODE:
            errorMessage = "Erro ao decodificar o vídeo";
            break;
          case videoError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Formato de vídeo não suportado";
            break;
          default:
            errorMessage = "Erro desconhecido ao carregar o vídeo";
        }
      }

      setError(errorMessage);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (video.duration && !isNaN(video.duration)) {
        setCurrentTime(video.currentTime);
        if (onProgress) {
          onProgress((video.currentTime / video.duration) * 100);
        }
      }
    };

    const handleDurationChange = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(
      0,
      Math.min(duration, video.currentTime + seconds),
    );
  };

  const changeQuality = (quality: VideoQuality) => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    setSelectedQuality(quality);
    video.src = quality.url;
    video.currentTime = currentTime;

    if (wasPlaying) {
      video.play();
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const retryVideo = () => {
    setError(null);
    setIsLoading(true);
    const video = videoRef.current;
    if (video) {
      video.load();
    }
  };

  if (error) {
    return (
      <div
        className={`relative bg-slate-900 rounded-lg overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-center h-64 text-white">
          <div className="text-center max-w-md px-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">
              Erro ao carregar vídeo
            </h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <button
              onClick={retryVideo}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={selectedQuality.url}
        poster={streamData.thumbnails[0]}
        autoPlay={autoPlay}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
        className="w-full h-full object-cover"
        onClick={togglePlay}

      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Center Play Button */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-black ml-0.5" />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-4">
          {/* Progress Bar */}
          <div className="mb-2 sm:mb-4">
            <div
              className="w-full h-1 sm:h-1.5 bg-white bg-opacity-30 rounded-full cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white">
            {/* Left Controls */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button
                onClick={togglePlay}
                className="hover:text-primary transition-colors p-1"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-6 sm:h-6" />
                ) : (
                  <Play className="w-4 h-4 sm:w-6 sm:h-6" />
                )}
              </button>

              <button
                onClick={() => skip(-10)}
                className="hover:text-primary transition-colors p-1 hidden sm:block"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => skip(10)}
                className="hover:text-primary transition-colors p-1 hidden sm:block"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={toggleMute}
                  className="hover:text-primary transition-colors p-1"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-12 sm:w-20 h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="hidden sm:block">
                <span className="text-xs sm:text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="sm:hidden">
                <span className="text-xs">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Quality Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="hover:text-primary transition-colors p-1"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {showSettings && (
                  <div className="absolute bottom-8 right-0 bg-black bg-opacity-95 rounded-lg p-3 min-w-24 sm:min-w-32 z-10">
                    <h4 className="text-xs sm:text-sm font-semibold mb-2">Qualidade</h4>
                    {streamData.qualities.map((quality) => (
                      <button
                        key={quality.resolution}
                        onClick={() => changeQuality(quality)}
                        className={`block w-full text-left px-2 py-1 text-xs sm:text-sm rounded hover:bg-white hover:bg-opacity-20 ${
                          selectedQuality.resolution === quality.resolution
                            ? "text-primary"
                            : "text-white"
                        }`}
                      >
                        {quality.resolution}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleFullscreen}
                className="hover:text-primary transition-colors p-1"
              >
                <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Overlay */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-white max-w-[calc(100%-4rem)] sm:max-w-md">
        <h3 className="text-sm sm:text-lg font-semibold truncate">{streamData.metadata.title}</h3>
        <p className="text-xs sm:text-sm text-white text-opacity-80 truncate">
          {streamData.metadata.instructor}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
