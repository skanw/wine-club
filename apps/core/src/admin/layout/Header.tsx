import { useState } from 'react'
import { useAuth } from 'wasp/client/auth'
import { logout } from 'wasp/client/auth'

export default function Header({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (_open: boolean) => void }) {
  const { data: user } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none'>
      <div className='flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11'>
        <div className='flex items-center gap-2 sm:gap-4 lg:hidden'>
          <button
            aria-controls='sidebar'
            onClick={(e) => {
              e.stopPropagation()
              setSidebarOpen(!sidebarOpen)
            }}
            className='z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden'
          >
            <span className='relative block h-5.5 w-5.5 cursor-pointer'>
              <span className='du-block absolute right-0 h-full w-full'>
                <span className='relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white'></span>
                <span className='relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[150] duration-200 ease-in-out dark:bg-white'></span>
                <span className='relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[300] duration-200 ease-in-out dark:bg-white'></span>
              </span>
            </span>
          </button>
        </div>

        <div className='flex items-center gap-3 2xsm:gap-7'>
          <ul className='flex items-center gap-2 2xsm:gap-4'>
            <div className='relative'>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              >
                Admin
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800'>
                  <div className='px-4 py-2 text-sm text-gray-700 dark:text-gray-200'>
                    <div className='font-medium'>{user?.username}</div>
                    <div className='text-gray-500 dark:text-gray-400'>{user?.email}</div>
                  </div>
                  <div className='border-t border-gray-100 dark:border-gray-700'>
                    <button
                      onClick={() => logout()}
                      className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ul>
        </div>
      </div>
    </header>
  )
}
