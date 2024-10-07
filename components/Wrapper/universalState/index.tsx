"use client";

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [selectedUserData, setSelectedUserdata] = useState(null); // Start with null
  const [loading, setLoading] = useState(true); // Add loading state

  return (
    <AuthContext.Provider value={{ selectedUserData, setSelectedUserdata, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
