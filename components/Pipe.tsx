import React from 'react';
import { PIPE_WIDTH, PIPE_GAP, GAME_HEIGHT, PIPE_IMAGE } from '../constants';
import { PipeData } from '../types';

interface PipeProps {
  pipeData: PipeData;
}

export const Pipe: React.FC<PipeProps> = ({ pipeData }) => {
  const { x, gapTop } = pipeData;
  const bottomPipeTop = gapTop + PIPE_GAP;
  const bottomPipeHeight = GAME_HEIGHT - bottomPipeTop;

  // Each TV9 logo segment height (adjust based on desired segment size)
  const segmentHeight = 40;

  // Calculate how many segments we need for each pipe
  const topSegments = Math.ceil(gapTop / segmentHeight);
  const bottomSegments = Math.ceil(bottomPipeHeight / segmentHeight);

  return (
    <>
      {/* Top Pipe */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: 0,
          width: PIPE_WIDTH,
          height: gapTop,
          overflow: 'hidden',
          zIndex: 10,
          borderBottom: '4px solid #1e3a8a',
        }}
        className="shadow-md"
      >
        {Array.from({ length: topSegments }, (_, i) => (
          <img
            key={`top-${i}`}
            src={PIPE_IMAGE}
            alt="TV9 Logo"
            style={{
              position: 'absolute',
              bottom: i * segmentHeight,
              left: 0,
              width: PIPE_WIDTH,
              height: segmentHeight,
              objectFit: 'cover',
            }}
          />
        ))}
      </div>

      {/* Bottom Pipe */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: bottomPipeTop,
          width: PIPE_WIDTH,
          height: bottomPipeHeight,
          overflow: 'hidden',
          zIndex: 10,
          borderTop: '4px solid #1e3a8a',
        }}
        className="shadow-md"
      >
        {Array.from({ length: bottomSegments }, (_, i) => (
          <img
            key={`bottom-${i}`}
            src={PIPE_IMAGE}
            alt="TV9 Logo"
            style={{
              position: 'absolute',
              top: i * segmentHeight,
              left: 0,
              width: PIPE_WIDTH,
              height: segmentHeight,
              objectFit: 'cover',
            }}
          />
        ))}
      </div>
    </>
  );
};