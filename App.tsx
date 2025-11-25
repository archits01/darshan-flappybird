import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GRAVITY,
  JUMP_STRENGTH,
  PIPE_SPEED,
  PIPE_SPAWN_RATE,
  PIPE_WIDTH,
  PIPE_GAP,
  BIRD_SIZE,
  BIRD_IMAGE,
  JUMP_SOUND_1,
  JUMP_SOUND_2,
  CRASH_SOUND
} from './constants';
import { GameState, PipeData } from './types';
import { Bird } from './components/Bird';
import { Pipe } from './components/Pipe';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);
  const [useFirstSound, setUseFirstSound] = useState(true);

  // Refs for loop state to avoid closure staleness in the game loop
  const birdYRef = useRef(GAME_HEIGHT / 2);
  const pipesRef = useRef<PipeData[]>([]);
  const frameRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  
  // Audio refs
  const audio1Ref = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);
  const crashAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Game
  const resetGame = () => {
    setGameState(GameState.START);
    setScore(0);
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setUseFirstSound(true); // Reset to first sound
    
    birdYRef.current = GAME_HEIGHT / 2;
    pipesRef.current = [];
    scoreRef.current = 0;
    frameRef.current = 0;
  };

  const startGame = () => {
    resetGame();
    setGameState(GameState.PLAYING);
  };

  const handleCrash = useCallback(() => {
    // Play crash sound
    if (crashAudioRef.current) {
      crashAudioRef.current.currentTime = 0;
      crashAudioRef.current.play().catch(console.error);
    }
    
    // Set game over state
    setGameState(GameState.GAME_OVER);
  }, []);

  const jump = useCallback(() => {
    if (gameState === GameState.PLAYING) {
      setBirdVelocity(JUMP_STRENGTH);
      
      // Play alternating audio
      const audioToPlay = useFirstSound ? audio1Ref.current : audio2Ref.current;
      if (audioToPlay) {
        audioToPlay.currentTime = 0; // Reset to beginning
        audioToPlay.play().catch(console.error);
      }
      
      // Toggle which sound to play next
      setUseFirstSound(!useFirstSound);
    } else if (gameState === GameState.START || gameState === GameState.GAME_OVER) {
      if (gameState === GameState.GAME_OVER) {
         // Prevent accidental restarts immediately after death
      } else {
        startGame();
      }
    }
  }, [gameState, useFirstSound]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        jump();
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => {
        // Prevent default only if inside game area to allow scrolling elsewhere if needed
        // But for this full screen app, we usually prevent default
    };

    window.addEventListener('keydown', handleKeyDown);
    // window.addEventListener('touchstart', handleTouchStart); // Handled by div onClick
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [jump]);

  // Update high score on game over
  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
      if (score > highScore) setHighScore(score);
    }
  }, [gameState, score, highScore]);

  // Game Loop
  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const loop = () => {
      // 1. Update Physics
      setBirdVelocity((v) => v + GRAVITY);
      
      setBirdY((y) => {
        const newY = y + birdVelocity;
        birdYRef.current = newY;
        return newY;
      });

      // 2. Update Pipes
      setPipes((currentPipes) => {
        // Calculate dynamic speed based on score (increases every 5 points)
        const speedMultiplier = 1 + Math.floor(scoreRef.current / 5) * 0.3;
        const currentSpeed = PIPE_SPEED * speedMultiplier;
        
        let newPipes = currentPipes
          .map((pipe) => ({ ...pipe, x: pipe.x - currentSpeed }))
          .filter((pipe) => pipe.x + PIPE_WIDTH > -50);

        // Spawn new pipe (spawn rate also increases with speed)
        const currentSpawnRate = Math.max(60, PIPE_SPAWN_RATE - Math.floor(scoreRef.current / 3) * 5);
        if (frameRef.current % currentSpawnRate === 0) {
            // Minimum gap position from top (e.g. 50px)
            // Maximum gap position (Height - ground - gap size - 50px)
            const minGapTop = 50;
            const maxGapTop = GAME_HEIGHT - PIPE_GAP - 100; 
            const randomY = Math.floor(Math.random() * (maxGapTop - minGapTop + 1)) + minGapTop;
            
            newPipes.push({
                x: GAME_WIDTH,
                gapTop: randomY,
                passed: false
            });
        }
        
        pipesRef.current = newPipes;
        return newPipes;
      });

      // 3. Collision Detection
      const birdRect = {
        top: birdYRef.current + 4, // slight hitbox adjustment
        bottom: birdYRef.current + BIRD_SIZE - 4,
        left: 50 + 4,
        right: 50 + BIRD_SIZE - 4
      };

      // Ground/Ceiling Collision
      if (birdRect.bottom >= GAME_HEIGHT || birdRect.top <= 0) {
        handleCrash();
        return; 
      }

      // Pipe Collision
      pipesRef.current.forEach((pipe) => {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;

        // Check if bird is within pipe horizontal area
        if (birdRect.right > pipeLeft && birdRect.left < pipeRight) {
             // Check vertical collision (hitting top pipe OR hitting bottom pipe)
             if (birdRect.top < pipe.gapTop || birdRect.bottom > pipe.gapTop + PIPE_GAP) {
                 handleCrash();
             }
        }

        // Score update
        if (!pipe.passed && birdRect.left > pipeRight) {
            pipe.passed = true;
            setScore(s => s + 1);
            scoreRef.current += 1;
        }
      });

      frameRef.current++;
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, birdVelocity, handleCrash]);

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div 
        className="relative bg-sky-200 overflow-hidden shadow-2xl ring-8 ring-slate-800 rounded-xl"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={jump}
      >
        {/* Background Elements (Clouds) - Static for simplicity, could animate */}
        <div className="absolute top-10 left-10 text-white/40 text-6xl select-none">☁️</div>
        <div className="absolute top-40 left-60 text-white/30 text-8xl select-none">☁️</div>

        {/* Game World */}
        <Bird y={birdY} velocity={birdVelocity} />
        
        {pipes.map((pipe, i) => (
          <Pipe key={`pipe-${i}`} pipeData={pipe} />
        ))}

        {/* Score HUD */}
        <div className="absolute top-4 w-full text-center z-30 pointer-events-none">
             <span className="font-display text-5xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] stroke-black stroke-2">
                {score}
             </span>
        </div>

        {/* Start Screen */}
        {gameState === GameState.START && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-40 backdrop-blur-sm">
            <img 
                src={BIRD_IMAGE} 
                className="w-24 h-24 mb-4 animate-bounce"
                alt="Logo"
            />
            <h1 className="font-display text-5xl text-white mb-2 tracking-wide text-center drop-shadow-lg">TV9<br/>FLAPPY FACE</h1>
            <p className="text-white text-lg font-bold bg-red-600 px-4 py-1 rounded-full animate-pulse">Tap or Space to Start</p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === GameState.GAME_OVER && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-6 text-center">
            <h2 className="font-display text-5xl text-red-500 mb-2 drop-shadow-md">GAME OVER</h2>
            
            <div className="bg-white text-slate-900 p-6 rounded-lg w-full max-w-xs shadow-xl mb-6 relative overflow-hidden">
                {/* Decoration: TV9 Banner */}
                <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
                
                <div className="flex justify-between items-end mb-4 border-b pb-2">
                    <div className="text-left">
                        <p className="text-xs font-bold text-gray-500 uppercase">Score</p>
                        <p className="text-4xl font-black">{score}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-gray-500 uppercase">Best</p>
                        <p className="text-4xl font-black text-amber-500">{highScore}</p>
                    </div>
                </div>

            </div>

            <button 
                onClick={resetGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 text-xl uppercase tracking-wider"
            >
              Replay
            </button>
          </div>
        )}
        
        {/* Footer / Ground */}
        <div className="absolute bottom-0 w-full h-[20px] bg-amber-700 border-t-4 border-amber-800 z-20"></div>
        
      </div>

      {/* Audio elements */}
      <audio ref={audio1Ref} preload="auto">
        <source src={JUMP_SOUND_1} type="audio/mpeg" />
      </audio>
      <audio ref={audio2Ref} preload="auto">
        <source src={JUMP_SOUND_2} type="audio/mpeg" />
      </audio>
      <audio ref={crashAudioRef} preload="auto">
        <source src={CRASH_SOUND} type="audio/mpeg" />
      </audio>

    </div>
  );
};

export default App;