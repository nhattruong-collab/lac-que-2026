import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, FortuneData, FortuneContent } from "../types";

export const getFortuneInterpretation = async (userInput: UserInput, fortune: FortuneData): Promise<FortuneContent> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using flash-preview for speed and creative writing
    const modelId = 'gemini-3-flash-preview'; 

    const prompt = `
      Bạn là một "Thầy Đồ AI" vui tính, hài hước và hiện đại trong dịp Tết Nguyên Đán.
      
      Hãy luận giải quẻ: "${fortune.name}" cho người sinh ngày ${userInput.day}/${userInput.month}/${userInput.year}.
      
      Yêu cầu giọng văn: Hài hước, "bắt trend", tích cực.
      
      Hãy điền nội dung vào JSON theo các trường sau:
      - career: Dự báo vui về Công danh & Sự nghiệp (dùng từ bao quát cho cả đi học/đi làm).
      - money: Dự báo vui về Tiền tài, lì xì, mua sắm.
      - love: Dự báo về Tình yêu (CỰC KỲ TÍCH CỰC, không nói điều xấu).
      - poem: Một bài thơ lục bát ngắn (2 câu) chế vui về quẻ này.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 1.1,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            career: { type: Type.STRING },
            money: { type: Type.STRING },
            love: { type: Type.STRING },
            poem: { type: Type.STRING },
          },
          required: ["career", "money", "love", "poem"],
        },
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as FortuneContent;

  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback data structure
    return {
        career: "Quẻ báo năm nay làm đâu thắng đó, học hành tấn tới, sếp thương thầy quý.",
        money: "Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cà phê phin.",
        love: "Đào hoa nở rộ, người thương sẽ đến, tình cảm thăng hoa rực rỡ.",
        poem: "Đầu năm rước lộc vào nhà\nCả năm sung túc mặn mà tình duyên"
    };
  }
};