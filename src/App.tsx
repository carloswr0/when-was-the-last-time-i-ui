import { Route, Routes, useLocation } from "react-router";
import AuthRedirect from "./middlewares/AuthRedirect";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import RequestResetPasswordScreen from "./screens/RequestResetPasswordScreen";
import VerifyEmailScreen from "./screens/VerifyEmailScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import ThemePreview from "./screens/ThemePreview";
import HomeScreen from "./screens/HomeScreen";
import LandingPage from "./screens/LandingPage";
import NewGroupScreen from "./screens/NewGroupScreen";

/** Remount when `?token=` changes so token state stays in sync with the URL. */
function ResetPasswordRoute() {
  const { search } = useLocation();
  return <ResetPasswordScreen key={search} />;
}

const App = () => {
  return (
    <Routes>
      {/*Public screens*/}
      <Route path="/" element={<LandingPage />} />
      <Route path="/theme-preview" element={<ThemePreview />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/verify-email" element={<VerifyEmailScreen />} />
      <Route path="/request-reset-password" element={<RequestResetPasswordScreen />} />
      <Route path="/reset-password" element={<ResetPasswordRoute />} />

      {/*Private screens*/}
      <Route element={<AuthRedirect />}>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/group/new" element={<NewGroupScreen />} />
        <Route path="/group/:groupId" element={<></>} />
      </Route>
    </Routes>
  );
};

export default App;
