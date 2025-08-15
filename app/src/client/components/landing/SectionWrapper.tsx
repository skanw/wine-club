import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  background?: 'ivory' | 'shell';
  padding?: 'normal' | 'large';
}

export default function SectionWrapper({ 
  children, 
  className = '', 
  background = 'shell',
  padding = 'normal'
}: SectionWrapperProps) {
  const bgClass = background === 'ivory' ? 'bg-ivory' : 'bg-shell';
  const paddingClass = padding === 'large' ? 'py-24' : 'py-16';
  
  return (
    <section className={`${bgClass} ${paddingClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-shell/50 rounded-card shadow-wc border border-porcelain p-8 md:p-12">
          {children}
        </div>
      </div>
    </section>
  );
}
