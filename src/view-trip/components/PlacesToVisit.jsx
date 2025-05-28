import React from "react";
import PlaceCardItem from "./PlaceCardItem";

const PlacesToVisit = ({ trip }) => {
  console.log("Placed to visit: ", trip);
  //   const itinerary =
  // trip?.tripData?.travelPlan?.itinerary ||
  // trip?.tripData?.travelPlan?.Itinerary ||
  // [];
  //  console.log(itinerary)
  return (
    <div className="mt-5">
      <h2 className="font-bold text-lg">Places to Visit</h2>

      <div>
        {trip?.map((dayItem, index) => (
          <div className="mt-5" key={index}>
            <h2 className="font-medium text-lg">
              {String(dayItem.Day || dayItem.day || index + 1)
                .toLowerCase()
                .includes("day")
                ? dayItem.Day || dayItem.day
                : `Day ${dayItem.Day || dayItem.day || index + 1}`}
            </h2>
            {/* <h2 className="font-medium text-lg">
  Day {dayItem.Day.toString().replace(/^(Day\s*)?/i, '')}
</h2> */}

            <div className="grid md:grid-cols-2 gap-5">
              {dayItem.activities.map((place, idx) => (
                <div key={idx}>
                  {/* <h2 className="font-medium text-sm text-orange-600">{place.timeTravel}</h2> */}
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
