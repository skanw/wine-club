import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  href?: string;
}

export default function FAQ({ faqs }: { faqs: FAQ[] }) {
  return (
    <section id="faq" className='bg-background py-24 sm:py-32 lg:py-40'>
      <div className='mx-auto max-w-2xl px-6 lg:px-8'>
        <h2 className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-center mb-16 sm:mb-20'>
          Questions fréquemment posées
        </h2>

        <Accordion type='single' collapsible className='w-full'>
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={`faq-${faq.id}`}
              className='border-0 border-b border-border/50 py-6'
            >
              <AccordionTrigger className='text-left text-base font-medium leading-7 text-foreground hover:no-underline hover:text-foreground/80 transition-colors duration-200 [&[data-state=open]>svg]:rotate-45 [&>svg]:transition-transform [&>svg]:duration-200'>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className='pt-4'>
                <p className='text-base font-light leading-7 text-muted-foreground'>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
