export interface UserInput {
  day: string;
  month: string;
  year: string;
}

export enum AppState {
  INPUT = 'INPUT',
  RACING = 'RACING',
  LOADING_RESULT = 'LOADING_RESULT',
  RESULT = 'RESULT'
}

export interface FortuneData {
  name: string;
  id: string;
}

export interface FortuneContent {
  career: string;
  money: string;
  love: string;
  poem: string;
}

export interface FortuneResult {
  fortune: FortuneData;
  interpretation: FortuneContent;
}