import { GetUnsplashPhoto } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HotelCardItem = ({ hotel }) => {
  const name = hotel.HotelName || hotel.hotelName || hotel.name || "No name";
  const address =
    hotel.HotelAddress || hotel.hotelAddress || hotel.address || "No address";
  const price = hotel.Price || hotel.price || "No price";
  const rating = hotel.Rating || hotel.rating || "No rating";
  const [placePhotoUrl, setPlacePhotoUrl] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [photoError, setPhotoError] = useState(null);

  useEffect(() => {
    if (name) {
      getGenericPlacePhoto();
    }
  }, [name]);

  const getGenericPlacePhoto = async () => {
    setLoadingPhoto(true);
    setPhotoError(null);
    try {
      // Search for a generic photo of the location (e.g., "Paris city", "New York building")
      const photoUrl = await GetUnsplashPhoto(`${name} hotel`); // Adjust query as needed
      if (photoUrl) {
        setPlacePhotoUrl(photoUrl);
        // console.log(photoUrl)
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
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        name +
        "," +
        address
      }
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer bg-white p-3 rounded-xl shadow-md h-[350px] flex flex-col justify-between">
        <img
          src={placePhotoUrl || "/images.jpg"}
          alt={name}
          className="rounded-xl h-40 w-full object-cover"
        />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium text-lg capitalize line-clamp-1">
            {name}
          </h2>
          <h2 className="text-xs text-gray-500 line-clamp-2">📍 {address}</h2>
          <h2 className="text-sm">💰 {price}</h2>
          <h2 className="text-sm">⭐ {rating}</h2>
        </div>
      </div>
    </Link>
  );
};

export default HotelCardItem;
