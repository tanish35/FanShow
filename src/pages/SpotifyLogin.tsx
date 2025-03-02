import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FaSpotify } from "react-icons/fa";

interface UserProfile {
  name: string;
  image: string;
  spotifyId: string;
}

const SpotifyLogin: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/spotify/user"
      );
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error checking login status:", error);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/spotify/login"
      );
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Error initiating Spotify login:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.post("http://localhost:3000/api/spotify/disconnect");
      setUserProfile(null);
    } catch (error) {
      console.error("Error disconnecting Spotify:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isLoading ? (
              <Skeleton className="h-8 w-3/4 mx-auto" />
            ) : userProfile ? (
              `Welcome, ${userProfile.name}`
            ) : (
              "Login with Spotify"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : userProfile ? (
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userProfile.image} alt="Profile" />
                <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500">
                ID: {userProfile.spotifyId}
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDisconnect}
              >
                Disconnect Spotify
              </Button>
            </div>
          ) : (
            <>
              <p className="text-center mb-4">
                Connect your Spotify account to continue
              </p>
              <Button
                className="w-full bg-[#1DB954] hover:bg-[#1AA34A] text-white font-medium flex items-center justify-center gap-2"
                onClick={handleLogin}
              >
                <FaSpotify className="h-5 w-5" />
                Connect with Spotify
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotifyLogin;
