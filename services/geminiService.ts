
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, FortuneData, FortuneContent } from "../types";

export const getFortuneInterpretation = async (userInput: UserInput, fortune: FortuneData): Promise<FortuneContent> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing");

    const ai = new GoogleGenAI({ apiKey });
    const modelId = 'gemini-3-flash-preview'; 

    const prompt = `
      Gia chủ: ${userInput.day}/${userInput.month}/${userInput.year}. Quẻ: "${fortune.name}".
      Vai trò: Bạn là "Thần Toán Tử" - bậc thầy thông thiên văn, tường địa lý, thấu hiểu nhân tâm (tuyệt đối không xưng là AI hay máy tính).
      
      Yêu cầu giải mã JSON:
      1. zodiac & element: Can chi, ngũ hành.
      2. destinyNumber: Số chủ đạo theo Pitago.
      3. personality: 1 câu phán tính cách cực chuẩn, hài hước, mang sắc thái "thầy phán".
      4. Luận giải (ngắn gọn, vibe gây nghiện, dùng từ ngữ phong thủy/huyền học):
         - career: Dự báo công danh, ấn tín.
         - money: Dự báo tài bạch, kho khố.
         - love: Tình cảm, gia đạo (luận giải khéo léo phù hợp cả người độc thân hoặc đã có gia đình).
         - health: Sức khỏe, thân thể.
      5. Chỉ số: luckyColor, luckyNumber, luckyHour (giờ hoàng đạo).
      6. warning: 1 lời khuyên hoặc cảnh báo thiên cơ (hài hước nhưng thấm).
      7. poem: Thơ lục bát 4 câu sấm truyền.

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
        temperature: 1.0, 
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
        zodiac: "Tuổi Mèo Con",
        element: "Mệnh Kim Cương",
        destinyNumber: "Số 9",
        personality: "Bề ngoài lạnh lùng, bên trong nhiều tiền (âm phủ).",
        career: "Deadline dí chạy không kịp thở nhưng lương về là hết mệt.",
        money: "Tiền vào cửa trước, lẻn ra cửa sau vì Shopee.",
        love: "Ế trong tư thế ngẩng cao đầu.",
        health: "Đau lưng mỏi gối vì ngồi code quá nhiều.",
        luckyColor: "Hồng cánh sen",
        luckyNumber: "99",
        luckyHour: "12:00 trưa",
        warning: "Bớt uống trà sữa lại.",
        poem: "Đầu năm mua muối cuối năm mua vôi\nTiền tài rủng rỉnh sướng cái thân tôi\nTình duyên phơi phới như hoa nở\nCả năm hạnh phúc cười hỉ hả thôi"
    };
  }
};
