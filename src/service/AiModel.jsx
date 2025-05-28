import { GoogleGenAI } from '@google/genai';

export const chatSession = async (userPrompt) => {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
  });

  const config = {
    responseMimeType: 'application/json', // Keep this, as it's the intent
    systemInstruction: [
      {
        text: `AI Travel Planner. Your response MUST be a valid JSON object.
        Example JSON structure for a travel plan:
        {
          "TravelPlan": {
            "location": "Kerala, India",
            "budget": "Moderate",
            "peoples": "2 people", // Use 'peoples' instead of 'traveler' for consistency if that's what your backend expects
            "tripData": {
              "travelPlan": {
                "location": "Kerala, India",
                "groupSize": "2 people",
                "budget": "Moderate",
                "duration": "1 day"
              },
              "hotels": [
                {
                  "name": "Hotel Name 1",
                  "description": "Description of hotel 1",
                  "priceRange": "Moderate",
                  "amenities": ["Pool", "Free Wi-Fi"]
                }
              ],
              "itinerary": [
                {
                  "day": 1,
                  "activities": [
                    {"time": "Morning", "description": "Activity 1"},
                    {"time": "Afternoon", "description": "Activity 2"}
                  ]
                }
              ]
            }
          }
        }
        
        Ensure the 'tripData' key contains an object with 'travelPlan', 'hotels', and 'itinerary' as shown in the example.
        `,
      },
    ],
  };

  const model = 'gemini-1.5-flash';

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    console.log("AI Response (raw):", fullResponse);

    try {
      // Attempt to parse the response as JSON
      const jsonResponse = JSON.parse(fullResponse);
      console.log("AI Response (parsed):", jsonResponse);
      return jsonResponse;
    } catch (err) {
      console.warn("Response is not valid JSON, attempting to extract JSON:", fullResponse, err);
      // If direct parsing fails, try to find and extract the JSON part.
      // This is a more robust approach if the model adds extraneous text.
      const jsonMatch = fullResponse.match(/\{[\s\S]*\}/); // Regex to find the first JSON object
      if (jsonMatch && jsonMatch[0]) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          console.log("AI Response (extracted and parsed):", extractedJson);
          return extractedJson;
        } catch (extractErr) {
          console.error("Failed to extract and parse JSON from response:", extractErr);
          return 'Error: AI response malformed and could not be parsed.';
        }
      }
      return 'Error: AI response is not valid JSON and could not be extracted.';
    }

  } catch (error) {
    console.error("Error generating content:", error);
    return 'Error generating response.';
  }
};
