import { useState, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { LOCAL_STORAGE_TOKEN } from "../../constants";


function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem(LOCAL_STORAGE_TOKEN)));

  const login = useCallback((auth_token: string) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN, auth_token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    setIsAuthenticated(false);
  }, []);

  const providerValues = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout],
  );

  return (
    <AuthContext.Provider value={providerValues}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
