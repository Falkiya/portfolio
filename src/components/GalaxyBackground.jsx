import React, { useEffect, useRef } from 'react';

export default function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Star properties
    const stars = [];
    const numStars = 350; // Galaxy full of stars
    
    // Nebula properties (galaxy gas clouds for simple dark bg with neon effects)
    const nebulas = [
      { 
        x: width * 0.3, 
        y: height * 0.3, 
        radius: Math.min(width, height) * 0.5, 
        color: 'rgba(6, 182, 212, 0.04)', // Subtle cyan-neon dust
        angle: 0, 
        speed: 0.00012 
      },
      { 
        x: width * 0.7, 
        y: height * 0.7, 
        radius: Math.min(width, height) * 0.6, 
        color: 'rgba(139, 92, 246, 0.03)', // Subtle purple-neon dust
        angle: Math.PI, 
        speed: -0.00008 
      },
      { 
        x: width * 0.5, 
        y: height * 0.5, 
        radius: Math.min(width, height) * 0.4, 
        color: 'rgba(56, 189, 248, 0.02)', // Subtle light-blue neon dust
        angle: Math.PI / 2, 
        speed: 0.00006 
      }
    ];

    // Create stars - all white-neon stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.2, // Variety of sizes
        alpha: Math.random() * 0.85 + 0.15,
        twinkleSpeed: 0.002 + Math.random() * 0.008, // Slow, elegant twinkling
        speedX: (Math.random() - 0.5) * 0.025,
        speedY: (Math.random() - 0.5) * 0.025,
        color: 'rgba(255, 255, 255, ' // All white-neon
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      nebulas[0].radius = Math.min(width, height) * 0.5;
      nebulas[1].radius = Math.min(width, height) * 0.6;
      nebulas[2].radius = Math.min(width, height) * 0.4;
    };
    window.addEventListener('resize', handleResize);

    // Mouse drift factor for parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.02;
      targetMouseY = (e.clientY - height / 2) * 0.02;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Rendering animation loop
    const draw = () => {
      // Paint deep space background
      ctx.fillStyle = '#020306'; // Very dark, simple background
      ctx.fillRect(0, 0, width, height);

      // Interpolate mouse movements for smooth drift
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Draw flowing galaxy dust clouds (nebulas)
      nebulas.forEach((nebula) => {
        nebula.angle += nebula.speed;
        
        // Revolving orbit paths to create infinite slow motion loops
        const cos = Math.cos(nebula.angle);
        const sin = Math.sin(nebula.angle);
        const nebX = (width / 2) + cos * (width * 0.1) + mouseX * 0.3;
        const nebY = (height / 2) + sin * (height * 0.1) + mouseY * 0.3;

        const gradient = ctx.createRadialGradient(nebX, nebY, 0, nebX, nebY, nebula.radius);
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(0.5, nebula.color.replace('0.04', '0.015').replace('0.03', '0.01').replace('0.02', '0.005'));
        gradient.addColorStop(1, 'rgba(2, 3, 6, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebX, nebY, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and update stars
      stars.forEach((star) => {
        // Star speed + mouse parallax shift
        star.x += star.speedX + mouseX * (star.size * 0.06);
        star.y += star.speedY + mouseY * (star.size * 0.06);

        // Wrapping boundaries for infinite loop
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Twinkling
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1.0 || star.alpha < 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        const currentAlpha = Math.max(0.15, Math.min(1.0, star.alpha));

        // Draw soft neon star glow halo first (performance optimized concentric bloom)
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (currentAlpha * 0.1) + ')';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Add small neon shadow glow to brighter stars
        if (star.size > 1.0) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fillStyle = star.color + currentAlpha + ')';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else {
          // Standard star core
          ctx.fillStyle = star.color + currentAlpha + ')';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none',
        display: 'block',
        background: '#030509'
      }}
    />
  );
}
