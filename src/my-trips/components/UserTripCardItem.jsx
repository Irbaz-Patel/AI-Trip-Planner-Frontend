import { GetUnsplashPhoto } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserTripCardItem = ({ myTrip }) => {
  console.log("myTrips", myTrip);
  const { budget, location, noOfDays, traveler } = myTrip?.userSelection;
  const [placePhotoUrl, setPlacePhotoUrl] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [photoError, setPhotoError] = useState(null);

  useEffect(() => {
    if (location) {
      getGenericPlacePhoto();
    }
  }, [location]);

  const getGenericPlacePhoto = async () => {
    setLoadingPhoto(true);
    setPhotoError(null);
    try {
      const photoUrl = await GetUnsplashPhoto(`${location} city`);
      if (photoUrl) {
        setPlacePhotoUrl(photoUrl);
      } else {
        console.warn("No generic photo found for this location on Unsplash.");
        setPlacePhotoUrl(null);
      }
    } catch (error) {
      console.error("Error fetching generic photo:", error.message);
      setPhotoError("Failed to fetch a generic photo for the location.");
      setPlacePhotoUrl(null);
    } finally {
      setLoadingPhoto(false);
    }
  };

  return (
    <Link to={`/view-trip/${myTrip?._id}`}>
      <div className="hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 bg-white rounded-xl overflow-hidden border border-gray-200 flex flex-col h-full">
        <img
          src={
            placePhotoUrl ||
            "https://via.placeholder.com/300x220?text=Image+Not+Found"
          }
          alt={location}
          className="object-cover w-full h-[220px]"
        />
        <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
          <h2 className="font-bold text-sm text-gray-800">{location}</h2>
          <h2 className="text-sm text-gray-500">
            {noOfDays} days trip with {budget} budget
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default UserTripCardItem;
