import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelsList } from "@/constants/options";
import { toast } from "sonner";
import { chatSession } from "@/service/AiModel";
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
import Autocomplete from "./Autocomplete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [formData, setFormData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Not used for actual auth here, but kept for consistency
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status

  const navigate = useNavigate();

  // Simulate login status. In a real app, this would be set after actual authentication.
  // For demonstration, let's assume if an email is already in local storage, they are "logged in".
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // This function now handles the core logic for generating and saving the trip
  const generateAndSaveTrip = async (userEmail) => {
    setLoading(true);
    toast.info("Generating your trip plan...");

    const FINAL_PROMPT = `Generate Travel Plan for location: ${formData.location} for ${formData.traveler} with a ${formData.budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo Coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image, Url, Geo Coordinates, ticket Pricing, Time travel each of the location for ${formData.noOfDays} days with each day plan with best time to visit in JSON format.`;

    try {
      console.log("Final Prompt for AI:", FINAL_PROMPT);
      const aiResponse = await chatSession(FINAL_PROMPT);
      console.log("AI Response (from chatSession):", aiResponse);

      const tripDataToStore =
        typeof aiResponse === "string" ? { raw: aiResponse } : aiResponse;

      const backendResponse = await axios.post(
        "http://localhost:5000/api/trips",
        {
          userEmail: userEmail, // Use the provided userEmail
          userSelection: formData,
          tripData: tripDataToStore,
        }
      );

      console.log("Backend Response:", backendResponse.data);
      toast.success("Trip plan generated and saved successfully!");
      setIsDialogOpen(false); // Close dialog if it was open
      // Store email in local storage to simulate being "logged in"
      localStorage.setItem("userEmail", userEmail);
      setIsLoggedIn(true); // Update login status
      // You can redirect or display the trip plan here
      // router.push('/view-trip/' + backendResponse.data.trip._id);
      const tripId = backendResponse.data.trip._id;
      navigate("/view-trip/" + tripId); // <-- ADD THIS LINE FOR NAVIGATION
    } catch (error) {
      console.error("Error during trip generation or saving:", error);
      toast.error(
        "Failed to generate or save travel plan. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInitialGenerateClick = () => {
    if (
      !formData?.location ||
      !formData?.noOfDays ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast.error("Please fill all the required details.");
      return;
    }

    if (isLoggedIn) {
      // If already logged in, proceed directly
      generateAndSaveTrip(email); // Use the email from state
    } else {
      // If not logged in, open the dialog
      setIsDialogOpen(true);
    }
  };

  const handleSignInInDialog = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    // In a real application, you'd perform actual authentication here.
    // For this example, providing an email is considered "signing in".
    await generateAndSaveTrip(email); // Proceed with generation using the entered email
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#f56551] to-[#ff8b7d] bg-clip-text text-transparent">
          Craft Your Perfect Journey <span className="text-black">🌍</span>
          <span className="inline-block ml-3 text-black">✈️</span>
        </h2>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Share your travel vision and let our AI create a magical itinerary
          tailored just for you
        </p>
      </div>

      {/* Form Section */}
      <div className="space-y-8 lg:space-y-12">
        {/* Location Input */}
        <div className="relative group">
          <label className="block text-xl font-medium text-gray-700 mb-3">
            🌍 Destination City
          </label>
          <div className="relative">
            <Autocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              onPlaceSelected={(place) =>
                handleInputChange("location", place.display_name)
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f56551] focus:border-transparent transition-all placeholder-gray-400"
              placeholder="Where would you like to go?"
            />
            {/* <span className="absolute right-4 top-3 text-2xl">📍</span> */}
          </div>
        </div>

        {/* Trip Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <label className="block text-xl font-medium text-gray-700 mb-3">
              📅 Trip Duration (Days)
            </label>
            <Input
              placeholder="e.g. 7"
              type="number"
              onChange={(e) => handleInputChange("noOfDays", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-[#f56551] placeholder-gray-400"
            />
          </div>
        </div>

        {/* Budget Options */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Budget Range 💰
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.title}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-6 border-2 cursor-pointer rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  formData?.budget === item.title
                    ? "border-[#f56551] shadow-lg bg-gradient-to-br from-[#fff5f3] to-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traveler Options */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Travel Companions 👨👩👧👦
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SelectTravelsList.map((item) => (
              <div
                key={item.title}
                onClick={() => handleInputChange("traveler", item.people)}
                className={`p-6 border-2 cursor-pointer rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  formData?.traveler === item.people
                    ? "border-[#f56551] shadow-lg bg-gradient-to-br from-[#fff5f3] to-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-14 flex justify-center md:justify-end">
          <Button
            onClick={handleInitialGenerateClick}
            disabled={loading}
            className="relative mb-4 overflow-hidden bg-gradient-to-r from-[#f56551] to-[#ff7d6d] hover:from-[#e55a47] hover:to-[#ff6d5d] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg 
  w-[270px] text-[15px] sm:w-auto sm:text-lg"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white rounded-full animate-spin"></div>
                ✨ Crafting Your Adventure...
              </div>
            ) : (
              <>
                🚀 Generate My Perfect Trip
                <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity"></span>
              </>
            )}
          </Button>
        </div>

        {/* Sign-in Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="rounded-2xl border-0 shadow-xl max-w-md p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-[#fff5f3] to-white p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  🔒 Save Your Journey
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  Sign in to save and access your itineraries anywhere
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    📧 Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="wanderlust@example.com"
                    className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-[#f56551]"
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    value={email}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    🔑 Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-[#f56551]"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleSignInInDialog}
                  disabled={loading}
                  className="w-full bg-[#f56551] hover:bg-[#e55a47] text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {loading
                    ? "🔐 Authenticating..."
                    : "🌟 Continue to Adventure"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateTrip;
