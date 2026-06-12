export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { model, max_tokens, messages } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error("Missing ANTHROPIC_API_KEY");
      return res.status(500).json({ error: "Missing API key" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-6",
        max_tokens: max_tokens || 1000,
        messages: messages || [{ role: "user", content: "Hi" }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API error:", data);
      return res.status(response.status).json({ error: data.error?.message || "API error", details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: error.message || "Internal error" });
  }
}
