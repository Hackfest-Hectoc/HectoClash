"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "../ui/input"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./header"
import axios from "axios"
import { CheckCircle2, Circle, Lock, HelpCircle, Trophy, Zap, Clock, User } from "lucide-react"

interface RoundData {
  question: string
  solved: string
}

export default function Spectator() {
  const [currentRound, setCurrentRound] = useState(3)
  const [expression, setExpression] = useState("")
  const [gameData, setGameData] = useState({
    string: "",
    player_one: "Anubhab",
    player_two: "Sagnik",
    status: "",
    player1expression: "",
    player2expression: "test player expression",
    player1question: "666666",
    player2question: "666666",
    player1curround: 0,
    player2curround: 0,
    player1points: 0,
    player2points: 0,
    noofrounds: 0,
  })
  const [round, setRound] = useState(1)
  const [question, setQuestion] = useState("666666")
  const [player1, setPlayer1] = useState({ username: "Anubhab", rating: 0 })
  const [player2, setPlayer2] = useState({ username: "Sagnik", rating: 0 })
  const ws = useRef<WebSocket | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    ws.current = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}/ws`)
    let interval: ReturnType<typeof setInterval>

    ws.current.onopen = () => console.log("WebSocket connection opened")
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.title === "gameInit") {
          setGameData(data.message)
          gameInit(data.message)
          interval = setInterval(() => getGameData(), 100)
        }
        if (data.title === "question") {
          setQuestion(data.message.question)
          setRound(data.message.number)
        }
        if (data.title === "submitResponse") {
          handleSubmitResponse(data.message)
        }
        if (data.title === "gameData") {
          setGameData(data.message)
        }
      } catch (err) {
        console.error("Error parsing WebSocket message", err)
      }
    }
    ws.current.onerror = (error) => console.error("WebSocket error", error)
    ws.current.onclose = () => console.log("WebSocket connection closed")

    return () => {
      ws.current?.close()
      clearInterval(interval)
    }
  }, [])

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
    changeBackgroundColor(response ? "bg-green-500" : "bg-red-500")
    setTimeout(() => resetBackgroundColor(response ? "bg-green-500" : "bg-red-500"), 200)
    if (submitButtonRef.current) submitButtonRef.current.disabled = false
  }

  const handleSubmit = () => {
    if (submitButtonRef.current) submitButtonRef.current.disabled = true
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ title: "submit", message: expression }))
    }
  }

  const handleExpressionChange = (val: string) => {
    setExpression(val)
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ title: "expression", message: val }))
    }
  }

  const getGameData = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ title: "gameData", message: "hi" }))
    }
  }

  const roundsData: RoundData[] = [
    { question: "123456", solved: "ABCDEF" },
    { question: "234567", solved: "BCDEFG" },
    { question: "345678", solved: "CDEFGH" },
    { question: "456789", solved: "DEFGHI" },
    { question: "567890", solved: "EFGHIJ" },
    { question: "567890", solved: "EFGHIJ" },
  ]

  const getSymbol = (roundIndex: number) => {
    if (roundIndex < currentRound) {
      return <CheckCircle2 className="text-green-500" size={20} />
    } else if (roundIndex === currentRound) {
      return <Circle className="text-white animate-pulse" size={20} />
    } else {
      return <Lock className="text-white" size={20} />
    }
  }

  const gameInit = async (data: any) => {
    try {
      const p1 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/player/${data.player_one}`)
      const p2 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/player/${data.player_two}`)
      setPlayer1(p1.data)
      setPlayer2(p2.data)
    } catch (err) {
      console.error("Failed to fetch player info", err)
    }
  }

  const renderQuestion = (question: string) => (
    <div className="flex flex-wrap gap-3 sm:gap-4 bg-transparent text-2xl sm:text-3xl justify-center">
      <AnimatePresence>
        {question.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-center w-12 h-12 bg-transparent rounded-lg shadow-md border-[3px] border-green-400/30 text-white"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )

  const renderPlayer = (player: any, color: string, points: number) => (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center"
    >
      <div className="relative flex items-center bg-black/40 backdrop-blur-sm px-6 py-3 rounded-xl border border-green-400/20">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full border border-green-400/30 text-xs text-green-400">
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
            <User size={16} className="text-green-400" />
            {player.username}
          </motion.div>
          <motion.div
            className={`text-${color}-400 font-semibold flex items-center gap-2`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Zap size={16} />
            Rating: {player.rating}
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
          <div className={`text-3xl font-bold text-${color}-400`}>{points}</div>
        </motion.div>
      </div>
    </motion.div>
  )

  return (
    <div className="bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center h-screen flex flex-col">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca9e464b944ab22129b2e7d0da766b29064e4364"
        alt="Logo"
        className="absolute left-6 h-[37px] top-[18px] w-[31px] z-10"
      />
      <Header />

      {/* Game Status Bar */}
      <div className="bg-black/60 backdrop-blur-sm border-b border-green-400/20 py-2 px-4 flex items-center justify-center">
        <div className="flex justify-evenly w-full items-center gap-3 text-white">
          <span className="font-bold text-lg flex items-center gap-2">
            ROUND: <span className="text-green-400">{round}</span> / {roundsData.length}
          </span>
          <Clock className="text-green-400" size={18} />
          <span className="font-bold text-lg flex items-center gap-2">
            ROUND: <span className="text-red-400">{round}</span> / {roundsData.length}
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="flex flex-col items-center gap-6 mt-6 border-r border-green-900/50 px-4">
          {renderPlayer(player1, "green", gameData.player1points)}

          <div className="w-full max-w-md bg-black/30 backdrop-blur-sm rounded-xl border border-green-400/20 p-4">
            <div className="text-center mb-4">
              <div className="text-green-400 text-sm font-semibold mb-1">CURRENT QUESTION</div>
              {renderQuestion(gameData.player1question)}
            </div>

            <motion.div
              className="w-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <Input
                  className="text-center w-full h-[50px] rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white text-xl bg-black/50 border-green-400/30"
                  placeholder="Enter your expression..."
                  value={expression}
                  onChange={(e) => handleExpressionChange(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 text-xs">
                  TYPING...
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full bg-black/60 backdrop-blur-sm border border-green-400/30 rounded-xl overflow-hidden mt-auto mb-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 font-medium text-green-400 px-4 py-3 bg-black/50 border-b border-green-400/20">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  ROUND
                </div>
                <div className="flex items-center gap-2">
                  {/* <HelpCircle size={16} /> */}
                  QUESTION
                </div>
                <div className="flex items-center gap-2">
                  {/* <CheckCircle2 size={16} /> */}
                  SOLUTION
                </div>
              </div>

              <div className="flex flex-col gap-1 max-h-[25vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-500">
                {roundsData.map((round, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-[1fr_1fr_1fr] gap-4 items-center p-3 ${index === currentRound
                        ? "bg-green-900/20 border-l-4 border-l-green-500"
                        : index < currentRound
                          ? "bg-black/40"
                          : "bg-black/20"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center">{getSymbol(index)}</div>
                      <span className="font-medium text-white">{index + 1}</span>
                    </div>

                    <div className="flex items-center gap-2 ml-1">
                      <span className="font-mono text-green-100 ">
                        {index <= currentRound ? round.question : "------"}
                      </span>
                    </div>

                    <div>
                      {index < currentRound ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <span className="font-mono text-green-100 ml-2">{round.solved}</span>
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

        <div className="flex flex-col items-center gap-6 mt-6 px-4">
          {renderPlayer(player2, "red", gameData.player2points)}

          <div className="w-full max-w-md bg-black/30 backdrop-blur-sm rounded-xl border border-red-400/20 p-4">
            <div className="text-center mb-4">
              <div className="text-red-400 text-sm font-semibold mb-1">CURRENT QUESTION</div>
              {renderQuestion(gameData.player2question)}
            </div>

            <motion.div
              className="w-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <Input
                  className="text-center w-full h-[50px] rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-white text-xl bg-black/50 border-red-400/30"
                  placeholder="Enter your expression..."
                  value={expression}
                  onChange={(e) => handleExpressionChange(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 text-xs">
                  TYPING...
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full bg-black/60 backdrop-blur-sm border border-red-400/30 rounded-xl overflow-hidden mt-auto mb-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 font-medium text-red-400 px-4 py-3 bg-black/50 border-b border-red-400/20">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  ROUND
                </div>
                <div className="flex items-center gap-2">
                  {/* <HelpCircle size={16} /> */}
                  QUESTION
                </div>
                <div className="flex items-center gap-2">
                  {/* <CheckCircle2 size={16} /> */}
                  SOLUTION
                </div>
              </div>

              <div className="flex flex-col gap-1 max-h-[25vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-red-500">
                {roundsData.map((round, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-[1fr_1fr_1fr] gap-4 items-center p-3 ${index === currentRound
                        ? "bg-red-900/20 border-l-4 border-l-red-500"
                        : index < currentRound
                          ? "bg-black/40"
                          : "bg-black/20"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {index < currentRound ? (
                          <CheckCircle2 className="text-red-500" size={20} />
                        ) : index === currentRound ? (
                          <Circle className="text-white animate-pulse" size={20} />
                        ) : (
                          <Lock className="text-white" size={20} />
                        )}
                      </div>
                      <span className="font-medium text-white">{index + 1}</span>
                    </div>

                    <div className="flex items-center gap-2 ml-1">
                      <span className="font-mono text-red-100">
                        {index <= currentRound ? round.question : "------"}
                      </span>
                    </div>

                    <div>
                      {index < currentRound ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <span className="font-mono text-red-100 ml-2">{round.solved}</span>
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

