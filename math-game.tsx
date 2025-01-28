"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  GAME_CONFIG,
  getAvailableOperations,
  generateTarget,
  generateEquation,
  evaluateEquation,
} from "./utils/game-config"
import type { GameState, Operation } from "./types/game"
import { StartScreen, GameOverScreen } from "./game-screens"
import "./styles/globals.css"
import React from "react"

type GameScreenState = "start" | "playing" | "gameOver"

export default function MathGame() {
  const [gameScreenState, setGameScreenState] = useState<GameScreenState>("start")
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    timeLeft: GAME_CONFIG.maxTime,
    currentEquation: "",
    targetResult: 0,
    availableNumbers: [],
    isGameActive: false,
  })

  const startGame = useCallback(() => {
    const target = generateTarget(1)
    const { equation, numbers } = generateEquation(1, target)
    setGameState({
      level: 1,
      score: 0,
      timeLeft: GAME_CONFIG.maxTime,
      currentEquation: "",
      targetResult: target,
      availableNumbers: numbers,
      isGameActive: true,
    })
    setGameScreenState("playing")
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null; // Use NodeJS.Timeout directly

    if (gameState.isGameActive && gameState.timeLeft > 0) {
        timer = setInterval(() => {
            setGameState((prev) => {
                if (prev.timeLeft <= 1) {
                    clearInterval(timer!); // Non-null assertion is safe here
                    setGameScreenState("gameOver");
                    return { ...prev, isGameActive: false, timeLeft: 0 };
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 };
            });
        }, 1000);
    }

    return () => {
        if (timer) {
            clearInterval(timer);
        }
    };
}, [gameState.isGameActive]); // Only depend on isGameActive

const handleInput = (value: string) => {
    if (!gameState.isGameActive) return;

    setGameState((prev) => ({
        ...prev,
        currentEquation: prev.currentEquation + value,
    }));
};

  const handleClear = () => {
    setGameState((prev) => ({
      ...prev,
      currentEquation: "",
    }))
  }

  const checkResult = useCallback(() => {
    const result = evaluateEquation(gameState.currentEquation)
    if (result === gameState.targetResult) {
      const newLevel = gameState.level + 1
      const newTarget = generateTarget(newLevel)
      const { equation, numbers } = generateEquation(newLevel, newTarget)
      setGameState((prev) => ({
        ...prev,
        level: newLevel,
        score: prev.score + Math.floor(GAME_CONFIG.baseScore * Math.sqrt(prev.level)),
        currentEquation: "",
        targetResult: newTarget,
        availableNumbers: numbers,
        timeLeft: GAME_CONFIG.maxTime, // Reset timer for new equation
      }))
    }
  }, [gameState.currentEquation, gameState.targetResult, gameState.level])

  useEffect(() => {
    checkResult()
  }, [gameState.currentEquation, checkResult])

  const operations = getAvailableOperations(gameState.level)

  const renderGameContent = () => (
    <>
      <div className="game-header">
        <Image
          src="/images/mathness1.png"
          alt="Math Game Logo"
          className="logo"
          width={120}
          height={120}
        />

        <div className="level-indicator">
          <div className="level-text">NIVEL</div>
          <div className="level-number">{gameState.level}</div>
        </div>

        <div className="game-stats">
          <div className="timer">
            {Math.floor(gameState.timeLeft / 60)}:{(gameState.timeLeft % 60).toString().padStart(2, "0")}
          </div>
          <div className="score">{gameState.score.toString()}</div>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-bar-fill"></div>
      </div>

      <div className="game-content">
        <div className="equation-display">
          <div className="equation">{gameState.currentEquation || "?"}</div>
          <div className="target">{gameState.targetResult.toString()}</div>
        </div>

        <div className="number-pad">
          {gameState.availableNumbers.map((num, index) => (
            <motion.button
              key={`num-${num}-${index}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button number-button"
              onClick={() => handleInput(num.toString())}
            >
              {num}
            </motion.button>
          ))}
        </div>

        <div className="operations">
          {operations.map((op) => (
            <motion.button
              key={op}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`button operation-button ${getOperationClass(op)}`}
              onClick={() => handleInput(op)}
            >
              {op}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="button clear-button"
          onClick={handleClear}
        >
          Clear
        </motion.button>
      </div>
    </>
  )

  const getOperationClass = (op: Operation): string => {
    switch (op) {
      case "+":
        return "add"
      case "-":
        return "subtract"
      case "×":
        return "multiply"
      case "÷":
        return "divide"
      case "√":
        return "sqrt"
      case "y×":
        return "power"
      default:
        return ""
    }
  }

  return (
    <div className="game-container">
      <AnimatePresence mode="wait">
        {gameScreenState === "start" && <StartScreen key="start" onStart={startGame} />}
        {gameScreenState === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderGameContent()}
          </motion.div>
        )}
        {gameScreenState === "gameOver" && (
          <GameOverScreen key="gameOver" score={gameState.score} onRestart={startGame} />
        )}
      </AnimatePresence>
    </div>
  )
}

