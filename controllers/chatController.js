const axios = require("axios");

exports.chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant for Dinkar Seeds company. Answer in simple Hinglish, agriculture-friendly language.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: "AI service is currently unavailable. Please try again later.",
    });
  }
};
