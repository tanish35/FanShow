import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

declare global {
  interface Window {
    hive_keychain: {
      requestSignBuffer: (
        username: string,
        message: string,
        keyType: string,
        callback: (response: any) => void,
        rpc?: string
      ) => void;
    };
  }
}

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedConnection = localStorage.getItem("walletConnection");
    if (storedConnection) {
      setIsConnected(true);
      setUsername(storedConnection);
    }
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);

    if (!window.hive_keychain) {
      toast.error(
        "Hive Keychain not found. Please install the browser extension to connect."
      );
      setIsLoading(false);
      return;
    }

    if (!username) {
      toast.warning("Please enter your Hive username.");
      setIsLoading(false);
      return;
    }

    const challenge = `fanshow-auth-${Date.now()}`;

    window.hive_keychain.requestSignBuffer(
      username,
      challenge,
      "Posting",
      async (response) => {
        if (response.success) {
          setIsConnected(true);
          localStorage.setItem("walletConnection", username);
          localStorage.setItem(
            "walletAuth",
            JSON.stringify({
              username,
              timestamp: Date.now(),
              signature: response.result,
            })
          );

          try {
            const response1 = await axios.post("/user/login", { username });
            localStorage.setItem("userId", response1.data.user.id);
            toast.success("Connected successfully!");
            setIsOpen(false);
          } catch (error) {
            toast.error("Login request failed. Please try again.");
          }
        } else {
          toast.error("Authentication failed. Please try again.");
        }
        setIsLoading(false);
      }
    );
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUsername("");
    localStorage.removeItem("walletConnection");
    localStorage.removeItem("walletAuth");
    toast.success("Disconnected successfully!");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            FanShow
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {[
            { path: "/", label: "Home" },
            { path: "/artist", label: "Artist" },
            { path: "/about", label: "About" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-blue-600 relative py-1
                ${
                  isActive(link.path)
                    ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                    : "text-gray-600"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                {username}
              </div>
              <Button
                onClick={handleDisconnect}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(true)}
                >
                  <User size={16} className="text-gray-600" />
                  <span>Connect</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">
                    Connect to Hive Keychain
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <Input
                    placeholder="Enter Hive username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="focus-visible:ring-blue-500"
                  />
                  <p className="text-sm text-muted-foreground">
                    You need the Hive Keychain browser extension to connect.
                    Your Posting key will be used to verify your identity.
                  </p>
                </div>
                <DialogFooter className="flex-col sm:flex-row sm:justify-end">
                  <Button
                    onClick={handleConnect}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
