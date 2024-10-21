"use client";

import { useEffect } from 'react';
import { useAuth } from '../universalState';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const AuthWrapper = ({ children }) => {
  const { setSelectedUserdata, setLoading, loading } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter(); 

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true); // Start showing the loader
      return;
    }

    if (status === 'unauthenticated') {
      setLoading(false); 
      router.push('/');
    } else if (session) {
      // Store user data and hide loader
      setSelectedUserdata(session.user);
      setLoading(false);
    }
  }, [session, status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div> 
      </div>
    );
  }

  return <>{children}</>; 
};
