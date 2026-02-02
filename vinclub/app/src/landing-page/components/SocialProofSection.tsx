import { MessageSquare, Quote } from 'lucide-react';
import SectionTitle from './SectionTitle';

export default function SocialProofSection() {
  const messages = [
    {
      id: 1,
      sender: 'Caviste • Paris',
      time: 'Il y a 2h',
      text: 'Hey, just tried the drag-and-drop. Easier than I thought. Sold 12 bottles.',
      avatar: '👨‍💼',
    },
    {
      id: 2,
      sender: 'Propriétaire • Lyon',
      time: 'Hier',
      text: 'Thanks for not making me integrate with my old CashMag. That thing is a dinosaur.',
      avatar: '👩‍💼',
    },
    {
      id: 3,
      sender: 'Gérant • Bordeaux',
      time: 'Il y a 3 jours',
      text: 'The CSV import took 2 minutes. My first campaign sent in 30 seconds. Mind blown.',
      avatar: '🧑‍💼',
    },
  ];

  return (
    <section id="social-proof" className='bg-muted/30 py-16 sm:py-24'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center mb-12'>
          <SectionTitle
            title="Ce que disent les Cavistes"
            description="Des messages réels de propriétaires qui utilisent VinClub au quotidien"
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {messages.map((message) => (
            <div
              key={message.id}
              className='bg-background rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow'
            >
              {/* SMS-like header */}
              <div className='flex items-center gap-3 mb-4 pb-4 border-b border-border'>
                <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl'>
                  {message.avatar}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold text-foreground truncate'>
                      {message.sender}
                    </span>
                    <MessageSquare className='h-4 w-4 text-primary flex-shrink-0' />
                  </div>
                  <span className='text-xs text-muted-foreground'>{message.time}</span>
                </div>
              </div>

              {/* Message text */}
              <div className='relative'>
                <Quote className='absolute -top-2 -left-2 h-6 w-6 text-primary/20' />
                <p className='text-sm text-foreground leading-relaxed pl-4 italic'>
                  "{message.text}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional note */}
        <div className='mt-12 text-center'>
          <p className='text-sm text-muted-foreground italic'>
            Messages anonymisés pour préserver la confidentialité. Utilisateurs réels de VinClub.
          </p>
        </div>
      </div>
    </section>
  );
}

