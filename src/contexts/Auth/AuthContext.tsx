import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (auth_token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
});
