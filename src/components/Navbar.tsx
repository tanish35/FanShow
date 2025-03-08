"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const storedConnection = localStorage.getItem("walletConnection");
    if (storedConnection) {
      setIsConnected(true);
      setUsername(storedConnection);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const handleDisconnect = async () => {
    setIsConnected(false);
    setUsername("");
    localStorage.removeItem("walletConnection");
    localStorage.removeItem("walletAuth");
    await axios.get("/user/logout");
    toast.success("Disconnected successfully!");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/artist", label: "Artist" },
    { path: "/tickets", label: "My Tickets" },
  ];

  const handleUserClick = () => {
    if (isConnected) {
      navigate("/spotify");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-6"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <motion.div
              className="text-2xl font-bold bg-clip-text text-transparent transition-all duration-300"
              style={{
                backgroundImage: isScrolled
                  ? "linear-gradient(to right, #3b82f6, #8b5cf6)" // Blue to Violet
                  : "linear-gradient(to right, #1e3a8a, #1e40af)", // Elegant light blue gradient
              }}
            >
              FanShow
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive(item.path)
                    ? `${
                        isScrolled ? "text-blue-600" : "text-white"
                      } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600`
                    : isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <Button
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded-full"
                  onClick={handleUserClick}
                >
                  {username}
                </Button>
                <Button
                  onClick={handleDisconnect}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
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
                    className={`flex items-center gap-1 ${
                      isScrolled
                        ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => setIsOpen(true)}
                  >
                    <User
                      size={16}
                      className={isScrolled ? "text-gray-600" : "text-white"}
                    />
                    <span>Connect</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl dark:text-gray-100">
                      Connect to Hive Keychain
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <Input
                      placeholder="Enter Hive username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="focus-visible:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                    />
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      You need the Hive Keychain browser extension to connect.
                      Your Posting key will be used to verify your identity.
                    </p>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row sm:justify-end">
                    <Button
                      onClick={handleConnect}
                      className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Connecting..." : "Connect Wallet"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className={isScrolled ? "text-gray-800" : "text-white"} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-purple-900 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-white">
                FanShow
              </Link>
              <button
                className="text-2xl text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="text-xl font-medium text-white hover:text-white/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
