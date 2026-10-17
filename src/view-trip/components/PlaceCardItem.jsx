import React, { useEffect, useState } from "react";
import { GetUnsplashPhoto } from "@/service/GlobalApi";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop";

const PlaceCardItem = ({ place }) => {
  const name =
    place?.placeName || place?.name || "Unknown Place";

  const details =
    place?.placeDetails ||
    place?.details ||
    place?.PlaceDetails ||
    "No details available";

  const time =
    place?.timeTravel ||
    place?.timeToSpend ||
    place?.bestTimetoVisit ||
    place?.timeToVisit ||
    place?.TimeTravel ||
    "Time not specified";

  const [placePhotoUrl, setPlacePhotoUrl] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    let cancelled = false;

    const getPlacePhoto = async () => {
      try {
        const photoUrl = await GetUnsplashPhoto(
          `${name} travel destination`
        );

        if (!cancelled) {
          setPlacePhotoUrl(photoUrl || FALLBACK_IMAGE);
        }
      } catch (error) {
        console.error(`Photo fetch failed for ${name}:`, error.message);

        if (!cancelled) {
          setPlacePhotoUrl(FALLBACK_IMAGE);
        }
      }
    };

    getPlacePhoto();

    return () => {
      cancelled = true;
    };
  }, [name]);

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="mt-2 flex gap-5 rounded-xl border p-3 transition-all hover:scale-[1.02] hover:shadow-md">
        <img
          src={placePhotoUrl}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-[130px] w-[130px] shrink-0 rounded-xl object-cover"
          alt={name}
          loading="lazy"
        />

        <div className="min-w-0">
          <h2 className="text-lg font-bold">{name}</h2>
          <p className="text-sm text-gray-400">{details}</p>
          <h2 className="mt-2">🕙 {time}</h2>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCardItem;
