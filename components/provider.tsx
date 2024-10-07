"use client";

import { SessionProvider } from "next-auth/react";

const Provider = ({ children, session }: any) => {
  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchWhenOffline={false}
      refetchOnWindowFocus={false} // Customize this based on your requirements
    >
      {children}
    </SessionProvider>
  );
};

export default Provider;
