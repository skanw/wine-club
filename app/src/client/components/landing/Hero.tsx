import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  cta: {
    primary: string;
    secondary: string;
  };
  stats: Array<{
    number: string;
    label: string;
  }>;
}

// Champagne bubble animation component
const ChampagneBubbles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bubble particles
    const bubbles: Array<{
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
    }> = [];

    // Create bubbles
    for (let i = 0; i < 15; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        radius: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble, index) => {
        // Move bubble up
        bubble.y -= bubble.speed;

        // Reset bubble when it goes off screen
        if (bubble.y < -bubble.radius) {
          bubble.y = canvas.height + bubble.radius;
          bubble.x = Math.random() * canvas.width;
        }

        // Draw bubble with champagne color
        ctx.save();
        ctx.globalAlpha = bubble.opacity;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#E9D9A6'; // champagne color
        ctx.fill();
        
        // Add subtle glow
        ctx.shadowColor = '#E9D9A6';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.15 }}
    />
  );
};

export default function Hero({ badge, title, subtitle, cta, stats }: HeroProps) {
  return (
    <section className="relative min-h-screen pt-28 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-ivory"></div>
      
      {/* Champagne bubbles animation */}
      <ChampagneBubbles />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero panel */}
          <div className="bg-shell/80 backdrop-blur-sm rounded-hero shadow-wc border border-porcelain p-8 md:p-12 lg:p-16 max-w-4xl mx-auto text-center">
            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-champagne/20 border border-champagne/30 text-grape-seed text-sm font-medium mb-6">
                {badge}
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-display-fluid font-bold text-cave mb-6 leading-tight">
              {title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-hero-fluid text-grape-seed mb-8 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/signup"
                className="bg-champagne hover:bg-chablis text-cave font-semibold px-8 py-4 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                {cta.primary}
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <button className="text-grape-seed hover:text-cave font-semibold px-8 py-4 rounded-full border border-porcelain hover:border-champagne transition-all duration-200 inline-flex items-center gap-2">
                <Play className="h-4 w-4" />
                {cta.secondary}
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cave mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-grape-seed">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
