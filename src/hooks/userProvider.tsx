// contexts/UserContext.js
"use client";

import { createContext, useContext } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user, isLoaded } = useClerkUser();

  const userData = isLoaded
    ? {
        name:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username || "User",
        email: user?.emailAddresses?.[0]?.emailAddress || "user@example.com",
        avatar: user?.imageUrl || "",
        id: user?.id,
      }
    : null;

  return (
    <UserContext.Provider value={{ userData, isLoading: !isLoaded }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
