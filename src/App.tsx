import React from "react";
import AppRoutes from "routes";
import useAppLoad from "common/hooks/useAppLoad";
import { AuthProvider } from "./context/AuthContext";
const SplashPage = React.lazy(() => import("pages/splash"));

export default function App() {
  const { isLoaded, progress } = useAppLoad();

  if (!isLoaded) return <SplashPage progress={progress} />;
  
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
