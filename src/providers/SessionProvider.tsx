import type { Session } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { getProfile } from '@/features/onboarding/api';
import { supabase } from '@/lib/supabase/client';
import type { Profile } from '@/types/models';

interface SessionContextValue {
  session: Session | null;
  isSessionLoading: boolean;
  profile: Profile | null | undefined;
  isProfileLoading: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsSessionLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsSessionLoading(false);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    });

    return () => subscription.subscription.unsubscribe();
  }, [queryClient]);

  const userId = session?.user.id;
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId as string),
    enabled: !!userId,
  });

  return (
    <SessionContext.Provider value={{ session, isSessionLoading, profile, isProfileLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
