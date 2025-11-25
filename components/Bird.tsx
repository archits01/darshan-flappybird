import React from 'react';
import { BIRD_SIZE, BIRD_IMAGE } from '../constants';

interface BirdProps {
  y: number;
  velocity: number;
}

export const Bird: React.FC<BirdProps> = ({ y, velocity }) => {
  // Calculate rotation based on velocity
  const rotation = Math.min(Math.max(velocity * 3, -25), 90);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50px', // Bird X is fixed
        top: y,
        width: BIRD_SIZE,
        height: BIRD_SIZE,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s',
        zIndex: 20,
      }}
    >
      <img
        src={BIRD_IMAGE}
        alt="Player Face"
        className="w-full h-full object-cover"
        style={{
            // Fallback if image fails to load
            backgroundColor: '#fca5a5' 
        }}
      />
    </div>
  );
};