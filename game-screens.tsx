import React from "react"
import { motion } from "framer-motion"
import { Button } from "./components/ui/button" // Update this path to the correct path if necessary
import Image from "next/image"

export const StartScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
    <Image
      src="/images/mathness2.png"
      alt="Math Game Logo"
      className="logo"
    />
    <h1 className="game-title">Math Challenge</h1>
    <p className="game-description">Test your math skills and beat the clock!</p>
    <Button
      onClick={onStart}
      className="start-button"
    >
      Start Game
    </Button>
  </motion.div>
)

export const GameOverScreen = ({ score, onRestart }: { score: number; onRestart: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
    <h1 className="game-title">Game Over</h1>
    <p className="game-description">Your final score:</p>
    <p className="final-score">{score}</p>
    <button onClick={onRestart} className="restart-button">
      Play Again
    </button>
  </motion.div>
)

