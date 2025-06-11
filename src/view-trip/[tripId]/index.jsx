import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Make sure this is imported
import axios from "axios";
import { toast } from "sonner";
import InfoSection from "@/view-trip/components/infoSection";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";

const ViewTrip = () => {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        // Use tripId in the API call
        const response = await axios.get(
          // `http://localhost:5000/api/trips/${tripId}`
          `https://ai-trip-planner-backend-3.onrender.com/api/trips/${tripId}`
        );

        let parsedTripData = response.data.trip.tripData;
        // Step 1: Parse if tripData is a string
        if (typeof parsedTripData === "string") {
          try {
            parsedTripData = JSON.parse(parsedTripData);
          } catch (parseErr) {
            console.error("Error parsing tripData string:", parseErr);
            parsedTripData = { raw: response.data.trip.tripData };
          }
        }

        // Step 2: Normalize the final structure
        let finalHotels = null;
        let finalItinerary = null;
        let finalTravelPlan = null;

        try {
          if (parsedTripData?.tripData?.hotels) {
            // Chennai structure
            finalHotels = parsedTripData.tripData.hotels;
            finalItinerary = parsedTripData.tripData.itinerary;
            finalTravelPlan = parsedTripData.tripData.travelPlan;
          } else if (parsedTripData?.TravelPlan?.tripData?.hotels) {
            // China structure
            finalHotels = parsedTripData.TravelPlan.tripData.hotels;
            finalItinerary = parsedTripData.TravelPlan.tripData.itinerary;
            finalTravelPlan = parsedTripData.TravelPlan.tripData.travelPlan;
          }
        } catch (err) {
          console.error("Error extracting normalized trip data:", err);
        }

        setTrip({
          ...response.data.trip,
          hotels: finalHotels,
          itinerary: finalItinerary,
          travelPlan: finalTravelPlan,
        });
        console.log("Fetched Trip Data:", {
          ...response.data.trip,
          tripData: parsedTripData,
        });
        // toast.success("Trip data loaded successfully!");
        //  Show success toast only if not malformed
        if (
          !parsedTripData?.raw ||
          !parsedTripData.raw.includes("Error: AI response malformed")
        ) {
          toast.success("Trip data loaded successfully!");
        }
      } catch (err) {
        console.error("Error fetching trip data:", err);
        setError("Failed to load trip data.");
        toast.error("Failed to load trip data.");
      } finally {
        setLoading(false);
      }
    };

    // Check for tripId
    if (tripId) {
      fetchTripData();
    } else {
      setLoading(false); // If no tripId, stop loading
      setError("No trip ID provided in the URL.");
    }
  }, [tripId]); // Dependency array should be tripId

  if (loading) {
    return <div className="text-center mt-10">Loading trip details...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!trip) {
    return <div className="text-center mt-10">No trip data found.</div>;
  }

  if (trip.tripData?.raw?.includes("Error: AI response malformed")) {
    toast.success("Please try again later");
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-red-600">Oops! 😕</h2>
        <p className="mt-2 text-gray-700">
          We couldn't generate a travel plan for your trip at this time.
        </p>
        <p className="mt-2 text-gray-600">
          Please try again later or modify your trip details.
        </p>
        <button
          onClick={() => (window.location.href = "/")} // Or trigger regenerate logic
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  console.log("final trip: ", trip);

  return (
    <>
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 xl:px-36 py-10">
        {/* Information Section */}
        <InfoSection trip={trip.userSelection} />

        {/* Recommended Hotels */}
        {/* <Hotels hotels={trip.tripData?.TravelPlan?.tripData?.hotels} /> */}
        <Hotels hotels={trip.hotels} />

        {/* Daily Plan */}
        {/* <PlacesToVisit trip={trip.tripData?.TravelPlan?.tripData?.itinerary} /> */}
        <PlacesToVisit trip={trip.itinerary} />
      </div>
      {/* Footer */}
      <Footer trip={trip} />
    </>
  );
};

export default ViewTrip;
