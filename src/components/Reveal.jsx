import React, { useRef, useState, useEffect } from 'react';

export default function Reveal({ children, duration = 0.8, delay = 0, effect = 'slide-up' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Trigger once only
        }
      },
      {
        threshold: 0.1, // trigger when 10% of card is visible
        rootMargin: '0px 0px -50px 0px' // offset slightly so it triggers just before scrolling in fully
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getEffectStyles = () => {
    switch (effect) {
      case 'slide-up':
        return {
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          opacity: isVisible ? 1 : 0
        };
      case 'slide-down':
        return {
          transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
          opacity: isVisible ? 1 : 0
        };
      case 'fade-in':
        return {
          opacity: isVisible ? 1 : 0
        };
      case 'scale-up':
        return {
          transform: isVisible ? 'scale(1)' : 'scale(0.93)',
          opacity: isVisible ? 1 : 0
        };
      case '3d-flip':
        return {
          transform: isVisible ? 'perspective(1000px) rotateX(0deg)' : 'perspective(1000px) rotateX(40deg)',
          opacity: isVisible ? 1 : 0
        };
      default:
        return {};
    }
  };

  return (
    <div
      ref={ref}
      style={{
        ...getEffectStyles(),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}s`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
}
