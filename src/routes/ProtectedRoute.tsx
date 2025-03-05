import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUser from "../hooks/useUser";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [userDetails, loadingUser] = useUser();
  const [progress, setProgress] = React.useState(13);
  const location = useLocation();

  useEffect(() => {
    if (!loadingUser && !userDetails) {
      toast.error("Please log using hive keychain to continue.");
    }
  }, [loadingUser, userDetails]);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      if (currentProgress >= 99) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Progress value={progress} className="w-1/2" />
        <p className="mt-4 text-sm text-gray-500">
          Checking user authentication...
        </p>
      </div>
    );
  }

  if (!userDetails) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
