import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==',
  priority = false,
  sizes = '100vw',
  quality = 80,
  format = 'webp',
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image URL
  const generateOptimizedUrl = (imageSrc: string, targetWidth?: number, targetHeight?: number) => {
    // If it's already a full URL, return as is
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }

    // For local images, we'll use a simple optimization approach
    // In production, you'd integrate with a CDN like Cloudinary, ImageKit, or similar
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-cdn.com' // Replace with your CDN URL
      : '';

    if (baseUrl) {
      const params = new URLSearchParams();
      if (targetWidth) params.append('w', targetWidth.toString());
      if (targetHeight) params.append('h', targetHeight.toString());
      params.append('q', quality.toString());
      params.append('f', format);
      
      return `${baseUrl}${imageSrc}?${params.toString()}`;
    }

    return imageSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before the image comes into view
        threshold: 0.01
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate srcset for responsive images
  const generateSrcSet = (imageSrc: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1920];
    return widths
      .map(width => `${generateOptimizedUrl(imageSrc, width)} ${width}w`)
      .join(', ');
  };

  const optimizedSrc = isInView ? generateOptimizedUrl(src, width, height) : '';
  const srcSet = isInView ? generateSrcSet(src) : '';

  return (
    <div 
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        minHeight: height ? `${height}px` : 'auto'
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse"
          style={{
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      {/* Optimized Image */}
      {isInView && !hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          srcSet={srcSet}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-sm text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
              📷
            </div>
            Image not available
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 