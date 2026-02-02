interface NavigationItem {
  name: string;
  href: string;
}

export default function Footer({ footerNavigation }: {
  footerNavigation: {
    app: NavigationItem[]
    company: NavigationItem[]
  }
}) {
  return (
    <footer className='bg-background border-t border-border/50'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-20'>
        <div className='flex flex-col sm:flex-row items-start justify-center gap-16 sm:gap-24 lg:gap-32'>
          {/* Application */}
          <div>
            <h3 className='text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6'>
              Application
            </h3>
            <ul role='list' className='space-y-4'>
              {footerNavigation.app.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className='text-sm font-light text-foreground/70 hover:text-foreground transition-colors duration-200'
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className='text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6'>
              Entreprise
            </h3>
            <ul role='list' className='space-y-4'>
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className='text-sm font-light text-foreground/70 hover:text-foreground transition-colors duration-200'
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-16 pt-8 border-t border-border/30'>
          <p className='text-xs font-light text-muted-foreground text-center'>
            &copy; {new Date().getFullYear()} VinClub. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
