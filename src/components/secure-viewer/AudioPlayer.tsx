"use client";

import * as React from "react";
import { Play, Pause, Volume2, VolumeX, Headphones, ShieldCheck, Download, RefreshCw } from "lucide-react";
import { MaterialWithDetails } from "@/types";
import { formatDuration } from "@/lib/utils/cn";
import { downloadMaterialFile } from "@/lib/utils/download-helper";

export interface AudioPlayerProps {
  material: MaterialWithDetails;
  signedUrl?: string;
  watermarkText: string;
}

export function AudioPlayer({ material, signedUrl }: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(material.file?.duration_seconds || 600);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadMaterialFile(
        material.id,
        material.file?.original_filename || `${material.title}.mp3`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // If real audio file exists, control it via HTML5 Audio
  const isRealAudio = Boolean(signedUrl && (signedUrl.endsWith(".mp3") || signedUrl.endsWith(".wav") || signedUrl.endsWith(".m4a") || signedUrl.includes("/uploads/")));

  React.useEffect(() => {
    if (!isRealAudio) {
      // Simulated audio progress for demo files
      let interval: any;
      if (isPlaying) {
        interval = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              setIsPlaying(false);
              return 0;
            }
            return prev + 1 * playbackSpeed;
          });
        }, 1000);
      }
      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackSpeed, duration, isRealAudio]);

  const togglePlay = () => {
    if (isRealAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Wave bars for visualizer
  const waveBars = [30, 45, 60, 80, 50, 40, 75, 90, 65, 40, 55, 85, 95, 70, 45, 60, 80, 50, 65, 85, 40, 70, 90, 60, 35, 50, 75, 90, 55, 45];

  return (
    <div className="flex flex-col h-full bg-surface-950 rounded-lg overflow-hidden border border-surface-800 p-3 sm:p-8 justify-center items-center secure-protected-area">
      {/* Hidden real audio element */}
      {isRealAudio && signedUrl && (
        <audio
          ref={audioRef}
          src={signedUrl}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current && audioRef.current.duration) {
              setDuration(audioRef.current.duration);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* Audio Visualizer Stage */}
      <div className="w-full max-w-xl bg-surface-900/90 rounded-2xl border border-surface-800 p-4 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-surface-800/80">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-950/60 border border-indigo-700/40 rounded-xl text-indigo-400 shrink-0">
              <Headphones className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                PABIR PAUL&apos;S AUDIO CLASS • {material.access_level.toUpperCase()}
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-white mt-0.5 truncate max-w-[200px] sm:max-w-sm">
                {material.title}
              </h3>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40 font-mono shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>AUTHENTICATED STREAM</span>
          </div>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="my-6 sm:my-8 flex items-center justify-center gap-1 sm:gap-1.5 h-14 sm:h-16 px-3 bg-surface-950/60 rounded-xl border border-surface-800">
          {waveBars.map((height, idx) => {
            const progressRatio = currentTime / (duration || 1);
            const barRatio = idx / waveBars.length;
            const isPassed = barRatio <= progressRatio;
            return (
              <div
                key={idx}
                className={`w-1.5 sm:w-2 rounded-full transition-all duration-300 ${
                  isPassed ? "bg-orange-500 shadow-sm shadow-orange-500/30" : "bg-surface-800"
                } ${isPlaying ? "animate-pulse" : ""}`}
                style={{
                  height: isPlaying ? `${Math.min(100, Math.max(15, height + (Math.sin(idx + currentTime) * 20)))}%` : `${height}%`,
                }}
              />
            );
          })}
        </div>

        {/* Scrubber & Time */}
        <div className="space-y-2">
          <div
            onClick={handleSeek}
            className="relative w-full bg-surface-800 h-2.5 rounded-full overflow-hidden cursor-pointer"
          >
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-150"
              style={{ width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-surface-400">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-surface-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="p-2 text-surface-400 hover:text-white rounded-lg active:scale-95 transition-all"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Direct Download */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 text-surface-400 hover:text-orange-400 rounded-lg active:scale-95 transition-all disabled:opacity-50"
              title="Download Audio Class"
            >
              {isDownloading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-orange-400" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Main Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="h-12 w-12 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-surface-950 px-2 py-1 rounded-lg border border-surface-800 text-xs font-mono">
            {[1.0, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-1.5 py-0.5 rounded ${playbackSpeed === spd ? "bg-orange-500/20 text-orange-400 font-bold" : "text-surface-400 hover:text-surface-200"}`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
