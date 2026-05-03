import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 讀取你在 Vercel 設定的環境變數
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "伺服器未設置 GEMINI_API_KEY" }, { status: 500 });
    }

    const { prompt } = await req.json();

    // 強制 AI 輸出乾淨的 JSON 格式
    const finalPrompt = `
      ${prompt}
      
      請嚴格以 JSON 格式返回，絕對不要包含任何 markdown 標記 (例如 \`\`\`json)，直接返回純物件格式。
      必須包含以下四個欄位：
      {
        "title": "文章標題（20字以內）",
        "category": "分類（只能從這四個選一個：實時研報、政策解讀、行業洞察、市場預警）",
        "summary": "文章摘要（50字以內）",
        "fullText": "深度內容全文（300字以上，包含專業金融分析與戰略建議）"
      }
    `;

    // 🌟 核心修改在這裡：將 URL 裡面的模型名稱更新為 2026 年最穩定的 gemini-2.5-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "AI 請求失敗");
    }

    // 提取文字並進行簡單清理，確保是純 JSON
    let generatedText = data.candidates[0].content.parts[0].text;
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json({ result: generatedText });

  } catch (error: any) {
    console.error("AI 生成錯誤:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
