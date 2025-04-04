import { useState, useEffect, useRef } from "react";
import { Bolt, MessageSquare, Clock } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./header";

export default function MathGame() {
  const [expression, setExpression] = useState("");
  const [gameData, setGameData] = useState({
    string: "",
    player_one: "Anubhab",
    player_two: "Sagnik",
    status: "",
    player1expression: "",
    player2expression: "",
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
    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.current.onmessage = (event) => {
      console.log("Received:", event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.title === "gameInit") {
          setGameData(data.message);
          gameInit(data.message);
          interval = setInterval(() => {
            getGameData();
          }, 100);
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
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.current) ws.current.close();
      clearInterval(interval);
    };
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getGameData();
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, []);

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
    if (response) {
      changeBackgroundColor("bg-green-500");
      setTimeout(() => resetBackgroundColor("bg-green-500"), 200);
    } else {
      changeBackgroundColor("bg-red-500");
      setTimeout(() => resetBackgroundColor("bg-red-500"), 200);
    }
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = false;
    }
  };

  const handleSubmit = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const submitPayload = {
        title: "submit",
        message: expression,
      };
      ws.current.send(JSON.stringify(submitPayload));
      console.log("Sent message:", submitPayload);
    } else {
      console.error("WebSocket is not open.");
    }
  };

  const gameInit = async (data: any) => {
    try {
      const response1 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/player/${data.player_one}`
      );
      setPlayer1(response1.data);

      const response2 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/player/${data.player_two}`
      );
      setPlayer2(response2.data);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  const handleExpressionChange = (newExpression: string) => {
    setExpression(newExpression);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const submitPayload = {
        title: "expression",
        message: newExpression,
      };
      ws.current.send(JSON.stringify(submitPayload));
      console.log("Sent message:", submitPayload);
    } else {
      console.error("WebSocket is not open.");
    }
  };

  const getGameData = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const submitPayload = {
        title: "gameData",
        message: "hi",
      };
      ws.current.send(JSON.stringify(submitPayload));
      console.log("Sent message:", submitPayload);
    } else {
      console.error("WebSocket is not open.");
    }
  };

  return (
    <div className="bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center overflow-hidden h-screen">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca9e464b944ab22129b2e7d0da766b29064e4364"
        alt="Company Logo"
        className="absolute left-6 h-[37px] top-[25px] w-[31px] z-10"
      />
      <Header></Header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className=" w-full h-screen flex flex-col items-center  text-white "
      >

        {/* Main Content */}
        <main className="mt-16 sm:mt-20 w-full max-w-4xl flex flex-col gap-8 items-center px-4">

          {/* Round Display */}
          <motion.div
            className=" top-32 sm:top-40 transform -translate-x-1/2 text-center mb-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <span className="text-4xl sm:text-6xl font-bold text-green-300 shadow-lg">
              Round <span className="text-white">{round}</span>
            </span>
          </motion.div>
          {/* Score Board */}
          <div className="flex flex-wrap gap-6 sm:gap-12 w-[1400px] justify-around mb-6 mt-8 sm:mb-8">
            <motion.div
              className=""
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Player Initial */}
              <motion.span
                className="bg-green-600 px-4 py-2 rounded-full text-2xl font-bold shadow-lg relative top-[-10px]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {player1.username[0]}
              </motion.span>

              {/* Player Details */}
              <div className="inline-block">
                <motion.div
                  className="px-2 text-l font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {player1.username}
                </motion.div>
                <motion.div
                  className="px-2 text-l text-green-400 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {player1.rating}
                </motion.div>
              </div>

              {/* Player Points */}
              <motion.div
                className=" pb-1 text-green-400 border-[3px] border-green-300 text-center text-3xl font-bold mt-2 bg-green-300/30 rounded-md px-4 w-[140px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {gameData.player1points} 
              </motion.div>
            </motion.div>
                      {/* Question Display */}
          <div className="flex flex-wrap gap-3 sm:gap-4 bg-transparent text-2xl sm:text-3xl mt-[40px] mb-6 sm:mb-8 justify-center ">
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
            <motion.div
              className=""
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Player Initial */}
              <motion.span
                className="bg-red-600 px-4 py-2 rounded-full text-2xl font-bold shadow-lg relative top-[-10px] "
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {player2.username[0]}
              </motion.span>

              {/* Player Details */}
              <div className="inline-block">
                <motion.div
                  className="px-2 text-l font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {player2.username}
                </motion.div>
                <motion.div
                  className="px-2 text-l text-red-400 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {player2.rating}
                </motion.div>
              </div>

              {/* Player Points */}
              <motion.div
                className=" pb-1 text-red-400 text-center text-3xl font-bold mt-2 bg-red-300/30 rounded-md px-4 w-[140px] border-[3px] border-red-400 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {gameData.player1points} 
              </motion.div>
            </motion.div>

          </div>




          {/* Input Section */}
          <motion.div
            className="w-full max-w-md flex flex-col justify-center items-center align-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="w-full"
              whileHover={{ scale: 1.02 }}
            >
              <Input
                className="text-center w-full p-2 h-[45px] sm:p-3   border-[3px]  rounded-lg focus:ring-2 focus:ring-green-400 focus:border-[0px] text-white text-2xl"
                placeholder="Type your Expression..."
                value={expression}
                onChange={(e) => handleExpressionChange(e.target.value)}
              />
            </motion.div>
            <motion.div
              className="w-full mt-4 pt-4 sm:mt-5 flex justify-center"
              whileHover={{ scale: 1.02 }}
            >
              <Button
                ref={submitButtonRef}
                onClick={handleSubmit}
                variant="outline"
                className="text-base sm:text-2xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-[none] border-b-green-600 mt-12 h-[45px] sm:h-[55px] text-black w-full max-w-[381px] hover:bg-green-600 transition-colors"
              >
                Submit
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}

