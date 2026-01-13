
export interface UserInput {
  day: string;
  month: string;
  year: string;
}

export enum AppState {
  INPUT = 'INPUT',
  SHUFFLING = 'SHUFFLING', // Trạng thái đang xoay quẻ
  RACING = 'RACING', // Giữ lại nếu muốn chuyển cảnh animation sau khi chọn
  LOADING_RESULT = 'LOADING_RESULT',
  RESULT = 'RESULT'
}

export interface FortuneData {
  name: string;
  id: string;
}

export interface FortuneContent {
  zodiac: string; // Tuổi Can Chi
  element: string; // Bản mệnh
  destinyNumber: string; // Con số chủ đạo (Thần số học)
  personality: string; // Tính cách đặc trưng theo ngày sinh
  career: string;
  money: string;
  love: string;
  health: string;
  luckyColor: string;
  luckyNumber: string;
  luckyHour: string; // Giờ hoàng đạo cá nhân
  warning: string;
  poem: string;
}

export interface FortuneResult {
  fortune: FortuneData;
  interpretation: FortuneContent;
}
