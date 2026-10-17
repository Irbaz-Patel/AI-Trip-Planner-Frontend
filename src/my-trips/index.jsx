import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTripCardItem from "./components/UserTripCardItem";
import axios from "axios";

const MyTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserTrips = async () => {
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        navigate("/");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/trips`,
          { params: { userEmail } }
        );

        console.log("My Trips API response:", response.data);

        setUserTrips(
          Array.isArray(response.data.trips)
            ? response.data.trips
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching trips:",
          error.response?.data || error.message
        );
        setUserTrips([]);
      } finally {
        setLoading(false);
      }
    };

    getUserTrips();
  }, [navigate]);

  return (
    <div className="px-5 sm:px-10 md:px-16 lg:px-24 mt-24 mb-10">
      <h2 className="font-bold text-3xl">My Trips</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[315px] w-full bg-slate-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : userTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {userTrips.map((trip) => (
            <UserTripCardItem key={trip._id} myTrip={trip} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-gray-500">
          No trips found. Create a trip to get started.
        </p>
      )}
    </div>
  );
};

export default MyTrips;
