import { type AuthUser } from 'wasp/auth';
import { Menu } from 'lucide-react';
import DarkModeSwitcher from '../../client/components/DarkModeSwitcher';
import { UserDropdown } from '../../user/UserDropdown';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  user: AuthUser;
}) => {
  return (
    <header className='sticky top-0 z-10 flex w-full bg-background/80 backdrop-blur-sm border-b border-border/30'>
      <div className='flex flex-grow items-center justify-between px-8 py-4'>
        {/* Mobile Menu Button */}
        <div className='flex items-center gap-4 lg:hidden'>
          <button
            aria-controls='sidebar'
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className='p-2 rounded-lg hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground'
          >
            <Menu className='h-5 w-5' />
          </button>
        </div>

        {/* Spacer for desktop */}
        <div className='hidden lg:block' />

        {/* Right side actions */}
        <div className='flex items-center gap-4'>
          <DarkModeSwitcher />
          <div className='h-6 w-px bg-border/50' />
          <UserDropdown user={props.user} />
        </div>
      </div>
    </header>
  );
};

export default Header;
