import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GROQ_API_KEY;

app.post("/chat", async (req, res) => {
  const history = req.body.history;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ reply: "History is required as an array" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
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
    res.json({ reply: data.choices[0]?.message?.content || "Sorry, I couldn't fetch a response." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Sorry, server error. Try again later." });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

