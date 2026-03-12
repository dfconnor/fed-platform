'use client';

import { useState, type FormEvent } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  defaultLocation?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultGuests?: number;
  onSearch?: (params: {
    location: string;
    startDate: string;
    endDate: string;
    guests: number;
  }) => void;
  className?: string;
}

export default function SearchBar({
  variant = 'hero',
  defaultLocation = '',
  defaultStartDate = '',
  defaultEndDate = '',
  defaultGuests = 2,
  onSearch,
  className,
}: SearchBarProps) {
  const [location, setLocation] = useState(defaultLocation);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [guests, setGuests] = useState(defaultGuests);
  const [locationFocused, setLocationFocused] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch?.({ location, startDate, endDate, guests });
  }

  // Get today's date in YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split('T')[0];

  if (variant === 'compact') {
    return (
      <form
        onSubmit={handleSubmit}
        className={cn(
          'flex items-center gap-2 rounded-full border border-gray-200 bg-white shadow-sm px-2 py-1',
          className
        )}
      >
        <div className="flex items-center gap-2 px-3">
          <svg className="h-4 w-4 text-gray-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where to?"
            className="w-28 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={today}
          className="text-sm text-gray-900 focus:outline-none bg-transparent w-28"
          aria-label="Check in"
        />
        <div className="h-6 w-px bg-gray-200" />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || today}
          className="text-sm text-gray-900 focus:outline-none bg-transparent w-28"
          aria-label="Check out"
        />
        <button
          type="submit"
          className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-600 hover:bg-brand-700 transition-colors shrink-0"
          aria-label="Search"
        >
          <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    );
  }

  // Hero / large variant
  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'w-full max-w-4xl mx-auto',
        className
      )}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2 sm:p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-0 items-center">
          {/* Location */}
          <div className="relative">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="h-5 w-5 text-brand-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-900">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setLocationFocused(true)}
                  onBlur={() => setTimeout(() => setLocationFocused(false), 200)}
                  placeholder="National parks, cities, or campgrounds"
                  className="w-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Autocomplete placeholder dropdown */}
            {locationFocused && location.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-slide-down">
                <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">Suggestions</div>
                {['Yellowstone National Park, WY', 'Yosemite Valley, CA', 'Joshua Tree, CA'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={() => {
                      setLocation(suggestion);
                      setLocationFocused(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 flex items-center gap-3 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                    </svg>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block h-10 w-px bg-gray-200 mx-1" />

          {/* Check-in */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
            <svg className="h-5 w-5 text-brand-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
            </svg>
            <div>
              <label className="block text-xs font-semibold text-gray-900">Check in</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
                className="text-sm text-gray-700 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block h-10 w-px bg-gray-200 mx-1" />

          {/* Check-out */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
            <svg className="h-5 w-5 text-brand-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
            </svg>
            <div>
              <label className="block text-xs font-semibold text-gray-900">Check out</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || today}
                className="text-sm text-gray-700 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block h-10 w-px bg-gray-200 mx-1" />

          {/* Guests + Search */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="h-5 w-5 text-brand-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
              <div>
                <label className="block text-xs font-semibold text-gray-900">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="text-sm text-gray-700 focus:outline-none bg-transparent cursor-pointer"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary !rounded-xl !px-6 !py-3 flex items-center gap-2 shrink-0"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
