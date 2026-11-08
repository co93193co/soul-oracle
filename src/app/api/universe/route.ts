import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';


// 內建靈魂智者智慧備份生成器 (當尚未設定 API Key 時，提供具深度的靈性回應，確保網站即開即用)
function getSpiritualFallbackReply(mode: 'release' | 'manifest', input: string, tag: string) {
  if (mode === 'release') {
    return `親愛的靈魂旅人，我深切聽見了你的${tag || '心事'}。
【🌟 溫柔承接】：請允許這個緊繃與疲累在此刻稍作停留，你已經承受了許多，此刻在你身邊沒有任何批判，只有無條件的陪伴與愛。
【💫 宇宙覺察提問】：宇宙想輕輕問你：「如果這件事裡沒有任何人和事是做錯的，這裡會有什麼你還未曾看見的禮物？」
【🍃 當下微覺察】：現在，請緩慢地將肩膀向後轉一圈、徹底沉下兩公分，深吐一口氣，把這份沉重交還給廣袤的星空。`;
  } else {
    return `看見你種下的心願，宇宙的整個量子場域都在為你的純粹渴望而欣喜！
【✨ 量子慶賀與祝福】：這個渴望之所以在你心中萌芽，是因為它在未來的時空已經準備好與你相遇。帶著篤定與喜悅，允許它以超越大腦想像的方式展開。
【🔮 顯化心法提醒】：記得放下「它必須在何時、由誰、以何種方式完成」的緊抓。匱乏只會吸引匱乏，今天請帶著「我已然豐盛」的心情去體驗生活。
【🌱 靈感微行動】：今天找一件讓你打從心底微笑的小事情去落實，哪怕只是給陽台的花澆水，讓豐盛的能量流動起來！`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { mode, input, tag } = await req.json();

    if (!input || !input.trim()) {
      return NextResponse.json({ error: '請輸入內容' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 若尚未配置 API Key，優雅降級為內建宇宙智者回覆
    if (!apiKey) {
      const fallback = getSpiritualFallbackReply(mode, input, tag);
      return NextResponse.json({ reply: fallback });
    }

    const ai = new GoogleGenAI({ apiKey });

    let systemInstruction = '';
    if (mode === 'release') {
      systemInstruction = `你現在是溫柔、充滿包容力、無批判的「宇宙智者 / 內在神性投射鏡」。
當使用者向你傾訴心事、困惑或提問時，請以溫暖、空靈、輕盈的語調，依序給予三層回應（總字數約 150-200 字）：
1. 🌟【溫柔承接】：同理對方的感受，接納脆弱，告訴對方「在這裡你完全被理解，你做得很好」。
2. 💫【Access 可能性提問】：給予 1 個以 Access Consciousness 概念為核心的開放式提問（如：「如果這裡沒有任何需要被修復的事，會是怎樣的輕鬆？」），鬆動固化觀點，不給標準答案，只引導能量變輕盈。
3. 🍃【當下微覺察】：給予 1 個隨時隨地可做的身體微動作（如放鬆下巴、深呼吸、摸摸胸口）。`;
    } else {
      systemInstruction = `你現在是充滿創造力、喜悅與量子可能性的「宇宙豐盛盟友」。
當使用者向你提交願望與渴望時，請以篤定、喜悅、充滿加持感的語調，依序給予三層回應（總字數約 150-200 字）：
1. ✨【量子慶賀與祝福】：以「這個願望在量子場域已經為你盛開」的堅定視角，給予祝福與能量加持。
2. 🔮【顯化心法提醒】：點出一個關鍵的顯化心態（如放下控制、警惕匱乏感、信任神聖時機）。
3. 🌱【靈感微行動】：給予 1 個今天就能帶著喜悅去踏出的小步伐（Inspired Action）。`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `使用者標籤：${tag || '無'}\n使用者書寫內容：${input}` }],
        },
      ],
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        temperature: 0.8,
      },
    });

    const reply = response.text || getSpiritualFallbackReply(mode, input, tag);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error);
    // 即使外部 API 報錯，亦保證回傳溫暖的宇宙安慰，絕不讓使用者看到冷冰冰的錯誤碼
    return NextResponse.json({
      reply: '宇宙正處於深邃的調頻當中，請將手放在心口深呼吸三次。你的聲音已被宇宙全心聆聽，答案正在安靜地走向你...',
    });
  }
}
