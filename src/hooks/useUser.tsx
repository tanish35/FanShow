import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  spotifyId: string;
}

const useUser = () => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/user/me");
        setUserDetails(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserDetails(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return [userDetails, loadingUser] as const;
};

export default useUser;
