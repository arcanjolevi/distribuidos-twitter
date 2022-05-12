import React, { createContext, useState, useEffect } from "react";
import { signInWithGoogle, auth, signOut } from "../utils/firebase";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const u = await signInWithGoogle();
    if (u) {
      setUser(u);
      console.log(u);
    }
    setLoading(false);
  }

  async function signOutFirebase() {
    setAuthenticated(false);
    signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((_user) => {
      if (!!_user) {
        setAuthenticated(true);
        setUser(_user);
      }
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        isLoading,
        user,
        signOut: signOutFirebase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContextProvider };
export default AuthContext;
