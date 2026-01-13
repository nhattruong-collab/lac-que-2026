
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, FortuneData, FortuneContent } from "../types";

export const getFortuneInterpretation = async (userInput: UserInput, fortune: FortuneData): Promise<FortuneContent> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing");

    const ai = new GoogleGenAI({ apiKey });
    const modelId = 'gemini-3-flash-preview'; 

    const prompt = `
      Khách hàng: Sinh ngày ${userInput.day}/${userInput.month}/${userInput.year}. Quẻ bốc được: "${fortune.name}".
      Vai trò: Bạn là "AI Thần Toán" phiên bản Gen Z, miệng mồm lanh lợi, "mặn mòi", chuyên check nhân phẩm đầu năm.
      
      Yêu cầu cực quan trọng: 
      - Sử dụng văn phong Gen Z (ví dụ: mlem, chốt đơn, flex, thoát ế, ổn áp, lúa về, đỉnh nóc kịch trần...).
      - Nội dung mang tính chất GIẢI TRÍ 100%, hài hước, không gây hoang mang, không mang tính chất mê tín dị đoan.
      - Tuyệt đối không xưng hô kiểu thầy bói truyền thống, hãy xưng là "Tui" hoặc "AI".

      Luận giải JSON chi tiết:
      1. zodiac & element: Can chi và mệnh (đặt tên hài hước, vd: Tuổi Hổ báo, Mệnh Kim Cương).
      2. destinyNumber: Số chủ đạo thần số học.
      3. personality: 1 câu "phán" tính cách cực lầy, trúng tim đen.
      4. Luận giải (vibe "vui là chính"):
         - career: Công danh sự nghiệp (kiểu: deadline không dí, sếp thương đồng nghiệp quý).
         - money: Tài chính (kiểu: túi tiền rủng rỉnh, không lo cháy túi vì Shopee).
         - love: Tình duyên (kiểu: thoát độc thân bền vững, người yêu cũ muốn quay lại nhưng không cho).
         - health: Sức khỏe (kiểu: khỏe như ngựa, bớt thức khuya cày phim).
      5. luckyColor, luckyNumber, luckyHour: Các chỉ số may mắn mang tính "tâm linh vui vẻ".
      6. warning: "Mật chỉ" hài hước (ví dụ: bớt nghe lời hứa lèo, bớt ăn sập tiệm).
      7. poem: Thơ lục bát 4 câu phiên bản chế, hài hước, gieo vần chuẩn.

      Trả về JSON schema:
      {
        "zodiac": "str", "element": "str", "destinyNumber": "str", "personality": "str",
        "career": "str", "money": "str", "love": "str", "health": "str",
        "luckyColor": "str", "luckyNumber": "str", "luckyHour": "str", "warning": "str", "poem": "str"
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.9, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            zodiac: { type: Type.STRING },
            element: { type: Type.STRING },
            destinyNumber: { type: Type.STRING },
            personality: { type: Type.STRING },
            career: { type: Type.STRING },
            money: { type: Type.STRING },
            love: { type: Type.STRING },
            health: { type: Type.STRING },
            luckyColor: { type: Type.STRING },
            luckyNumber: { type: Type.STRING },
            luckyHour: { type: Type.STRING },
            warning: { type: Type.STRING },
            poem: { type: Type.STRING },
          },
          required: ["zodiac", "element", "destinyNumber", "personality", "career", "money", "love", "health", "luckyColor", "luckyNumber", "luckyHour", "warning", "poem"],
        },
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as FortuneContent;

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
        zodiac: "Hổ Báo Trường Mẫu Giáo",
        element: "Mệnh Kim Cương Bất Tử",
        destinyNumber: "Vô đối",
        personality: "Nhìn thì hiền khô nhưng hở ra là flex cực mạnh.",
        career: "Sếp quý sếp thương, deadline tự bay màu.",
        money: "Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cafe phin.",
        love: "Tình duyên nở rộ, người yêu cũ khóc ròng vì hối hận.",
        health: "Khỏe như trâu, chạy như ngựa, ngủ như heo.",
        luckyColor: "Vàng chanh sả",
        luckyNumber: "88",
        luckyHour: "Giờ đi quẩy",
        warning: "Bớt trà sữa lại không là thành 'bé bự' đó nha!",
        poem: "Đầu năm ngựa chạy tung tăng\nLộc rơi trúng đầu sướng râm cả người\nTình duyên phơi phới nụ cười\nCả năm no ấm đời tươi lạ kỳ!"
    };
  }
};
