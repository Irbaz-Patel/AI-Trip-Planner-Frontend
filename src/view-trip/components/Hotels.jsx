import React from "react";
import { Link } from "react-router-dom";
import HotelCardItem from "./HotelCardItem";

const Hotels = ({ hotels }) => {
  // console.log("hotels Recommendation :", hotels);
  // const hotels = trip?.tripData?.travelPlan?.hotels || trip?.tripData?.HotelOptions || [];
  // console.log("hotels", hotels);
  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendation</h2>

      {hotels ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
          {hotels.map((hotel, index) => (
            <HotelCardItem hotel={hotel} key={index} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-2">
          No hotel recommendations available.
        </p>
      )}
    </div>
  );
};

export default Hotels;
