// import React, { useState } from "react";
// import axios from "axios";

// const Autocomplete = ({ onPlaceSelected }) => {
//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const handleInputChange = async (e) => {
//     const inputValue = e.target.value;
//     setQuery(inputValue);

//     if (inputValue.length > 2) {
//       try {
//         const response = await axios.get(
//           "https://nominatim.openstreetmap.org/search",
//           {
//             params: {
//               q: inputValue,
//               format: "json",
//               addressdetails: 1,
//               limit: 5,
//             },
//           }
//         );

//         setSuggestions(response.data);
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//       }
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handlePlaceSelect = (place) => {
//     setQuery(place.display_name);
//     setSuggestions([]);
//     onPlaceSelected(place);
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         value={query}
//         onChange={handleInputChange}
//         placeholder="Search for a location..."
//         className="w-full p-2 border border-gray-300 rounded-md"
//       />
//       {suggestions.length > 0 && (
//         <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
//           {suggestions.map((place) => (
//             <li
//               key={place.place_id || place.osm_id}
//               onClick={() => handlePlaceSelect(place)}
//               className="p-2 cursor-pointer hover:bg-gray-200"
//             >
//               {place.display_name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Autocomplete;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Autocomplete = ({ onPlaceSelected }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
              params: {
                q: query,
                format: "json",
                addressdetails: 1,
                limit: 5,
              },
            }
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 500); // Debounce delay: 500ms

    return () => clearTimeout(debounceTimer); // Cleanup on new input
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handlePlaceSelect = (place) => {
    setQuery(place.display_name);
    setSuggestions([]);
    onPlaceSelected(place);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a location..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((place) => (
            <li
              key={place.place_id || place.osm_id}
              onClick={() => handlePlaceSelect(place)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;

