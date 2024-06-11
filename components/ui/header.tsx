'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import Logo from './logo';
import MobileMenu from './mobile-menu';

export default function Header() {
  const [top, setTop] = useState<boolean>(true);

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  return (
    <header
      className={`fixed z-30 w-full transition duration-300 ease-in-out md:bg-opacity-90 ${!top ? 'bg-white shadow-lg backdrop-blur-sm' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Site branding */}
          <div className="mr-4 shrink-0">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop menu links */}
            <ul className="flex grow flex-wrap items-center justify-end">
              <li>
                <Link
                  target={'_blank'}
                  href="/playground"
                  className="flex items-center px-3 py-2 text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 lg:px-5"
                >
                  PlayGround
                </Link>
              </li>
              <li>
                <Link
                  target={'_blank'}
                  href="https://space.bilibili.com/278134"
                  className="flex items-center px-3 py-2 text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 lg:px-5"
                >
                  Bilibili
                </Link>
              </li>
              <li>
                <Link
                  target={'_blank'}
                  href="https://github.com/sutro-planet/easyvideotrans-service"
                  className="flex items-center px-3 py-2 text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 lg:px-5"
                >
                  Github
                </Link>
              </li>
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
