import { useState, useEffect } from "react";
import axios from "axios";
import { Music } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
  name: string;
  image: string;
  spotifyId: string;
}

export default function SpotifyLoginPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/spotify/user");
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
      const response = await axios.get("/spotify/login");
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Error initiating Spotify login:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.post("/spotify/disconnect");
      setUserProfile(null);
    } catch (error) {
      console.error("Error disconnecting Spotify:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center space-x-2">
          <Music className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Music Connect</h1>
        </div>

        <Card className="w-full border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLoading ? (
                <Skeleton className="h-8 w-3/4 mx-auto" />
              ) : userProfile ? (
                "Your Spotify Profile"
              ) : (
                "Connect with Spotify"
              )}
            </CardTitle>
            <CardDescription className="text-center">
              {!isLoading &&
                !userProfile &&
                "Link your account to access music features"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ) : userProfile ? (
              <div className="flex flex-col items-center space-y-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={userProfile.image} alt={userProfile.name} />
                  <AvatarFallback className="text-lg">
                    {userProfile.name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <h3 className="text-xl font-medium">{userProfile.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Spotify ID: {userProfile.spotifyId}
                  </p>
                </div>

                <div className="w-full pt-2">
                  <Separator className="my-4" />
                  <Button
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={handleDisconnect}
                  >
                    Disconnect Account
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <div className="rounded-full bg-muted p-6">
                  <Music className="h-12 w-12 text-muted-foreground" />
                </div>

                <Button
                  className="w-full bg-[#1DB954] hover:bg-[#1AA34A] text-white font-medium"
                  onClick={handleLogin}
                >
                  Connect with Spotify
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By connecting, you agree to share your Spotify profile
                  information with our application.
                </p>
              </div>
            )}
          </CardContent>

          {!isLoading && userProfile && (
            <CardFooter className="flex justify-center pb-6 pt-2">
              <p className="text-xs text-muted-foreground">
                Connected on {new Date().toLocaleDateString()}
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
