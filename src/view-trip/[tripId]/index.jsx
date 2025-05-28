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
          `http://localhost:5000/api/trips/${tripId}`
        );
        // Ensure that response.data.trip.tripData is parsed if it's a string
        let parsedTripData = response.data.trip.tripData;
        if (typeof parsedTripData === "string") {
          try {
            parsedTripData = JSON.parse(parsedTripData);
          } catch (parseErr) {
            console.error(
              "Error parsing tripData string from backend:",
              parseErr
            );
            // Handle cases where backend might have stored a malformed string
            parsedTripData = { raw: response.data.trip.tripData }; // Keep the raw string if parsing fails
          }
        }
        setTrip({ ...response.data.trip, tripData: parsedTripData });
        console.log("Fetched Trip Data:", {
          ...response.data.trip,
          tripData: parsedTripData,
        });
        toast.success("Trip data loaded successfully!");
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

  console.log("final trip: ", trip);

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {/* Information Section */}
      <InfoSection trip={trip.userSelection} />

      {/* Recommended Hotels */}

      <Hotels hotels={trip.tripData?.TravelPlan?.tripData?.hotels} />
      {/* Daily Plan */}
      <PlacesToVisit trip={trip.tripData?.TravelPlan?.tripData?.itinerary} />

      {/* Footer */}
      <Footer trip={trip} />
    </div>
  );
};

export default ViewTrip;
