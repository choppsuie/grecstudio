
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const { isLoggedIn, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
    }
  }, [isLoggedIn, loading, toast]);

  if (loading) {
    // You could add a loading spinner here
    return <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="animate-pulse text-cyber-purple">Loading...</div>
    </div>;
  }

  if (!isLoggedIn) {
    // Redirect to auth page, but save the location they tried to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
