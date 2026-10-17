import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { IoIosSend } from "react-icons/io";
import { GetUnsplashPhoto } from "@/service/GlobalApi";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop";

const InfoSection = ({ trip }) => {
  const { budget, location, noOfDays, traveler } = trip || {};

  const [placePhotoUrl, setPlacePhotoUrl] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const getPhoto = async () => {
      if (!location) {
        setLoadingPhoto(false);
        return;
      }

      setLoadingPhoto(true);

      try {
        const photoUrl = await GetUnsplashPhoto(`${location} city`);

        if (!cancelled) {
          setPlacePhotoUrl(photoUrl || FALLBACK_IMAGE);
        }
      } catch (error) {
        console.error("Error fetching location photo:", error);
        if (!cancelled) {
          setPlacePhotoUrl(FALLBACK_IMAGE);
        }
      } finally {
        if (!cancelled) {
          setLoadingPhoto(false);
        }
      }
    };

    getPhoto();

    return () => {
      cancelled = true;
    };
  }, [location]);

  return (
    <div className="mt-10">
      <img
        src={placePhotoUrl || FALLBACK_IMAGE}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = FALLBACK_IMAGE;
        }}
        className="h-52 sm:h-64 md:h-[340px] w-full object-cover rounded-xl"
        alt={`${location || "Travel destination"} landscape`}
      />

      {loadingPhoto && (
        <p className="mt-2 text-sm text-gray-500">
          Loading destination photo...
        </p>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mt-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-xl sm:text-2xl">
            {location || "Unknown location"}
          </h2>

          <div className="flex flex-wrap gap-3">
            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-600 text-xs sm:text-sm">
              📅 {noOfDays} days
            </span>

            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-600 text-xs sm:text-sm">
              💰 {budget}
            </span>

            <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-600 text-xs sm:text-sm">
              🥂 Travelers: {traveler}
            </span>
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
