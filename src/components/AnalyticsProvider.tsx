'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { trackPageView, identifyUser, resetUser } from '@/lib/analytics';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Track page views on route change
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);

  // Identify/reset user on auth change
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      identifyUser(session.user.id, {
        email: session.user.email || undefined,
        name: session.user.name || undefined,
      });
    } else if (status === 'unauthenticated') {
      resetUser();
    }
  }, [status, session]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
