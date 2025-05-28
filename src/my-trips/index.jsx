import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserTripCardItem from "./components/UserTripCardItem";
import axios from "axios";

const MyTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/trips?userEmail=${userEmail}`
      );
      console.log("User Trips:", response.data.trips); // ✅ log all trips
      setUserTrips(response.data.trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };
  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-10 mt-24">
      <h2 className="font-bold text-3xl text-center sm:text-left">My Trips</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        {userTrips?.length > 0
          ? userTrips.map((trips) => (
              <UserTripCardItem key={trips._id} myTrip={trips} />
            ))
          : [1, 2, 3, 4, 5].map((item, id) => (
              <div
                key={id}
                className="h-[315px] w-full bg-slate-200 animate-pulse rounded-xl"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default MyTrips;
