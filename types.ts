export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface PipeData {
  x: number;
  gapTop: number; // The Y position where the gap starts
  passed: boolean;
}

export interface ScoreResponse {
  commentary: string;
}