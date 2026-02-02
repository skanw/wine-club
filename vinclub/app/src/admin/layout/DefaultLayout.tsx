import { type AuthUser } from 'wasp/auth';
import { FC, ReactNode, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  user: AuthUser;
  children?: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user.isAdmin) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='flex h-screen overflow-hidden'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />
          <main className='flex-1'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
