import React, { useEffect, useState } from "react";
import { Button } from "../button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "../input";
import { toast } from "sonner";

const Header = () => {
  const user = localStorage.getItem("userEmail");
  // const navigation=useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Not used for actual auth here, but kept for consistency
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status

  const handleSignInInDialog = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true); // Set loading to true immediately

    // Simulate an asynchronous operation (like a network request)
    // In a real app, this would be your axios.post('/api/auth/login', { email, password })
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate 1 second delay

    // After the "async operation" (or delay) completes:
    localStorage.setItem("userEmail", email); // Store the email
    // toast.success("Signed in successfully!");
    setIsDialogOpen(false); // Close the dialog
    setLoading(false); // Set loading to false

    window.location.reload(); // Reload the page to fully reflect the changes
  };

  useEffect(() => {
    // console.log(user)
  }, []);
  return (
    <div className="w-full fixed top-0 left-0 bg-white z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="hover:scale-105 transition-transform duration-200 block"
          >
            <span className="text-xl sm:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-[#f56551] to-[#ff8b7d] bg-clip-text text-transparent">
              Aiventure
            </span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex gap-2">
                <Link
                  to="/create-trip"
                  className="hidden sm:block hover:-translate-y-0.5 transition-transform"
                >
                  <Button variant="outline" className="rounded-full px-6 py-2">
                    ✈ Create Trip
                  </Button>
                </Link>
                <Link
                  to="/my-trips"
                  className="hidden sm:block hover:-translate-y-0.5 transition-transform"
                >
                  <Button variant="outline" className="rounded-full px-6 py-2">
                    🗺 My Trips
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Buttons */}
              <div className="sm:hidden flex gap-2">
                <a href="/create-trip">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    ✈
                  </Button>
                </a>
                <a href="/my-trips">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    🗺
                  </Button>
                </a>
              </div>

              <Popover>
                <PopoverTrigger className="cursor-pointer group">
                  <img
                    src="/profile-logo.avif"
                    className="h-9 w-9 sm:h-11 sm:w-11 rounded-full border-2 border-transparent group-hover:border-primary transition-all"
                    alt="Profile"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2 rounded-xl shadow-xl border border-gray-100">
                  <h2
                    className="px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    👋 Logout
                  </h2>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="rounded-full px-6 py-2 text-sm sm:text-base hover:scale-105 transition-transform"
            >
              🔑 Sign In
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Welcome Back! 🎉
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Sign in to save your trips and access exclusive features.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                placeholder="hello@example.com"
                className="rounded-lg py-2 px-4 border-gray-300 focus:ring-2 focus:ring-primary"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                className="rounded-lg py-2 px-4 border-gray-300 focus:ring-2 focus:ring-primary"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleSignInInDialog}
              disabled={loading}
              className="w-full rounded-lg py-2 text-sm font-semibold bg-primary hover:bg-primary-dark transition-colors"
            >
              {loading ? "🔒 Authenticating..." : "🚀 Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
