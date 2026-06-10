export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  var KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) {
    return res.status(500).json({ error: "No API key" });
  }
  try {
    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: req.body.system || "",
        messages: req.body.messages || []
      })
    });
    var data = await response.json();
    if (data.error) {
      return res.status(200).json({ content: [{ text: '[{"nickname":"Sistema","mensaje":"' + (data.error.message || "Error de API") + '"}]' }] });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({ content: [{ text: '[{"nickname":"Sistema","mensaje":"Error de conexion con la IA"}]' }] });
  }
}
