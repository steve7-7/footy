import { RequestHandler } from "express";
import { hasActiveSubscription } from "./auth";

export const handleBetigoloHistory: RequestHandler = async (req, res) => {
  const subscribed = hasActiveSubscription(req);

  const url = "https://betigolo-tips.p.rapidapi.com/premium/history";
  const apiKey =
    process.env.RAPIDAPI_KEY ||
    "51b6753525msh4825bb309875645p1a0c72jsnea34d242fa68";

  const options = {
    method: "GET" as const,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "betigolo-tips.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  try {
    console.log("Fetching betigolo history...");
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Betigolo API error: ${response.status} ${response.statusText}`,
        errorText,
      );
      return res.status(response.status).json({
        error: `Failed to fetch history: ${response.statusText}`,
        status: response.status,
      });
    }

    const data = await response.json();

    if (!subscribed) {
      // P2 fix: strip all premium fields for non-subscribers so they cannot
      // extract tip/odds/result from the raw API response, even via DevTools.
      // The client still receives the match list for display purposes.
      const stripped = (Array.isArray(data) ? data : []).map(
        (match: Record<string, unknown>) => ({
          match_dat: match.match_dat,
          sport: match.sport,
          country: match.country,
          league: match.league,
          home_team: match.home_team,
          away_team: match.away_team,
        }),
      );
      return res.json(stripped);
    }

    console.log(
      `Betigolo history fetched: ${Array.isArray(data) ? data.length : "?"} records`,
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching betigolo history:", error);
    res.status(500).json({
      error: "Failed to fetch history",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
