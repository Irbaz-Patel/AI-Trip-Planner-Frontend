import axios from 'axios';

// Unsplash API for generic photos (requires an Unsplash Developer Account and API Key)
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_API_KEY; // Get this from Unsplash Developer Dashboard
const UNSPLASH_BASE_URL = 'https://api.unsplash.com/search/photos';

export const GetUnsplashPhoto = async (query) => {
    try {
        const response = await axios.get(UNSPLASH_BASE_URL, {
            params: {
                query: query, // e.g., "Paris city", "New York park"
                per_page: 7, // Just get one photo
                orientation: 'landscape'
            },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });
        // if (response.data.results && response.data.results.length > 0) {
        //     return response.data.results[0].urls.regular; // Or .small, .thumb
        // }
        if (response.data.results && response.data.results.length > 0) {
  const randomIndex = Math.floor(Math.random() * response.data.results.length);
  return response.data.results[randomIndex].urls.regular;
}
        return null;
    } catch (error) {
        console.error("Error fetching Unsplash photo:", error.response?.data || error.message);
        throw error;
    }
};

