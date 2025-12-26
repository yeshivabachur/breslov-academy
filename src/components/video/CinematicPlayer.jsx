import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Settings, 
  SkipBack, SkipForward, Subtitles, BookmarkPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicPlayer({ 
  src, 
  onTimeUpdate, 
  onEnded, 
  initialTime = 0,
  hebrewTerms = [],
  transcript = []
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [hoveredTerm, setHoveredTerm] = useState(null);
  const [isImmersive, setIsImmersive] = useState(false);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  // Auto-dim interface when playing (MasterClass style)
  useEffect(() => {
    if (playing && containerRef.current) {
      containerRef.current.classList.add('immersive-mode');
      setIsImmersive(true);
    } else {
      containerRef.current?.classList.remove('immersive-mode');
      setIsImmersive(false);
    }
  }, [playing]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onTimeUpdate?.(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  // Get current transcript line and extract Hebrew terms
  const activeTranscriptLine = transcript.find((line, idx) => {
    const nextLine = transcript[idx + 1];
    return currentTime >= line.start && (!nextLine || currentTime < nextLine.start);
  });

  const extractHebrewTerms = (text) => {
    if (!text) return [];
    const terms = [];
    hebrewTerms.forEach(term => {
      if (text.includes(term.word)) {
        terms.push(term);
      }
    });
    return terms;
  };

  const currentTerms = extractHebrewTerms(activeTranscriptLine?.text);

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden transition-all duration-700"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <style>{`
        .immersive-mode {
          box-shadow: 0 0 80px rgba(0,0,0,0.9);
        }
      `}</style>

      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setPlaying(false);
          onEnded?.();
        }}
        onClick={togglePlay}
      />

      {/* Cinematic Vignette Overlay */}
      {isImmersive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
        </div>
      )}

      {/* Center Play Button (MasterClass Style) */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-24 h-24 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl"
            >
              <Play className="w-12 h-12 text-slate-900 ml-2" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hebrew Term Tooltips (Hover Translation) */}
      {captionsEnabled && activeTranscriptLine && currentTerms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 max-w-2xl"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
            <p className="text-white text-xl font-serif leading-relaxed text-center mb-3">
              {activeTranscriptLine.text}
            </p>
            {currentTerms.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center pt-3 border-t border-white/10">
                {currentTerms.map((term, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setHoveredTerm(term)}
                    onMouseLeave={() => setHoveredTerm(null)}
                    className="relative px-3 py-1 bg-amber-600/20 hover:bg-amber-600/40 rounded-lg transition-all"
                  >
                    <span className="text-amber-300 font-bold text-sm">{term.word}</span>
                    {hoveredTerm?.word === term.word && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap"
                      >
                        <div className="bg-white rounded-lg px-4 py-2 shadow-xl">
                          <div className="text-slate-900 font-bold text-sm">{term.translation}</div>
                          {term.explanation && (
                            <div className="text-slate-600 text-xs mt-1">{term.explanation}</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Premium Controls (Auto-hide) */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 pt-32"
          >
            {/* Progress Bar */}
            <div className="mb-6">
              <Slider
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/60 mt-2 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Playback Controls */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 hover:scale-110 transition-all rounded-full w-12 h-12"
                >
                  {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skip(-10)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skip(10)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Slider
                    value={[muted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>
              </div>

              {/* Advanced Controls */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>

                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full right-0 mb-3 bg-slate-900/95 backdrop-blur-xl rounded-2xl p-3 min-w-[220px] border border-white/10"
                    >
                      <div className="text-white text-xs font-bold mb-3 px-2 uppercase tracking-wider">Playback Speed</div>
                      <div className="space-y-1">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                          <button
                            key={rate}
                            onClick={() => changePlaybackRate(rate)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-serif transition-all ${
                              playbackRate === rate
                                ? 'bg-blue-600 text-white font-bold'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {rate}x {rate === 1 && '(Normal)'}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCaptionsEnabled(!captionsEnabled)}
                  className={`${captionsEnabled ? 'text-white bg-white/20' : 'text-white/70'} hover:text-white hover:bg-white/10`}
                >
                  <Subtitles className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .fade-out {
          animation: fadeOut 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}