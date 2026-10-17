import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetUnsplashPhoto } from "@/service/GlobalApi";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop";

const UserTripCardItem = ({ myTrip }) => {
  console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
  const selection = myTrip?.userSelection || {};

  const { budget, location, noOfDays } = selection;

  const [placePhotoUrl, setPlacePhotoUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const getPhoto = async () => {
      if (!location) return;

      try {
        const photoUrl = await GetUnsplashPhoto(`${location} city`);

        if (!cancelled) {
          setPlacePhotoUrl(photoUrl || FALLBACK_IMAGE);
        }
      } catch (error) {
        console.error("Error fetching trip photo:", error.message);

        if (!cancelled) {
          setPlacePhotoUrl(FALLBACK_IMAGE);
        }
      }
    };

    getPhoto();

    return () => {
      cancelled = true;
    };
  }, [location]);

  return (
    <Link to={`/view-trip/${myTrip?._id}`}>
      <div className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
        <img
          src={placePhotoUrl || FALLBACK_IMAGE}
          alt={location || "Travel destination"}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-[220px] w-full object-cover"
        />

        <div className="flex flex-col justify-between space-y-1 p-4">
          <h2 className="text-sm font-bold text-gray-800">
            {location || "Unknown destination"}
          </h2>

          <p className="text-sm text-gray-500">
            {noOfDays ?? "N/A"} days trip with {budget || "N/A"} budget
          </p>
        </div>
      </div>
    </Link>
  );
};

export default UserTripCardItem;
