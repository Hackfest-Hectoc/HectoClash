import { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./header";
import axios from "axios";
// import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Lock, HelpCircle } from "lucide-react";
import { div } from "framer-motion/client";

interface RoundData {
  question: string;
  solved: string;
}

export default function Spectator() {
  const [currentRound, setCurrentRound] = useState(3);
  const [expression, setExpression] = useState("");
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
  });
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState("666666");
  const [player1, setPlayer1] = useState({ username: "Anubhab", rating: 0 });
  const [player2, setPlayer2] = useState({ username: "Sagnik", rating: 0 });
  const ws = useRef<WebSocket | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}/ws`);
    let interval: ReturnType<typeof setInterval>;

    ws.current.onopen = () => console.log("WebSocket connection opened");
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.title === "gameInit") {
          setGameData(data.message);
          gameInit(data.message);
          interval = setInterval(() => getGameData(), 100);
        }
        if (data.title === "question") {
          setQuestion(data.message.question);
          setRound(data.message.number);
        }
        if (data.title === "submitResponse") {
          handleSubmitResponse(data.message);
        }
        if (data.title === "gameData") {
          setGameData(data.message);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
      }
    };
    ws.current.onerror = (error) => console.error("WebSocket error", error);
    ws.current.onclose = () => console.log("WebSocket connection closed");

    return () => {
      ws.current?.close();
      clearInterval(interval);
    };
  }, []);

  const changeBackgroundColor = (color: string) => {
    if (submitButtonRef.current) {
      submitButtonRef.current.classList.remove("bg-green-300");
      submitButtonRef.current.classList.add(color);
    }
  };

  const resetBackgroundColor = (color: string) => {
    if (submitButtonRef.current) {
      submitButtonRef.current.classList.remove(color);
      submitButtonRef.current.classList.add("bg-green-300");
    }
  };

  const handleSubmitResponse = (response: boolean) => {
    changeBackgroundColor(response ? "bg-green-500" : "bg-red-500");
    setTimeout(
      () => resetBackgroundColor(response ? "bg-green-500" : "bg-red-500"),
      200
    );
    if (submitButtonRef.current) submitButtonRef.current.disabled = false;
  };

  const handleSubmit = () => {
    if (submitButtonRef.current) submitButtonRef.current.disabled = true;
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ title: "submit", message: expression }));
    }
  };

  const handleExpressionChange = (val: string) => {
    setExpression(val);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ title: "expression", message: val }));
    }
  };

  const getGameData = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ title: "gameData", message: "hi" }));
    }
  };

  const roundsData: RoundData[] = [
    { question: "123456", solved: "ABCDEF" },
    { question: "234567", solved: "BCDEFG" },
    { question: "345678", solved: "CDEFGH" },
    { question: "456789", solved: "DEFGHI" },
    { question: "567890", solved: "EFGHIJ" },
    { question: "567890", solved: "EFGHIJ" },
  ];

  const getSymbol = (roundIndex: number) => {
    if (roundIndex < currentRound) {
      return <CheckCircle2 className="text-green-500" size={20} />;
    } else if (roundIndex === currentRound) {
      return <Circle className="text-white animate-pulse" size={20} />;
    } else {
      return <Lock className="text-white" size={20} />;
    }
  };

  const gameInit = async (data: any) => {
    try {
      const p1 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/player/${data.player_one}`
      );
      const p2 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/player/${data.player_two}`
      );
      setPlayer1(p1.data);
      setPlayer2(p2.data);
    } catch (err) {
      console.error("Failed to fetch player info", err);
    }
  };

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
            className="flex items-center justify-center w-12 h-12 bg-transparent rounded-lg shadow-md border-[3px] border"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );

  const renderPlayer = (player: any, color: string, points: number) => (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <motion.span
        className={`bg-${color}-600 px-4 py-2 rounded-full text-2xl font-bold shadow-lg relative top-[-10px]`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {player.username[0]}
      </motion.span>
      <div className={`inline-block text-${color}-600 font-bold`}>
        <motion.div
          className="px-2 text-l font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {player.username}
        </motion.div>
        <motion.div
          className={`px-2 text-l text-${color}-400 font-semibold`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {player.rating}
        </motion.div>
      </div>
      <motion.div
        className={`pb-1 text-${color}-400 border-[3px] border-${color}-300 text-center text-3xl font-bold mt-2 bg-${color}-300/30 rounded-md px-4 w-[140px]`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {points}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center h-screen  ">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca9e464b944ab22129b2e7d0da766b29064e4364"
        alt="Logo"
        className="absolute left-6 h-[37px] top-[18px] w-[31px] z-10"
      />
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 h-[89vh]">
        <div className=" flex flex-col items-center  gap-4 pt-4 ">
          {renderPlayer(player1, "green", gameData.player1points)}
          <div className="font-bold text-4xl py-3 text-white">
            Round: {round}
          </div>
          {renderQuestion(gameData.player2question)}
          <motion.div
            className="w-full max-w-md flex flex-col justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div className="w-full p-2" whileHover={{ scale: 1.02 }}>
              <Input
                className="text-center w-full pb-4 h-[43px]  rounded-lg focus:ring-2 focus:ring-green-400 focus:border-0 text-white text-2xl"
                placeholder="typing..."
                value={expression}
                onChange={(e) => handleExpressionChange(e.target.value)}
              />
            </motion.div>
          </motion.div>

          <div className="w-full bg-black bg-opacity-70 backdrop-blur-sm border border-green-600 ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className=" justify-end rounded-xl w-full max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-[auto_1fr_1fr] gap-2 font-medium text-green-400 px-4 py-2 bg-black bg-opacity-50 rounded-t-lg">
                <div>Round</div>
                <div className="ml-2">Question</div>
                <div className="ml-2">Solution</div>
              </div>

                {/* Rounds Data */}

              <div className="flex flex-col gap-1 mt-1 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
                {roundsData.map((round, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-[auto_1fr_1fr] gap-4 items-center p-2 rounded-lg ${
                      index === currentRound
                        ? "bg-green-900/20 border border-green-800/30"
                        : index < currentRound
                        ? "bg-black/40"
                        : "bg-black/20"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {getSymbol(index)}
                      </div>
                      <span className="font-medium text-white">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 ml-2">
                      <HelpCircle className="text-green-400" size={18} />
                      <span className="font-mono text-green-100">
                        {index <= currentRound ? round.question : "------"}
                      </span>
                    </div>

                    <div>
                      {index < currentRound ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle2 className="text-green-500" size={18} />
                          <span className="font-mono text-green-100">
                            {round.solved}
                          </span>
                        </motion.div>
                      ) : (
                        <span className="flex gap-2 font-mono text-gray-400">
                          {getSymbol(index)} ------
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <div className=" flex flex-col items-center  gap-4 pt-4 ">
          {renderPlayer(player1, "green", gameData.player1points)}
          <div className="font-bold text-4xl py-3 text-white">
            Round: {round}
          </div>
          {renderQuestion(gameData.player2question)}
          <motion.div
            className="w-full max-w-md flex flex-col justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div className="w-full p-2" whileHover={{ scale: 1.02 }}>
              <Input
                className="text-center w-full pb-4 h-[43px]  rounded-lg focus:ring-2 focus:ring-green-400 focus:border-0 text-white text-2xl"
                placeholder="typing..."
                value={expression}
                onChange={(e) => handleExpressionChange(e.target.value)}
              />
            </motion.div>
          </motion.div>

          <div className="w-full bg-black bg-opacity-70 backdrop-blur-sm border border-green-600 ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className=" justify-end rounded-xl w-full max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-[auto_1fr_1fr] gap-2 font-medium text-green-400 px-4 py-2 bg-black bg-opacity-50 rounded-t-lg">
                <div>Round</div>
                <div className="ml-2">Question</div>
                <div className="ml-2">Solution</div>
              </div>

              <div className="flex flex-col gap-1 mt-1 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
                {roundsData.map((round, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-[auto_1fr_1fr] gap-4 items-center p-2 rounded-lg ${
                      index === currentRound
                        ? "bg-green-900/20 border border-green-800/30"
                        : index < currentRound
                        ? "bg-black/40"
                        : "bg-black/20"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {getSymbol(index)}
                      </div>
                      <span className="font-medium text-white">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 ml-2">
                      <HelpCircle className="text-green-400" size={18} />
                      <span className="font-mono text-green-100">
                        {index <= currentRound ? round.question : "------"}
                      </span>
                    </div>

                    <div>
                      {index < currentRound ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle2 className="text-green-500" size={18} />
                          <span className="font-mono text-green-100">
                            {round.solved}
                          </span>
                        </motion.div>
                      ) : (
                        <span className="flex gap-2 font-mono text-gray-400">
                          {getSymbol(index)} ------
                        </span>
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
  );
}
