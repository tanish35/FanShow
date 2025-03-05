import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUser from "../hooks/useUser";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const ProtectedSpotifyRoute = ({ children }: { children: React.ReactNode }) => {
  const [userDetails, loadingUser] = useUser();
  const location = useLocation();

  useEffect(() => {
    if (!loadingUser && (!userDetails || !userDetails.spotifyId)) {
      console.log(userDetails);
      toast.error("Please connect your Spotify account to continue.");
    }
  }, [loadingUser, userDetails]);

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Progress value={50} className="w-1/2" />
        <p className="mt-4 text-sm text-gray-500">Loading user details...</p>
      </div>
    );
  }

  if (!userDetails || !userDetails.spotifyId) {
    return <Navigate to="/spotify" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedSpotifyRoute;
