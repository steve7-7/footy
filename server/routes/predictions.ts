import { RequestHandler } from "express";
import { requireActiveSubscription } from "./auth";

export const handlePredictions: RequestHandler = async (req, res) => {
  if (!requireActiveSubscription(req, res)) {
    return;
  }

  const url =
    "https://football-prediction-api.p.rapidapi.com/api/v2/predictions?market=classic";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
      "x-rapidapi-host": "football-prediction-api.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
};
