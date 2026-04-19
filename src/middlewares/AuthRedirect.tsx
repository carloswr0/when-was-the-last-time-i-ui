import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../contexts/Auth/AuthContext.tsx";

const AuthMiddleware = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {
        (!isAuthenticated) ? (
          <Navigate to="/login" />
        ) : (
          <Outlet />
        )
      }
    </>
  )
}

export default AuthMiddleware;