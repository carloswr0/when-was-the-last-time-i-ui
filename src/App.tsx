import { Route, Routes, useLocation } from "react-router";
import AuthRedirect from "./middlewares/AuthRedirect";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import RequestResetPasswordScreen from "./screens/RequestResetPasswordScreen";
import VerifyEmailScreen from "./screens/VerifyEmailScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import ThemePreview from "./screens/ThemePreview";

/** Remount when `?token=` changes so token state stays in sync with the URL. */
function ResetPasswordRoute() {
  const { search } = useLocation();
  return <ResetPasswordScreen key={search} />;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<></>} />
      <Route path="/theme-preview" element={<ThemePreview />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/verify-email" element={<VerifyEmailScreen />} />
      <Route
        path="/request-reset-password"
        element={<RequestResetPasswordScreen />}
      />
      <Route path="/reset-password" element={<ResetPasswordRoute />} />
      <Route element={<AuthRedirect />}>
        <Route path="/home" element={<></>} />
        <Route path="/group/new" element={<></>} />
        <Route path="/group/:groupId" element={<></>} />
      </Route>
    </Routes>
  );
};

export default App;
