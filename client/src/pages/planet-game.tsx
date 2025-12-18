import { useState, useEffect, useRef } from 'react';

interface Planet {
  y: number;
  velocityY: number;
}

interface Obstacle {
  id: string;
  x: number;
  width: number;
}

const GRAVITY = 0.4;
const JUMP_STRENGTH = -12;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 250;
const PLANET_SIZE = 30;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 50;
const GROUND_Y = GAME_HEIGHT - PLANET_SIZE - 20;
const OBSTACLE_SPEED = 6;
const SPAWN_RATE = 130; // Spawn obstacle every 130ms

export function PlanetGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    planet: { y: GROUND_Y, velocityY: 0 } as Planet,
    obstacles: [] as Obstacle[],
    score: 0,
    gameOver: false,
    lastSpawnTime: 0,
    isJumping: false
  });

  const jump = () => {
    if (!gameStateRef.current.gameOver && gameStateRef.current.planet.y >= GROUND_Y - 2) {
      gameStateRef.current.planet.velocityY = JUMP_STRENGTH;
      gameStateRef.current.isJumping = true;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;

    const gameLoop = () => {
      // Update planet physics
      gameState.planet.velocityY += GRAVITY;
      gameState.planet.y += gameState.planet.velocityY;

      // Ground collision
      if (gameState.planet.y >= GROUND_Y) {
        gameState.planet.y = GROUND_Y;
        gameState.planet.velocityY = 0;
        gameState.isJumping = false;
      }

      // Spawn obstacles
      const now = performance.now();
      if (now - gameState.lastSpawnTime > SPAWN_RATE && !gameState.gameOver) {
        gameState.obstacles.push({
          id: Math.random().toString(),
          x: GAME_WIDTH,
          width: OBSTACLE_WIDTH
        });
        gameState.lastSpawnTime = now;
      }

      // Update obstacles
      gameState.obstacles = gameState.obstacles.filter(obs => {
        obs.x -= OBSTACLE_SPEED;

        // Check collision
        if (
          gameState.planet.y < GROUND_Y + OBSTACLE_HEIGHT &&
          gameState.planet.y + PLANET_SIZE > GROUND_Y &&
          obs.x < PLANET_SIZE &&
          obs.x + obs.width > 0
        ) {
          gameState.gameOver = true;
          setGameOver(true);
          setGameRunning(false);
        }

        // Add score when obstacle passes
        if (obs.x + obs.width === 0 && !gameState.gameOver) {
          gameState.score += 1;
          setScore(gameState.score);
        }

        return obs.x + obs.width > 0;
      });

      // Clear canvas
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw ground
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, GROUND_Y + PLANET_SIZE, GAME_WIDTH, 20);

      // Draw planet
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(PLANET_SIZE / 2, gameState.planet.y + PLANET_SIZE / 2, PLANET_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw obstacles
      ctx.fillStyle = '#ef4444';
      gameState.obstacles.forEach(obs => {
        ctx.fillRect(obs.x, GROUND_Y, obs.width, OBSTACLE_HEIGHT);
      });

      // Draw score
      ctx.fillStyle = '#000';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Score: ${gameState.score}`, 10, 30);

      if (gameState.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
        ctx.font = '18px sans-serif';
        ctx.fillText(`Final Score: ${gameState.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
        ctx.textAlign = 'left';
      }

      if (gameRunning && !gameState.gameOver) {
        requestAnimationFrame(gameLoop);
      }
    };

    if (gameRunning) {
      gameLoop();
    }
  }, [gameRunning]);

  const resetGame = () => {
    gameStateRef.current = {
      planet: { y: GROUND_Y, velocityY: 0 },
      obstacles: [],
      score: 0,
      gameOver: false,
      lastSpawnTime: 0,
      isJumping: false
    };
    setScore(0);
    setGameOver(false);
    setGameRunning(true);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="block"
        />
      </div>
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Click or press Space to jump</p>
        <p>Avoid the red obstacles!</p>
      </div>
      {gameOver && (
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          Play Again
        </button>
      )}
    </div>
  );
}
