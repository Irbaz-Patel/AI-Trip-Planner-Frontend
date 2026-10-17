import { GoogleGenAI } from "@google/genai";

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const status = Number(error?.status ?? error?.code);
  const message = error?.message ?? "";

  return (
    [429, 500, 502, 503, 504].includes(status) ||
    /status:\s*(429|500|502|503|504)/i.test(message)
  );
};

export const chatSession = async (userPrompt) => {
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3.8-flash";

  const config = {
    responseMimeType: "application/json",
    systemInstruction: `
      You are an AI Travel Planner.
      Return only valid JSON without Markdown fences.

      Use this structure:
      {
        "TravelPlan": {
          "location": "Destination",
          "budget": "Moderate",
          "peoples": "2 people",
          "tripData": {
            "travelPlan": {},
            "hotels": [],
            "itinerary": []
          }
        }
      }

      Include the requested number of days in the itinerary.
      Each itinerary day must contain an activities array.
      Each hotel and activity should contain the relevant details.
      Use null for unknown prices, ratings, coordinates, or URLs.
      Do not present estimates as verified facts.
    `,
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config,
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response.");
      }

      const trip = JSON.parse(response.text);

      if (
        !trip?.TravelPlan?.tripData ||
        !Array.isArray(trip.TravelPlan.tripData.itinerary) ||
        !Array.isArray(trip.TravelPlan.tripData.hotels)
      ) {
        throw new Error("Gemini returned an invalid trip structure.");
      }

      return trip;
    } catch (error) {
      if (!isRetryableError(error) || attempt === 3) {
        console.error("Gemini generation failed:", error);
        throw error;
      }

      const delay = attempt * 3000;

      console.warn(
        `Gemini request failed. Retrying in ${delay / 1000} seconds...`,
        error.message
      );

      await sleep(delay);
    }
  }

  throw new Error("Trip generation failed after retries.");
};
