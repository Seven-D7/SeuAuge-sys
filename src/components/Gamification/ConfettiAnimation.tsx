import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
  colors?: string[];
  intensity?: 'light' | 'medium' | 'heavy';
  duration?: number;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  isVisible,
  onComplete,
  colors = ['#0d9488', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
  intensity = 'medium',
  duration = 3000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Confetti particle class
    class ConfettiParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = Math.random() * 3 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 8 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.life = 0;
        this.maxLife = duration / 16; // 60fps approximation
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.rotation += this.rotationSpeed;
        this.life++;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        
        // Fade out as life progresses
        const alpha = 1 - (this.life / this.maxLife);
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }

      isDead() {
        return this.life >= this.maxLife || this.y > canvas.height + 10;
      }
    }

    // Create particles based on intensity
    const particleCount = intensity === 'light' ? 50 : intensity === 'medium' ? 100 : 200;
    const particles: ConfettiParticle[] = [];

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles periodically
      if (particles.length < particleCount && Math.random() < 0.3) {
        particles.push(new ConfettiParticle());
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();

        if (particle.isDead()) {
          particles.splice(i, 1);
        }
      }

      // Continue animation if particles exist
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isVisible, colors, intensity, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 9999 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfettiAnimation;
