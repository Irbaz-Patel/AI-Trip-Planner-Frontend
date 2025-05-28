import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { IoIosSend } from "react-icons/io";
import { GetUnsplashPhoto } from "@/service/GlobalApi";

const InfoSection = ({ trip }) => {
  // console.log("InfoSection Trip data: ", trip)
  //    const {
  //     location,
  //     destination,
  //     duration,
  //     budget,
  //     travelers,
  //     groupSize,
  //     numberOfPeople
  //   } = trip || {};
  //   const place = location || destination || "Unknown Location";
  // const group = travelers || groupSize || numberOfPeople ||  "N/A";
  // console.log("Infosection Trip Data: ", trip)
  const { budget, location, noOfDays, traveler } = trip || {};

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
      // Search for a generic photo of the location (e.g., "Paris city", "New York building")
      const photoUrl = await GetUnsplashPhoto(`${location} city`); // Adjust query as needed
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
    <div>
      <img
        // src='/images.jpg'
        src={placePhotoUrl}
        className="h-[340px] w-full object-cover rounded-xl"
        alt=""
      />

      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{location}</h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📅 {noOfDays}
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💰 {budget}
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              🥂 No. Of Traveler: {traveler}
            </h2>
          </div>
        </div>
        <Button>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
};

export default InfoSection;
