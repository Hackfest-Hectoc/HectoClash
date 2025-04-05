import SomeModal from "./modalforspec"

import { useState, useEffect, useRef } from "react"
import { Input } from "../ui/input"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./header"
import axios from "axios"
import { CheckCircle2, Circle, Lock, HelpCircle, Trophy, Zap, Clock, User } from "lucide-react"
import { useNavigate } from "react-router-dom"



export default function Spectator() {
  const [expression, setExpression] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [gameData, setGameData] = useState({
    "gid": "",
    "player_one": "",
    "player_two": "",
    "status": "status",
    "player1expression": "",
    "player2expression": "",
    "player1solves": ["0", "0", "0", "0", "0"],
    "player2solves": ["0", "0", "0", "0", "0"],
    "player1questions": ["0", "0", "0", "0", "0"],
    "player2questions": ["0", "0", "0", "0", "0"],
    "player1curround": 1,
    "player2curround": 4,
    "player1points": 0,
    "player2points": 0,
    "player1ratingchanges": 0,
    "player2ratingchanges": 0,
    "noofrounds": 5,
    "winner": ""
  })
  const [player1, setPlayer1] = useState({ uid: "", username: "Anubhab", rating: 0 })
  const [player2, setPlayer2] = useState({ uid: "", username: "Sagnik", rating: 0 })
  const ws = useRef<WebSocket | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)


  function getCookie(name: string) {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];

    return cookieValue ? decodeURIComponent(cookieValue) : "";
  }
  let uid = getCookie("uid")


  useEffect(() => {
    ws.current = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}/spectate`)
    let interval: ReturnType<typeof setInterval>
    interval = setInterval(() => getGameData(), 300)
    ws.current.onopen = () => console.log("WebSocket connection opened")
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.title === "gameInit") {
          setGameData(data.message)
          gameInit(data.message)

        }

        if (data.title === "gameData") {
          setGameData(data.message)
          if (data.message.status !== "") {
            setShowModal(true)
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket message", err)
      }
    }
    ws.current.onerror = (error) => console.error("WebSocket error", error)
    ws.current.onclose = () => {
      navigate("/home") 
      console.log("WebSocket connection closed")}

    return () => {
      ws.current?.close()
      clearInterval(interval)
    }
  }, [])






  const getGameData = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ title: "gameData", message: "hi" }))
    }
  }


  const getSymbol = (roundIndex: number, currentRound: number) => {
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
            className="flex items-center justify-center w-12 h-12 bg-transparent rounded-lg shadow-md border-[3px] border-white text-white"
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
          {/* <div className="text-sm text-green-400 font-semibold flex items-center gap-1">
            <Trophy size={14} />
            POINTS
          </div>
          <div className={`text-3xl font-bold text-${color}-400`}>{points}</div> */}
        </motion.div>
      </div>
    </motion.div>
  )
  const navigate = useNavigate()
  return (

    <div className="bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center  flex flex-col h-screen  overflow-y-auto">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca9e464b944ab22129b2e7d0da766b29064e4364"
        alt="Logo"
        className="absolute left-6 h-[37px] top-[18px] w-[31px] z-10"
      />
      <SomeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        player1={{ username: player1.username, rating: player1.rating, uid: player1.uid, ratingChanges: gameData.player1ratingchanges }}
        player2={{ username: player2.username, rating: player2.rating, uid: player2.uid, ratingChanges: gameData.player2ratingchanges }}
        winner={gameData.winner}
        navigate={navigate}
      />
      <Header />

      {/* Game Status Bar */}
      <div className="bg-black/60 backdrop-blur-sm border-b border-green-400/20 py-2 px-4 flex items-center justify-center">
        <div className="flex justify-evenly w-full items-center gap-3 text-white">
          <span className="font-bold text-lg flex items-center gap-2">
            ROUND: <span className="text-green-400">{gameData.player1curround}</span> / 5
          </span>
          <Clock className="text-green-400" size={18} />
          <span className="font-bold text-lg flex items-center gap-2">
            ROUND: <span className="text-red-400">{gameData.player2curround}</span> / 5
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden ">
        <div className="flex flex-col items-center gap-6 mt-6 border-r border-green-900/50 px-4 ">
          {renderPlayer(player1, "green", gameData.player1points)}

          <div className="w-full max-w-md bg-transparent backdrop-blur-sm rounded-xl border border-green-400/20 p-4 mt-4">
            <div className="text-center mb-4">
              <div className="text-green-400 text-sm font-semibold mb-1">CURRENT QUESTION</div>
              {renderQuestion(gameData.player1questions[gameData.player1curround])}
            </div>

            <motion.div
              className="w-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <Input
                  className="text-center w-full h-[50px] rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white text-xl bg-transparent border-white"
                  placeholder="TYPING..."
                  value={gameData.player1expression}
                  readOnly

                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 text-xs">

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

              <div className="flex flex-col gap-1 max-h-[25vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-500 [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent ">
                {gameData.player1questions.map((round, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-[1fr_1fr_1fr] gap-4 items-center p-3 ${index === gameData.player1curround - 1
                      ? "bg-green-900/20 border-l-4 border-l-green-500"
                      : index < gameData.player1curround - 1
                        ? "bg-black/40"
                        : "bg-black/20"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center">{getSymbol(index, gameData.player1curround - 1)}</div>
                      <span className="font-medium text-white">{index + 1}</span>
                    </div>

                    <div className="flex items-center gap-2 ml-1">
                      <span className="font-mono text-green-100 ">
                        {index <= gameData.player1curround - 1 ? round : "------"}
                      </span>
                    </div>

                    <div>
                      {index < gameData.player1curround - 1 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <span className="font-mono text-green-100 ml-2">{gameData.player1solves[index]}</span>
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

          <div className="w-full max-w-md bg-transparent backdrop-blur-sm rounded-xl border border-red-400/20 mt-4 p-4">
            <div className="text-center mb-4">
              <div className="text-red-400 text-sm font-semibold mb-1">CURRENT QUESTION</div>
              {renderQuestion(gameData.player2questions[gameData.player2curround])}
            </div>

            <motion.div
              className="w-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <Input
                  className="text-center w-full h-[50px] rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-white text-xl bg-transparent border-white"
                  placeholder="TYPING..."
                  value={gameData.player2expression}
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 text-xs">

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

              <div className="flex flex-col gap-1 max-h-[25vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-red-500 [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent ">
                {gameData.player2questions.map((round, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-[1fr_1fr_1fr] gap-4 items-center p-3 ${index === gameData.player2curround - 1
                      ? "bg-red-900/20 border-l-4 border-l-red-500"
                      : index < gameData.player2curround - 1
                        ? "bg-black/40"
                        : "bg-black/20"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {index < gameData.player2curround - 1 ? (
                          <CheckCircle2 className="text-red-500" size={20} />
                        ) : index === gameData.player2curround - 1 ? (
                          <Circle className="text-white animate-pulse" size={20} />
                        ) : (
                          <Lock className="text-white" size={20} />
                        )}
                      </div>
                      <span className="font-medium text-white">{index + 1}</span>
                    </div>

                    <div className="flex items-center gap-2 ml-1">
                      <span className="font-mono text-red-100">
                        {index <= gameData.player2curround - 1 ? round : "------"}
                      </span>
                    </div>

                    <div>
                      {index < gameData.player2curround - 1 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <span className="font-mono text-red-100 ml-2">{gameData.player2solves[index]}</span>
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

