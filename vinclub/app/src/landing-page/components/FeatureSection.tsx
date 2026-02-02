import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface FeatureSectionProps {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  icon: ReactNode;
  direction?: 'left' | 'right';
  className?: string;
}

export default function FeatureSection({
  title,
  subtitle,
  description,
  benefits,
  icon,
  direction = 'left',
  className,
}: FeatureSectionProps) {
  // Create ID from title for anchor linking
  const sectionId = title.toLowerCase().replace(/\s+/g, '-').replace(/[àáâãäå]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i').replace(/[óòôõö]/g, 'o').replace(/[úùûü]/g, 'u');
  
  return (
    <section id={sectionId} className={cn('py-8 md:py-12', className)}>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div
          className={cn(
            'flex flex-col items-center gap-12 lg:gap-20',
            direction === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
          )}
        >
          {/* Icon/Visual Section */}
          <div className='flex-1 flex justify-center lg:justify-start'>
            <div className='relative w-full max-w-md'>
              <div className='relative p-12 rounded-none bg-label-cream border border-vintage-wine border-[1px]'>
                <div className='text-gold-foil flex justify-center items-center'>{icon}</div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className='flex-1 space-y-6 max-w-2xl'>
            <div>
              <p className='text-primary-descriptor mb-2 text-vintage-wine'>{subtitle}</p>
              <h2 className='text-primary-brand text-4xl md:text-5xl mb-4 text-vintage-wine'>{title}</h2>
              <p className='text-primary-descriptor leading-relaxed text-vintage-wine'>{description}</p>
            </div>

            <div className='space-y-4 pt-4'>
              {benefits.map((benefit, index) => (
                <div key={index} className='flex items-start gap-3'>
                  <div className='flex-shrink-0 mt-0.5'>
                    <CheckCircle2 className='h-5 w-5 text-gold-foil' />
                  </div>
                  <p className='text-primary-descriptor leading-relaxed text-vintage-wine'>{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

