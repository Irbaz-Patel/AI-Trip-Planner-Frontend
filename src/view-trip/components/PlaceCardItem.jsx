import { Button } from '@/components/ui/button'
import { IoLocation } from "react-icons/io5";
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { GetUnsplashPhoto } from '@/service/GlobalApi';

const PlaceCardItem = ({place}) => {
    // console.log(place)
      const name = place.placeName || place.name || "Unknown Place";
  const details = place.placeDetails || place.details || place.PlaceDetails || "No details available";
  const time = place.timeTravel || place.timeToSpend || place.bestTimetoVisit || place.timeToVisit
 || place.TimeTravel || "Time not specified";

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
                     console.log(photoUrl)
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
       <Link to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place.placeName)} target="_blank">
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all cursor-pointer'>
        <img 
        // src="/images.jpg" 
        src={placePhotoUrl}
        className='w-[130px] h-[130px] rounded-xl object-cover' 
        alt={place.placeName} />

        <div>
          <h2 className='font-bold text-lg'>{name}</h2>
          <p className='text-sm text-gray-400'>{details}</p>
          <h2 className='mt-2'>🕙 {time}</h2>
           {/* <Button size='sm'><IoLocation /> </Button> */}
        </div>
      </div>
    </Link>
  )
}

export default PlaceCardItem
