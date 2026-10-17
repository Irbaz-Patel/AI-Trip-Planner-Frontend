
import React from "react";
import PlaceCardItem from "./PlaceCardItem";

const PlacesToVisit = ({ trip }) => {
  const itinerary = Array.isArray(trip) ? trip : [];

  return (
    <div className="mt-10">
      <h2 className="font-bold text-lg sm:text-xl">
        Places to Visit
      </h2>

      <div>
        {itinerary.length > 0 ? (
          itinerary.map((dayItem, index) => {
            const activities = Array.isArray(dayItem?.activities)
              ? dayItem.activities
              : [];

            const day = dayItem?.Day || dayItem?.day || index + 1;

            return (
              <div className="mt-6" key={index}>
                <h2 className="font-semibold text-md sm:text-lg mb-2">
                  {String(day).toLowerCase().includes("day")
                    ? day
                    : `Day ${day}`}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.length > 0 ? (
                    activities.map((place, idx) => (
                      <div key={idx}>
                        <PlaceCardItem place={place} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No activities available for this day.
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            No itinerary available. Please try generating the trip again.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlacesToVisit;
