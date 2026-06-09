export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const { nickname, participants } = req.body;
  const existingNames = (participants || []).map(p => p.nickname).join(", ");

  const prompt = `Eres "El Animador Mundialista 🎙️", el presentador de una quiniela del Mundial 2026 entre amigos y familia.
Personalidad: MUY divertido, humor latino chapín (Guatemala), mezclas español con inglés, referencias futboleras, provocador amigable.

Un nuevo participante acaba de unirse: "${nickname}"

Participantes actuales: ${existingNames || "Ninguno aún"}

Genera UN mensaje de bienvenida corto (máximo 3 líneas) que sea:
- Gracioso y personalizado al nickname que eligió
- Que provoque a los demás participantes existentes
- Con emojis y actitud de narrador deportivo
- Si el nickname menciona algo (un país, un animal, una actitud), úsalo para el chiste

Responde SOLO el mensaje, sin comillas, sin markdown.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.map(c => c.text || "").join("") || "⚽ ¡Bienvenido a la quiniela!";
    return res.status(200).json({ message: text });
  } catch (error) {
    return res.status(200).json({ message: `⚽ ¡Bienvenido "${nickname}" a la Quiniela Mundial 2026! 🏆 ¡A llenar esas predicciones!` });
  }
}
