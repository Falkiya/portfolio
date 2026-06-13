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
    const numStars = 150;
    
    // Nebula properties (galaxy gas clouds)
    const nebulas = [
      { 
        x: width * 0.3, 
        y: height * 0.3, 
        radius: Math.min(width, height) * 0.5, 
        color: 'rgba(6, 182, 212, 0.08)', // Cyan nebula
        angle: 0, 
        speed: 0.00015 
      },
      { 
        x: width * 0.7, 
        y: height * 0.7, 
        radius: Math.min(width, height) * 0.6, 
        color: 'rgba(139, 92, 246, 0.08)', // Purple nebula
        angle: Math.PI, 
        speed: -0.0001 
      },
      { 
        x: width * 0.5, 
        y: height * 0.5, 
        radius: Math.min(width, height) * 0.4, 
        color: 'rgba(236, 72, 153, 0.04)', // Pink/Magenta nebula
        angle: Math.PI / 2, 
        speed: 0.00008 
      }
    ];

    // Create stars
    for (let i = 0; i < numStars; i++) {
      const isCyan = i % 5 === 0;
      const isPurple = i % 5 === 1;
      const isGold = i % 5 === 2;
      
      let starColor = 'rgba(255, 255, 255, '; // White default
      if (isCyan) starColor = 'rgba(6, 182, 212, ';
      else if (isPurple) starColor = 'rgba(139, 92, 246, ';
      else if (isGold) starColor = 'rgba(253, 224, 71, ';

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: 0.003 + Math.random() * 0.012,
        speedX: (Math.random() - 0.5) * 0.03,
        speedY: (Math.random() - 0.5) * 0.03,
        color: starColor
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
      targetMouseX = (e.clientX - width / 2) * 0.025;
      targetMouseY = (e.clientY - height / 2) * 0.025;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Rendering animation loop
    const draw = () => {
      // Paint deep space background
      ctx.fillStyle = '#030509'; 
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
        const nebX = (width / 2) + cos * (width * 0.12) + mouseX * 0.4;
        const nebY = (height / 2) + sin * (height * 0.12) + mouseY * 0.4;

        const gradient = ctx.createRadialGradient(nebX, nebY, 0, nebX, nebY, nebula.radius);
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(0.5, nebula.color.replace('0.08', '0.03').replace('0.04', '0.01'));
        gradient.addColorStop(1, 'rgba(3, 5, 9, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebX, nebY, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and update stars
      stars.forEach((star) => {
        // Star speed + mouse parallax shift (faster stars move more to create depth)
        star.x += star.speedX + mouseX * (star.size * 0.08);
        star.y += star.speedY + mouseY * (star.size * 0.08);

        // Wrapping boundaries for infinite loop
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Soft twinkling
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1.0 || star.alpha < 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        // Draw star dot
        ctx.fillStyle = star.color + Math.max(0.15, Math.min(1.0, star.alpha)) + ')';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add small glow highlights to prominent stars
        if (star.size > 1.25) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = star.color.includes('6, 182') ? 'var(--accent-cyan)' : 'var(--accent-purple)';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow state
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
