"use client";

import * as React from "react";
import { Play, Pause, Volume2, VolumeX, FastForward, Headphones, ShieldCheck } from "lucide-react";
import { MaterialWithDetails } from "@/types";
import { formatDuration } from "@/lib/utils/cn";

export interface AudioPlayerProps {
  material: MaterialWithDetails;
  signedUrl?: string;
  watermarkText: string;
}

export function AudioPlayer({ material, signedUrl, watermarkText }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(material.file?.duration_seconds || 720);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0);
  const [isMuted, setIsMuted] = React.useState(false);

  // Simulated audio progress for preview
  React.useEffect(() => {
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
  }, [isPlaying, playbackSpeed, duration]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleSpeedChange = (speed: number) => setPlaybackSpeed(speed);

  // Simulated wave bars
  const waveBars = [30, 45, 60, 80, 50, 40, 75, 90, 65, 40, 55, 85, 95, 70, 45, 60, 80, 50, 65, 85, 40, 70, 90, 60, 35, 50, 75, 90, 55, 45];

  return (
    <div className="flex flex-col h-full bg-surface-950 rounded-lg overflow-hidden border border-surface-800 p-3 sm:p-8 justify-center items-center secure-protected-area">
      {/* Audio Visualizer Stage */}
      <div className="w-full max-w-xl bg-surface-900/90 rounded-2xl border border-surface-800 p-4 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-surface-800/80">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-950/60 border border-indigo-700/40 rounded-xl text-indigo-400 shrink-0">
              <Headphones className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                PABIR PAUL&apos;S AUDIO BRIEFING • {material.access_level.toUpperCase()}
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-white mt-0.5 truncate max-w-[200px] sm:max-w-sm">
                {material.title}
              </h3>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40 font-mono shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>PROTECTED STREAM</span>
          </div>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="my-6 sm:my-8 flex items-center justify-center gap-1 sm:gap-1.5 h-14 sm:h-16 px-3 bg-surface-950/60 rounded-xl border border-surface-800">
          {waveBars.map((height, idx) => {
            const progressRatio = currentTime / duration;
            const barRatio = idx / waveBars.length;
            const isPassed = barRatio <= progressRatio;
            return (
              <div
                key={idx}
                className={`w-1.5 sm:w-2 rounded-full transition-all duration-300 ${
                  isPassed ? "bg-indigo-500 shadow-sm shadow-indigo-500/30" : "bg-surface-800"
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
          <div className="relative w-full bg-surface-800 h-2.5 rounded-full overflow-hidden cursor-pointer">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-surface-400">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-800/60">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-surface-950 p-1 rounded-lg border border-surface-800">
            {[1.0, 1.25, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-1 text-xs rounded font-mono font-medium transition-colors active:scale-95 ${
                  playbackSpeed === speed
                    ? "bg-indigo-600 text-white"
                    : "text-surface-400 hover:text-surface-200"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Center Play Button (Thumb-Friendly Target) */}
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-transform active:scale-90"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-0.5" />}
          </button>

          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-lg bg-surface-950 border border-surface-800 text-surface-400 hover:text-white active:scale-95"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
