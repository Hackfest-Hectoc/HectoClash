"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "../ui/input"
import { CheckCircle2, Circle, Lock, Clock, Trophy, Zap, User, Cookie } from "lucide-react"
import Header from "./header"
import toast from "react-hot-toast"

export default function Practice() {
  // Game state
  const [expression, setExpression] = useState("")
  const [gameData, setGameData] = useState({
    "gid": "game123",
    "player_one": "player123",
    "status": "active",
    "player1expression": "",
    "player1solves": ["", "", "", "", ""],
    "player1questions": ["", "", "", "", ""],
    "player1curround": 1,
    "player1points": 0,
    "player1ratingchanges": 0,
    "noofrounds": 5,
  })
  const [round, setRound] = useState(0)
  const [question, setQuestion] = useState("")
  const [player1, setPlayer1] = useState({ uid: "", username: "Player", rating: 1200 })
  const [gameHistory, setGameHistory] = useState([])
  const [isCorrect, setIsCorrect] = useState(null)

  // Refs
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  // Initialize game when component mounts
  useEffect(() => {
    initializeGame()
  }, [])

  // Function to initialize the game
  const initializeGame = () => {
    const storedUsername = localStorage.getItem('username') || "Player"
    const storedRating = parseInt(localStorage.getItem('rating') || "1200")

    setPlayer1({
      uid: "player1",
      username: storedUsername,
      rating: storedRating
    })

    // Initialize first question
    generateNewQuestion(1)
  }

  // Function to generate a new question
  const generateNewQuestion = (roundNumber) => {
    const digits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1).join("")
    setQuestion(digits)

    // Update game data
    const updatedGameData = { ...gameData }
    updatedGameData.player1curround = roundNumber
    updatedGameData.player1questions[roundNumber - 1] = digits
    setGameData(updatedGameData)

    setRound(roundNumber - 1)
  }

  // Function to evaluate mathematical expression safely
  const evaluateExpression = (expr, digits) => {
    try {
      // Check if expression only uses the digits from the question
      const digitsArray = digits.split("")
      const expressionDigits = expr.replace(/[^0-9]/g, "").split("")

      // Check if all required digits are used exactly once
      if (expressionDigits.length !== digitsArray.length) return false

      const sortedExprDigits = [...expressionDigits].sort()
      const sortedDigits = [...digitsArray].sort()

      if (JSON.stringify(sortedExprDigits) !== JSON.stringify(sortedDigits)) return false

      // Check for invalid characters (now allowing ^ for exponent)
      if (/[^0-9+\-*/().\^]/.test(expr)) return false

      // Replace ^ with ** for JavaScript's exponent operator
      const jsExpr = expr.replace(/\^/g, "**")

      // Evaluate the expression
      // eslint-disable-next-line no-eval
      const result = eval(jsExpr)

      // Check if result is 100
      return Math.abs(result - 100) < 0.001
    } catch (error) {
      console.error("Error evaluating expression:", error)
      return false
    }
  }

  // Button feedback functions
  const changeBackgroundColor = (color: string) => {
    if (submitButtonRef.current) {
      submitButtonRef.current.classList.remove("bg-green-300")
      submitButtonRef.current.classList.add(color)
    }
  }

  const resetBackgroundColor = (color: string) => {
    if (submitButtonRef.current) {
      submitButtonRef.current.classList.remove(color)
      submitButtonRef.current.classList.add("bg-green-300")
    }
  }

  const handleSubmitResponse = (response: boolean) => {
    setIsCorrect(response)

    if (response) {
      // Show success toast
      toast.success("Correct!", {
        duration: 2000,
        style: {
          background: 'rgba(0, 0, 0, 1)',
          color: '#4ade80',
          border: '1px solid #4ade80',
        },
        icon: '🎉',
      })

      changeBackgroundColor("bg-green-500")
      setTimeout(() => resetBackgroundColor("bg-green-500"), 200)

      // Update game data
      const updatedGameData = { ...gameData }
      updatedGameData.player1solves[round] = expression
      updatedGameData.player1points += 10
      setGameData(updatedGameData)

      // Move to next round if not at max rounds
      if (gameData.player1curround < gameData.noofrounds) {
        setTimeout(() => {
          generateNewQuestion(gameData.player1curround + 1)
          setExpression("")
        }, 1000)
      } else {
        toast.success("Game complete! Final score: " + (gameData.player1points + 10), {
          duration: 3000,
          icon: '🏆',
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#4ade80',
            border: '1px solid #4ade80',
          },
        })
      }
    } else {
      // Show error toast
      toast.error("Incorrect. Try again!", {
        duration: 2000,
        style: {
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#f87171',
          border: '1px solid #ef4444',
        },
        icon: '❌',
      })

      changeBackgroundColor("bg-red-500")
      setTimeout(() => resetBackgroundColor("bg-red-500"), 200)
    }

    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = false
    }
  }

  const handleSubmit = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true
    }

    // Check if expression is empty
    if (!expression.trim()) {
      toast.error("Please enter an expression", {
        duration: 2000,
        style: {
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#f87171',
          border: '1px solid #ef4444',
        },
      })
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false
      }
      return
    }

    const isValid = evaluateExpression(expression, question)
    handleSubmitResponse(isValid)

    // Update player expression in game data
    const updatedGameData = { ...gameData }
    updatedGameData.player1expression = expression
    setGameData(updatedGameData)
  }

  const handleExpressionChange = (newExpression: string) => {
    setExpression(newExpression)

    // Update player expression in game data
    const updatedGameData = { ...gameData }
    updatedGameData.player1expression = newExpression
    setGameData(updatedGameData)
  }

  // Helper function to render round status icon
  const getSymbol = (roundIndex: number) => {
    if (roundIndex < round) {
      return <CheckCircle2 className="text-green-500" size={20} />
    } else if (roundIndex === round) {
      return <Circle className="text-white animate-pulse" size={20} />
    } else {
      return <Lock className="text-white" size={20} />
    }
  }

  // Helper function to render question characters
  const renderQuestion = (questionText: string) => (
    <div className="flex mt-12 flex-wrap gap-3 sm:gap-4 bg-transparent text-2xl sm:text-3xl justify-center">
      <AnimatePresence>
        {questionText.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-center w-12 h-12 bg-transparent rounded-lg shadow-md border-[3px] border-white text-white"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )

  // Helper function to render player card
  const renderPlayer = (player: any, color: string, points: number) => (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center mt-3"
    >
      <div className={`relative flex items-center bg-transparent backdrop-blur-sm px-6 py-3 rounded-xl border border-${color}-400/20`}>
        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full border border-${color}-400/30 text-xs text-${color}-400`}>
          {color === "green" ? "PLAYER 1" : "PLAYER 2"}
        </div>
        <motion.div
          className={`bg-${color}-600 w-14 h-14 rounded-full text-2xl font-bold shadow-lg flex items-center justify-center text-white border-2 border-${color}-400`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {player.username[0]}
        </motion.div>
        <div className="ml-4">
          <motion.div
            className="text-xl font-bold text-white flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <User size={16} className={`text-${color}-400`} />
            {player.username}
          </motion.div>
          <motion.div
            className={`text-${color}-400 font-semibold flex items-center gap-2`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Zap size={16} />
            Rating: <div className="text-white">{player.rating}</div>
          </motion.div>
        </div>
        <motion.div
          className={`ml-6 flex flex-col items-center justify-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-green-400 font-semibold flex items-center gap-1">
            <Trophy size={14} />
            POINTS
          </div>
          <div className={`text-3xl font-bold text-${color}-400`}>{gameData.player1points}</div>
        </motion.div>
      </div>
    </motion.div>
  )

  return (
    <div className="bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center overflow-y-auto h-screen flex flex-col">
      {/* Logo and Header */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca9e464b944ab22129b2e7d0da766b29064e4364"
        alt="Company Logo"
        className="absolute left-6 h-[37px] top-[20px] w-[31px] z-10"
      />
      <Header></Header>

      {/* Game Status Bar */}
      <div className="bg-black/60 backdrop-blur-sm border-b border-green-400/20 py-2 px-4 flex items-center justify-center">
        <div className="flex justify-evenly w-full items-center gap-3 text-white">
          <span className="font-bold text-lg flex items-center gap-2 ">
            ROUND: <span className="text-green-400">{ gameData.player1curround  }</span> /5
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className=" flex flex-col items-center justify-center text-white">
        {/* Players Section */}
        <div className="w-full max-w-5xl gap-4 mt-8">
          {renderPlayer( player1 , "green",  gameData.player1points)}
        </div>

        {/* Current Question Section */}
        <motion.div
          className="mt-2 mb-8 text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {renderQuestion(question)}
        </motion.div>

        {/* Input Section */}
        <motion.div
          className="w-full max-w-md flex flex-col justify-center items-center "
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div className="w-full" whileHover={{ scale: 1.02 }}>
            <div className="relative">
              <Input
                className="text-center w-full h-[50px] rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white text-xl bg-black/50 border-white"
                placeholder="Type your Expression..."
                value={expression}
                onChange={(e) => handleExpressionChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
            </div>
          </motion.div>
          <motion.div className="w-full flex justify-center mt-4" whileHover={{ scale: 1.02 }}>
            <button
              ref={submitButtonRef}
              onClick={handleSubmit}
              className="text-xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-b-green-600 h-[55px] text-black w-full max-w-[381px] hover:bg-green-600 hover:text-white transition-colors"
            >
              Submit
            </button>
          </motion.div>
        </motion.div>



        {/* Game History Section */}
        <div className="w-full max-w-4xl mt-8 mb-8">
          <div className="w-full bg-black/60 backdrop-blur-sm border border-green-400/30 rounded-xl overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 font-medium text-green-400 px-4 py-3 bg-black/50 border-b border-green-400/20">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  ROUND
                </div>
                <div className="flex items-center gap-2">QUESTION</div>
                <div className="flex items-center gap-2">SOLUTION</div>
              </div>

              <div className="flex flex-col gap-1 max-h-[25vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-500 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-500 [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent ">
                {(gameData.player1questions).map((somedata, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-[1fr_1fr_1fr] gap-4 items-center p-3 ${
                      index === round
                        ? "bg-green-900/20 border-l-4 border-l-green-500"
                        : index < round
                          ? "bg-black/40"
                          : "bg-black/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center">{getSymbol(index)}</div>
                      <span className="font-medium text-white">{index+1}</span>
                    </div>

                    <div className="flex items-center gap-2 ml-1">
                      <span className="font-mono text-green-100">
                        {index <= round ? somedata : "------"}
                      </span>
                    </div>

                    <div>
                      {index < round ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <span className="font-mono text-green-100 ml-2">{ gameData.player1solves[index] }</span>
                        </motion.div>
                      ) : (
                        <span className="font-mono text-gray-400">------</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}