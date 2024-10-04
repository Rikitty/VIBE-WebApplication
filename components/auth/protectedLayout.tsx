'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user);
        setAuthenticated(true);
      } else {
        console.log("No user found, redirecting to login...");
        setAuthenticated(false);
        router.push('/login'); // Redirect to login if not authenticated
      }
      setLoading(false); // Stop loading after the check
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auth, router]);

  if (loading) {
    // You can show a loading spinner or screen while checking auth status
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return null; // Prevent rendering if the user is not authenticated
  }

  return <>{children}</>; // Render the protected content if authenticated
}
