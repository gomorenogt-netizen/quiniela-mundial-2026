export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  var KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }
  var nickname = req.body.nickname || "Nuevo jugador";
  var existing = (req.body.participants || []).map(function(p) { return p.nickname; }).join(", ");
  var prompt = "Eres El Animador Mundialista, presentador de una quiniela del Mundial 2026 entre amigos. Humor latino chapin guatemalteco, mezclas espanol con ingles. Un nuevo participante se unio: " + nickname + ". Participantes actuales: " + existing + ". Genera UN mensaje de bienvenida corto (maximo 3 lineas), gracioso y personalizado. Solo el mensaje, sin comillas.";
  try {
    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }]
      })
    });
    var data = await response.json();
    var text = (data.content || []).map(function(c) { return c.text || ""; }).join("") || "Bienvenido a la quiniela!";
    return res.status(200).json({ message: text });
  } catch (error) {
    return res.status(200).json({ message: "Bienvenido " + nickname + " a la Quiniela Mundial 2026!" });
  }
}
