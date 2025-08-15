import { type AuthUser } from 'wasp/auth';
import Breadcrumb from '../../layout/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useRedirectHomeUnlessUserIsAdmin } from '../../useRedirectHomeUnlessUserIsAdmin';

const Users = ({ user }: { user: AuthUser }) => {
  useRedirectHomeUnlessUserIsAdmin({user})

  return (
    <DefaultLayout _user={user}>
      <Breadcrumb pageName='Users' />
      <div className='flex flex-col gap-10'>
        <div className='text-gray-500 text-center py-12'>
          Users table is temporarily unavailable due to refactor.
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Users;
