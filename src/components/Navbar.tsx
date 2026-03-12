'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    image?: string;
    verified?: boolean;
  } | null;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onSignOut?: () => void;
  className?: string;
}

export default function Navbar({ user, onSignIn, onSignUp, onSignOut, className }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleClick() {
      setUserMenuOpen(false);
    }
    if (userMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [userMenuOpen]);

  const navLinks = [
    { href: '/search', label: 'Browse RVs' },
    { href: '/listing/new', label: 'List Your RV' },
    { href: '/how-it-works', label: 'How It Works' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white',
        className
      )}
    >
      <nav className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-forest-700">
              <svg className="h-5 w-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18h18M5 18V8l7-5 7 5v10M3 18l3-3M21 18l-3-3" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-forest-800">
              Rival<span className="text-brand-600">RV</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-forest-700 rounded-lg hover:bg-forest-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth / user */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-gray-100 transition-colors"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                  {user.verified && (
                    <svg className="h-3.5 w-3.5 text-brand-500 -ml-1" viewBox="0 0 24 24" fill="currentColor" aria-label="Verified">
                      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 2.632.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516c-2.95.1-5.669-.98-7.877-2.632zM15.53 9.53a.75.75 0 00-1.06-1.06l-3.72 3.72-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" />
                    </svg>
                  )}
                  <svg className={cn('h-4 w-4 text-gray-400 transition-transform', userMenuOpen && 'rotate-180')} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 animate-slide-down">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard/guest" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                      <Link href="/dashboard/guest/trips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Trips</Link>
                      <Link href="/dashboard/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Messages</Link>
                      <Link href="/dashboard/guest" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Favorites</Link>
                      <Link href="/dashboard/guest/verification" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={onSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={onSignIn} className="btn-ghost">
                  Sign In
                </button>
                <button onClick={onSignUp} className="btn-primary !py-2 !px-4 !text-sm">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-forest-50 hover:text-forest-700 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2 px-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard/guest" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                  <Link href="/dashboard/guest/trips" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">My Trips</Link>
                  <Link href="/dashboard/messages" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Messages</Link>
                  <button onClick={onSignOut} className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onSignIn} className="btn-secondary w-full">
                    Sign In
                  </button>
                  <button onClick={onSignUp} className="btn-primary w-full">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
