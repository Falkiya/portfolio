import React, { useEffect, useRef } from 'react';

export default function GalaxyBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);

  // Sync theme changes to ref so animation loop picks it up instantly
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // --- DARK MODE: Star & Nebula properties ---
    const stars = [];
    const numStars = 350; // Galaxy full of stars
    
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

    // Populate stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.2,
        alpha: Math.random() * 0.85 + 0.15,
        twinkleSpeed: 0.002 + Math.random() * 0.008,
        speedX: (Math.random() - 0.5) * 0.025,
        speedY: (Math.random() - 0.5) * 0.025,
        color: 'rgba(255, 255, 255, ' // White-neon stars
      });
    }

    // --- LIGHT MODE: Clouds & Birds properties ---
    const clouds = [];
    const numClouds = 6;
    for (let i = 0; i < numClouds; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.35) + 60,
        size: Math.random() * 25 + 20,
        speed: 0.04 + Math.random() * 0.05
      });
    }

    const birds = [];
    const numBirds = 12;
    for (let i = 0; i < numBirds; i++) {
      birds.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4) + 60,
        size: Math.random() * 5 + 6, // wing length
        speedX: 0.25 + Math.random() * 0.35, // fly rightward
        speedY: (Math.random() - 0.5) * 0.08,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: 0.06 + Math.random() * 0.06
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
      // Interpolate mouse movements for smooth drift
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const isLightMode = themeRef.current === 'light';

      if (isLightMode) {
        // --- DRAW SUNNY SKY (LIGHT MODE) ---
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#e0f2fe'); // Light sky blue (sky-100)
        skyGrad.addColorStop(0.6, '#f0f9ff'); // Soft blue-white (sky-50)
        skyGrad.addColorStop(1, '#fef08a'); // Warm yellow near horizon (sun flare)
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Draw Sun (radial glow)
        const sunX = width * 0.82 + mouseX * 0.2;
        const sunY = height * 0.18 + mouseY * 0.2;
        const sunRadius = Math.min(width, height) * 0.07;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3);
        sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        sunGrad.addColorStop(0.15, 'rgba(254, 240, 138, 0.7)'); // Soft warm yellow
        sunGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.15)');
        sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw Fluffy Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        clouds.forEach(cloud => {
          cloud.x += cloud.speed + mouseX * 0.05; // soft parallax drift
          if (cloud.x - cloud.size * 3.5 > width) cloud.x = -cloud.size * 3.5;
          if (cloud.x + cloud.size * 3.5 < -width * 0.1) cloud.x = width + cloud.size * 3.5;
          
          ctx.beginPath();
          // Main cloud bubble
          ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
          // Left side bubble
          ctx.arc(cloud.x - cloud.size * 0.6, cloud.y + cloud.size * 0.15, cloud.size * 0.75, 0, Math.PI * 2);
          // Right side bubble
          ctx.arc(cloud.x + cloud.size * 0.6, cloud.y + cloud.size * 0.15, cloud.size * 0.75, 0, Math.PI * 2);
          // Bottom connection bubble
          ctx.arc(cloud.x, cloud.y + cloud.size * 0.3, cloud.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw Wing-Flapping Birds
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)'; // Dark slate vector birds
        ctx.lineWidth = 1.75;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        birds.forEach(bird => {
          // Adjust speeds & include drift factor
          bird.x += bird.speedX + mouseX * 0.12;
          bird.y += bird.speedY + mouseY * 0.12;
          bird.wingPhase += bird.wingSpeed;

          // Wrap birds around screen boundaries (infinity loop)
          if (bird.x - bird.size > width) bird.x = -bird.size;
          if (bird.y < 30) bird.y = height * 0.5;
          if (bird.y > height * 0.5) bird.y = 40;

          // Calculate wing tip coordinates using sine wave wingPhase
          const wingY = Math.sin(bird.wingPhase) * bird.size * 0.45;

          ctx.beginPath();
          // Left Wing
          ctx.moveTo(bird.x - bird.size, bird.y - wingY);
          ctx.quadraticCurveTo(bird.x - bird.size * 0.5, bird.y - bird.size * 0.1, bird.x, bird.y);
          // Right Wing
          ctx.quadraticCurveTo(bird.x + bird.size * 0.5, bird.y - bird.size * 0.1, bird.x + bird.size, bird.y - wingY);
          ctx.stroke();
        });

      } else {
        // --- DRAW STARRY GALAXY (DARK MODE) ---
        ctx.fillStyle = '#020306'; // Dark space
        ctx.fillRect(0, 0, width, height);

        // Draw flowing galaxy dust clouds (nebulas)
        nebulas.forEach((nebula) => {
          nebula.angle += nebula.speed;
          
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
          star.x += star.speedX + mouseX * (star.size * 0.06);
          star.y += star.speedY + mouseY * (star.size * 0.06);

          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;

          star.alpha += star.twinkleSpeed;
          if (star.alpha > 1.0 || star.alpha < 0.15) {
            star.twinkleSpeed = -star.twinkleSpeed;
          }

          const currentAlpha = Math.max(0.15, Math.min(1.0, star.alpha));

          // Concentric bloom halo
          ctx.fillStyle = 'rgba(255, 255, 255, ' + (currentAlpha * 0.1) + ')';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3.5, 0, Math.PI * 2);
          ctx.fill();

          if (star.size > 1.0) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.fillStyle = star.color + currentAlpha + ')';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = star.color + currentAlpha + ')';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

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
        display: 'block'
      }}
    />
  );
}
