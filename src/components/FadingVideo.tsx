import { useEffect, useRef, useState } from 'react';

interface FadingVideoProps {
  src: string | string[];
  className?: string;
  style?: React.CSSProperties;
}

export default function FadingVideo({ src, className, style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sources = Array.isArray(src) ? src : [src];
  const currentSrc = sources[currentIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fadeOutFrame: number;
    let fadeInFrame: number;
    let isFadingOut = false;
    let isFadingIn = false;

    const handleLoadedData = () => {
      // Fade in over 500ms
      const startTime = performance.now();
      isFadingIn = true;
      isFadingOut = false;
      
      const animateFadeIn = (currentTime: number) => {
        if (!isFadingIn) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / 500, 1);
        setOpacity(progress);
        
        if (progress < 1) {
          fadeInFrame = requestAnimationFrame(animateFadeIn);
        }
      };
      fadeInFrame = requestAnimationFrame(animateFadeIn);
    };

    const handleTimeUpdate = () => {
      if (video.duration > 0 && video.duration - video.currentTime <= 0.55 && !isFadingOut) {
        // Start fading out over 550ms
        isFadingOut = true;
        isFadingIn = false;
        const startTime = performance.now();
        
        const animateFadeOut = (currentTime: number) => {
          if (!isFadingOut) return;
          const elapsed = currentTime - startTime;
          const progress = Math.max(1 - (elapsed / 550), 0);
          setOpacity(progress);
          
          if (progress > 0) {
            fadeOutFrame = requestAnimationFrame(animateFadeOut);
          }
        };
        fadeOutFrame = requestAnimationFrame(animateFadeOut);
      }
    };

    const handleEnded = () => {
      isFadingOut = false;
      if (sources.length === 1) {
        video.currentTime = 0;
        video.play().catch(() => {});
        handleLoadedData(); // Trigger fade in again
      } else {
        setCurrentIndex((prev) => (prev + 1) % sources.length);
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Initial load check in case it's already loaded
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(fadeOutFrame);
      cancelAnimationFrame(fadeInFrame);
    };
  }, [currentSrc, sources.length]);

  return (
    <video
      ref={videoRef}
      src={currentSrc}
      className={className}
      style={{ ...style, opacity, transition: 'opacity 0.1s linear' }}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}
