export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const TOKEN = process.env.FOOTBALL_DATA_TOKEN;
  if (!TOKEN) {
    return res.status(500).json({ error: "Token not configured" });
  }

  try {
    const response = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: { "X-Auth-Token": TOKEN }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "API error: " + response.statusText });
    }

    const data = await response.json();
    
    const finished = (data.matches || [])
      .filter(m => m.status === "FINISHED")
      .map(m => ({
        homeTeam: m.homeTeam.name,
        awayTeam: m.awayTeam.name,
        homeScore: m.score.fullTime.home,
        awayScore: m.score.fullTime.away,
        date: m.utcDate,
        stage: m.stage
      }));

    return res.status(200).json({ 
      finished: finished.length,
      matches: finished 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
