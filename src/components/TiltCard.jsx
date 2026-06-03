import React, { useRef, useState } from 'react';

export default function TiltCard({ children, className = '', style = {}, maxRotation = 8, scale = 1.015, glowColor = 'rgba(6, 182, 212, 0.15)' }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  const [glowStyle, setGlowStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to the card's center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation: divide relative position by half-width/height, then scale by max rotation angle
    const rotateY = (mouseX / (width / 2)) * maxRotation;
    const rotateX = -(mouseY / (height / 2)) * maxRotation; // inverted so it tilts toward mouse

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);

    // Glare spotlight position in %
    const glowX = ((e.clientX - rect.left) / width) * 100;
    const glowY = ((e.clientY - rect.top) / height) * 100;
    setGlowStyle({
      opacity: 1,
      background: `radial-gradient(circle 120px at ${glowX}% ${glowY}%, ${glowColor}, transparent)`
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
    setGlowStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        transform: transformStyle,
        transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
        position: 'relative',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Glare Glow Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        transition: 'opacity 0.25s ease',
        zIndex: 2,
        ...glowStyle
      }} />
      
      {/* 3D Depth Child Wrapper */}
      <div style={{ transform: 'translateZ(10px)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
