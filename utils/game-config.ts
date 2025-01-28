import type { GameConfig, Operation } from "../types/game"

export const GAME_CONFIG: GameConfig = {
  maxTime: 90,
  baseScore: 100,
  levelRanges: {
    basic: 10,
    intermediate: 20,
    advanced: 30,
    expert: 40,
  },
}

export const getAvailableOperations = (level: number): Operation[] => {
  const operations: Operation[] = ["+", "-"]
  if (level > GAME_CONFIG.levelRanges.basic) {
    operations.push("×", "÷")
  }
  if (level > GAME_CONFIG.levelRanges.intermediate) {
    operations.push("√")
  }
  if (level > GAME_CONFIG.levelRanges.advanced) {
    operations.push("y×")
  }
  return operations
}

export const generateTarget = (level: number): number => {
  const base = Math.floor(level / 10) + 1
  return Math.floor(Math.random() * (100 * base)) + 50 * base
}

export const generateEquation = (level: number, target: number): { equation: string; numbers: number[] } => {
  const operations = getAvailableOperations(level)
  let equation = ""
  let result = 0
  const numbers: number[] = []

  const operationCount = Math.min(Math.floor(level / 5) + 1, 5)

  for (let i = 0; i < operationCount; i++) {
    const operation = operations[Math.floor(Math.random() * operations.length)]
    let number: number

    switch (operation) {
      case "+":
        number = Math.floor(Math.random() * (target - result)) + 1
        result += number
        break
      case "-":
        number = Math.floor(Math.random() * result) + 1
        result -= number
        break
      case "×":
        number = Math.floor(Math.random() * 10) + 1
        result *= number
        break
      case "÷":
        number = Math.floor(Math.random() * 10) + 1
        result = Math.floor(result / number)
        break
      case "√":
        number = Math.floor(Math.sqrt(result))
        result = number * number
        break
      case "y×":
        number = Math.floor(Math.random() * 3) + 2
        result = Math.pow(result, number)
        break
      default:
        number = 0
    }

    equation += (i > 0 ? operation : "") + number.toString()
    numbers.push(number)
  }

  const finalOperation = operations[Math.floor(Math.random() * operations.length)]
  const finalNumber = target - result

  equation += finalOperation + finalNumber.toString()
  numbers.push(finalNumber)

  return { equation, numbers: numbers.sort(() => Math.random() - 0.5) }
}

export const evaluateEquation = (equation: string): number => {
  try {
    const processedEquation = equation
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/√/g, "Math.sqrt")
      .replace(/y×/g, "**")

    return new Function(`return ${processedEquation}`)()
  } catch {
    return Number.NaN
  }
}

