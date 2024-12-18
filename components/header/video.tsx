'use client';

import ReactPlayer from 'react-player';
import { AnimateElement } from '../ui/animated-wrapper';
import { useState, useRef, useEffect } from 'react';

export default function Video() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    playerRef.current?.seekTo(0);
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer()?.load();
    }
  }, []);

  return (
    <div className="relative w-full mt-20">
      <div className="relative z-20 mx-auto max-w-[1000px] px-4">
        <AnimateElement type="slideUp" delay={0.2} duration={0.6}>
          <div className="aspect-video w-full">
            <ReactPlayer
              ref={playerRef}
              url="https://www.youtube.com/watch?v=A9mxz0JaY2o"
              width="100%"
              height="100%"
              playing={isPlaying}
              controls={true}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0
                  }
                }
              }}
            />
          </div>
        </AnimateElement>
      </div>
    </div>
  );
}