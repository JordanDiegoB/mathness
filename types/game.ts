export type Operation = "+" | "-" | "×" | "÷" | "√" | "y×"

export interface GameState {
  level: number
  score: number
  timeLeft: number
  currentEquation: string
  targetResult: number
  availableNumbers: number[]
  isGameActive: boolean
}

export interface GameConfig {
  maxTime: number
  baseScore: number
  levelRanges: {
    basic: number
    intermediate: number
    advanced: number
    expert: number
  }
}

