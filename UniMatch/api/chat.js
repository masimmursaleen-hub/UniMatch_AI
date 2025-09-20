import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Only POST allowed" });
  }

  const history = req.body.history;
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ reply: "History is required as an array" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`, // ENV variable use karna
      },
      body: JSON.stringify({
        model: "groq/compound-mini",
        messages: [
          {
            role: "system",
            content: "You are UniMatch AI, a virtual career counselor. Help students choose fields and universities in Pakistan."
          },
          ...history
        ]
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0]?.message?.content || "Sorry, I couldn't fetch a response." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error. Try again later." });
  }
}
