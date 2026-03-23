export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { model, messages, system, max_tokens, tools } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // messagesをGemini形式に変換
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: typeof m.content === "string" ? m.content : m.content.map(c => c.text || "").join("") }]
  }));

  // systemプロンプトをuser最初のメッセージに付加
  if (system && contents.length > 0) {
    contents[0].parts[0].text = system + "\n\n" + contents[0].parts[0].text;
  }

  // web検索ツールの設定
  const googleSearchTool = tools?.some(t => t.type?.includes("web_search"))
    ? [{ google_search: {} }]
    : [];

  const geminiBody = {
    contents,
    tools: googleSearchTool.length > 0 ? googleSearchTool : undefined,
    generationConfig: {
      maxOutputTokens: max_tokens || 2000,
      temperature: 0.7,
    }
  };

  const modelName = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(geminiBody),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }

  // Anthropic形式に変換して返す
  const candidate = data.candidates?.[0];
  const textContent = candidate?.content?.parts
    ?.filter(p => p.text)
    ?.map(p => p.text)
    ?.join("") || "";

  res.status(200).json({
    content: [{ type: "text", text: textContent }]
  });
}
