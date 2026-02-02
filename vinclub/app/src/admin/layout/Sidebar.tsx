import {
  Activity,
  LayoutDashboard,
  Package,
  Settings,
  Store,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../client/static/logo.webp';
import { cn } from '../../lib/utils';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'group relative flex items-center gap-3 rounded-lg py-3 px-4 font-light text-muted-foreground transition-all duration-200 hover:bg-accent/50 hover:text-foreground',
      {
        'bg-accent/70 text-foreground font-normal': isActive,
      }
    );

  return (
    <aside
      ref={sidebar}
      className={cn(
        'absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-background border-r border-border/50 duration-300 ease-linear lg:static lg:translate-x-0',
        {
          'translate-x-0': sidebarOpen,
          '-translate-x-full': !sidebarOpen,
        }
      )}
    >
      {/* SIDEBAR HEADER */}
      <div className='flex items-center justify-between gap-2 px-8 py-8'>
        <NavLink to='/' className="opacity-80 hover:opacity-100 transition-opacity">
          <img src={Logo} alt='Logo' width={40} />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls='sidebar'
          aria-expanded={sidebarOpen}
          className='block lg:hidden text-muted-foreground hover:text-foreground'
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        {/* Sidebar Menu */}
        <nav className='py-4 px-6'>
          {/* Platform Section */}
          <div className="mb-8">
            <h3 className='mb-6 px-4 text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground/70'>
              Plateforme
            </h3>

            <ul className='flex flex-col gap-2'>
              <li>
                <NavLink to='/admin' end className={navLinkClass}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink to='/admin/users' end className={navLinkClass}>
                  <Store className="h-4 w-4" />
                  <span>Cavistes</span>
                </NavLink>
              </li>

              <li>
                <NavLink to='/admin/inventory' end className={navLinkClass}>
                  <Package className="h-4 w-4" />
                  <span>Inventaire</span>
                </NavLink>
              </li>

              <li>
                <NavLink to='/admin/operations' end className={navLinkClass}>
                  <Activity className="h-4 w-4" />
                  <span>Opérations</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Settings Section */}
          <div>
            <h3 className='mb-6 px-4 text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground/70'>
              Configuration
            </h3>

            <ul className='flex flex-col gap-2'>
              <li>
                <NavLink to='/admin/settings' end className={navLinkClass}>
                  <Settings className="h-4 w-4" />
                  <span>Paramètres</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Sidebar Footer - Version */}
      <div className="mt-auto px-8 py-6 border-t border-border/30">
        <p className="text-[10px] font-light tracking-wider text-muted-foreground/50 uppercase">
          VinClub Admin v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
