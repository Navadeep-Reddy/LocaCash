import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from '@/pages/Home';
import AnalysisToolPage from '@/pages/AnalysisTool';
import DataInsights from '@/pages/DataInsights';
import About from '@/pages/About';
import Login from '@/pages/Login';
import { AuthContextProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/analysis" element={
        <ProtectedRoute>
          <AnalysisToolPage />
        </ProtectedRoute>
      } />
      <Route path="/data" element={
        <ProtectedRoute>
          <DataInsights />
        </ProtectedRoute>
      } />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AppRoutes />
        <Toaster />
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;