
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import RequestList from "./pages/RequestList";
import DocumentView from "./pages/DocumentView";
import DisposisiList from "./pages/DisposisiList";
import DisposisiDetail from "./pages/DisposisiDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state if auth is being checked
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// App routes with auth protection
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state if auth is being checked on initial load
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="requests" element={<RequestList />} />
        <Route path="disposisi" element={<DisposisiList />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/requests/:id" element={
        <ProtectedRoute>
          <DocumentView />
        </ProtectedRoute>
      } />
      <Route path="/disposisi/:id" element={
        <ProtectedRoute>
          <DisposisiDetail />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
