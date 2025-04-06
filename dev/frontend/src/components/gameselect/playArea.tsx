import GameCompletionModal from "./modal"

import { useState, useEffect, useRef, use } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "../ui/input"
import { CheckCircle2, Circle, Lock, Clock, Trophy, Zap, User, Cookie,Clipboard  } from "lucide-react"
import axios from "axios"
import Header from "./header"

import toast from "react-hot-toast"



export default function MathGame() {
  // Game state
  let uid = ""
  const [expression, setExpression] = useState("")
  const [gameData, setGameData] = useState({
    "gid": "game123",
    "player_one": "player123",
    "player_two": "player456",
    "status": "status",
    "player1expression": "",
    "player2expression": "",
    "player1solves": ["0", "0", "0", "0", "0"],
    "player2solves": ["0", "0", "0", "0", "0"],
    "player1questions": ["0", "0", "0", "0", "0"],
    "player2questions": ["0", "0", "0", "0", "0"],
    "player1curround": 1,
    "player2curround": 1,
    "player1points": 0,
    "player2points": 0,
    "player1ratingchanges": 0,
    "player2ratingchanges": 0,
    "noofrounds": 5,
    "winner": "",
  })
  const [round, setRound] = useState(0)
  const [question, setQuestion] = useState("666666")
  const [player1, setPlayer1] = useState({ uid: "", username: "Anubhab", rating: 0 })
  const [player2, setPlayer2] = useState({ uid: "", username: "Sagnik", rating: 0 })
  const [showGameCompleteModal, setShowGameCompleteModal] = useState(false);


  // Refs
  const ws = useRef<WebSocket | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)
  function getCookie(name: string) {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];

    return cookieValue ? decodeURIComponent(cookieValue) : "";
  }
  uid = getCookie("uid")
  const copySpectatorLink = () => {
    const spectatorLink = `http://localhost:5173/spectator?gid=${gameData.gid}`;
    navigator.clipboard.writeText(spectatorLink)
      .then(() => toast.success("Spectator link copied! 📋"))
      .catch(() => toast.error("Failed to copy link."));
  };
  // Initialize WebSocket connection and game data
  useEffect(() => {

    ws.current = new WebSocket(`ws://localhost:8000/ws`)
    let interval: ReturnType<typeof setInterval>

    ws.current.onopen = () => {
      console.log("WebSocket connection opened")
    }

    ws.current.onmessage = (event) => {
      console.log("Received:", event.data)
      try {
        const data = JSON.parse(event.data)

        if (data.title === "gameInit") {
          setGameData(data.message)
          gameInit(data.message)
          interval = setInterval(() => {
            getGameData()
          }, 100)



          // Initialize rounds history

        }

        if (data.title === "question") {
          setQuestion(data.message.question)
          setRound(data.message.number)
          setRound(data.message.number - 1)

          // Update rounds history with new question

        }

        if (data.title === "submitResponse") {
          handleSubmitResponse(data.message)
        }

        if (data.title === "gameData") {
          setGameData(data.message)
          if (data.message.status === "completed") {
            setShowGameCompleteModal(true)
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error)
      }
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    ws.current.onclose = () => {
      console.log("WebSocket connection closed")
      // navigate("/home")
    }

    return () => {
      if (ws.current) ws.current.close()
      clearInterval(interval)
    }
  }, [])

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
    if (response) {
      toast.success("Correct answer!  🎉")
      changeBackgroundColor("bg-green-500")
      setTimeout(() => { console.log("hi") }, 200)
      resetBackgroundColor("bg-green-500")
    } else {
      toast.error("Wrong answer!  ❌")
      changeBackgroundColor("bg-red-500")
      setTimeout(() => { console.log("hi") }, 200)
      resetBackgroundColor("bg-red-500")
    }
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = false
    }
  }

  const handleSubmit = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const submitPayload = {
        title: "submit",
        message: expression,
      }
      ws.current.send(JSON.stringify(submitPayload))
      console.log("Sent message:", submitPayload)
    } else {
      console.error("WebSocket is not open.")
    }
    setExpression("")
  }

  const gameInit = async (data: any) => {
    try {
      const response1 = await axios.get(`http://localhost:8000/api/player/${data.player_one}`)
      setPlayer1(response1.data)

      const response2 = await axios.get(`http://localhost:8000/api/player/${data.player_two}`)
      setPlayer2(response2.data)
    } catch (error) {
      console.error("Error fetching player data:", error)
    }
  }

  const handleExpressionChange = (newExpression: string) => {
    setExpression(newExpression)

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const submitPayload = {
        title: "expression",
        message: newExpression,
      }
      ws.current.send(JSON.stringify(submitPayload))
      console.log("Sent message:", submitPayload)
    } else {
      console.error("WebSocket is not open.")
    }
  }

  const getGameData = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const submitPayload = {
        title: "gameData",
        message: "hi",
      }
      ws.current.send(JSON.stringify(submitPayload))
    }
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

    <div className="bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center overflow-hidden h-screen flex flex-col">
      <GameCompletionModal
        isOpen={showGameCompleteModal}
        onClose={() => setShowGameCompleteModal(false)}
        player1={{ username: player1.username, rating: player1.rating, uid: player1.uid, ratingChange: gameData.player1ratingchanges }}
        player2={{ username: player2.username, rating: player2.rating, uid: player2.uid, ratingChange: gameData.player2ratingchanges }}
        winner={gameData.winner}
        uid={uid}
        navigate={navigate}
        page="gamearea"

      />
      {/* Logo and Header */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca9e464b944ab22129b2e7d0da766b29064e4364"
        alt="Company Logo"
        className="absolute left-6 h-[37px] top-[20px] w-[31px] z-10"
      />
      <Header></Header>


      {/* Game Status Bar */}
      {/* Game Status Bar */}
      <div className="bg-black/60 backdrop-blur-sm border-b border-green-400/20 py-2 px-4 flex items-center justify-center">
        <div className="flex justify-evenly w-full items-center gap-3 text-white">
          <span className="font-bold text-lg flex items-center gap-2 ">
            ROUND: <span className="text-green-400">{uid == player1.uid ? gameData.player1curround : gameData.player2curround}</span> /5
          </span>

          <span className="font-bold text-lg flex items-center gap-2 ml-[350px]">
            ROUND: <span className="text-red-400">{uid !== player1.uid ? gameData.player1curround : gameData.player2curround}</span> /5
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center text-white">
        {/* Players Section */}
        <div className="w-full max-w-5xl flex flex-wrap justify-between gap-4 mt-8">
          {renderPlayer(uid == player1.uid ? player1 : player2, "green", uid == player1.uid ? gameData.player1points : gameData.player2points)}
          {renderPlayer(uid !== player1.uid ? player1 : player2, "red", uid !== player1.uid ? gameData.player1points : gameData.player2points)}
        </div>

        {/* Current Question Section */}
        <motion.div
          className="mt-2  mb-8 text-center"
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

        {/* Player Expressions
        <div className="w-full max-w-4xl flex flex-wrap justify-between gap-4 mt-8">
          <div className="w-full md:w-[48%] bg-black/30 backdrop-blur-sm rounded-xl border border-green-400/20 p-3">
            <div className="text-center mb-2">
              <div className="text-green-400 text-sm font-semibold">PLAYER 1 EXPRESSION</div>
            </div>
            <div className="text-center text-white text-lg font-mono truncate">
              {gameData.player1expression || "..."}
            </div>
          </div>

          <div className="w-full md:w-[48%] bg-black/30 backdrop-blur-sm rounded-xl border border-red-400/20 p-3">
            <div className="text-center mb-2">
              <div className="text-red-400 text-sm font-semibold">PLAYER 2 EXPRESSION</div>
            </div>
            <div className="text-center text-white text-lg font-mono truncate">
              {gameData.player2expression || "..."}
            </div>
          </div>
        </div> */}

        {/* Input Section */}
        <motion.div
          className="w-full max-w-md flex flex-col justify-center items-center "
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div className="w-full flex justify-center gap-2 items-center" whileHover={{ scale: 1.02 }}>
            <div className="relative">
              <Input
                className="text-center w-[360px] pl-4 ml-24 mr-10 h-[50px] rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white text-xl bg-black/50 border-white"
                placeholder="Type your Expression..."
                value={expression}
                onChange={(e) => handleExpressionChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit()
                  }
                }}
              />
            </div>
            <div className="flex justify-center mt-2">
          <button
            onClick={copySpectatorLink}
            className="px-4 py-2 text-sm font-semibold bg-gray-400 text-black rounded-full hover:bg-green-500 transition-all"
          >
            <Clipboard></Clipboard>
          </button>
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

                {(uid == player1.uid ? gameData.player1questions : gameData.player2questions).map((somedata, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-[1fr_1fr_1fr] gap-4 items-center p-3 ${index === round
                      ? "bg-green-900/20 border-l-4 border-l-green-500"
                      : index < round
                        ? "bg-black/40"
                        : "bg-black/20"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center">{getSymbol(index)}</div>
                      <span className="font-medium text-white">{index}</span>
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
                          <span className="font-mono text-green-100 ml-2">{uid == player1.uid ? gameData.player1solves[index] : gameData.player2solves[index]}</span>
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

