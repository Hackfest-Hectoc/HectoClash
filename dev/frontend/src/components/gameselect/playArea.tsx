import { useState, useEffect, useRef } from "react";
import { Bolt, MessageSquare, Clock } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";

export default function MathGame() {
  const [expression, setExpression] = useState("");
  const [gameData, setGameData] = useState({
    string: "",
    "player-one": "",
    "player-two": "",
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
  const [player1, setPlayer1] = useState({ username: "", rating: 0 });
  const [player2, setPlayer2] = useState({ username: "", rating: 0 });
  const ws = useRef<WebSocket | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null); // Submit button reference

  // Establish WebSocket connection
  useEffect(() => {
    ws.current = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}/ws`);

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.current.onmessage = (event) => {
      console.log("Received:", event.data);
      try {
        const data = JSON.parse(event.data);

        // Check the message title and update state accordingly
        if (data.title === "gameInit") {
          setGameData(data.message);
          gameInit(data.message);
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

    // Cleanup on component unmount
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Fetch game data every 0.1 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getGameData();
    }, 100); // 0.1 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Change background color of the submit button
  const changeBackgroundColor = (color: string) => {
    if (submitButtonRef.current) {
      submitButtonRef.current.classList.remove("bg-green-300");
      submitButtonRef.current.classList.add(color);
    }
  };

  // Reset background color of the submit button
  const resetBackgroundColor = (color: string) => {
    if (submitButtonRef.current) {
      submitButtonRef.current.classList.remove(color);
      submitButtonRef.current.classList.add("bg-green-300");
    }
  };

  // Handle submit response
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

  // Handler to send the expression
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

  // Initialize game data
  const gameInit = async (data: any) => {
    try {
      const response1 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/player/${data["player-one"]}`
      );
      setPlayer1(response1.data);

      const response2 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/player/${data["player-two"]}`
      );
      setPlayer2(response2.data);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  // Handle expression changes
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

  // Fetch game data
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
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: "url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)",
        backgroundSize: "cover",
      }}
    >
      {/* Top bar */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Bolt className="text-green-500" />
        <MessageSquare className="text-yellow-500" />
        <span className="text-lg font-bold">{round}</span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-sm">A</span>
          <span>{player1.username}</span>
          <span className="text-yellow-400">{player1.rating}</span>
        </div>
        <Clock className="text-green-500" />
      </div>

      {/* Players */}
      <div className="flex gap-12 mt-12">
        <div className="text-center">
          <span className="bg-red-600 px-3 py-1 rounded-full text-lg font-bold">A</span>
          <div className="mt-2">{player1.username}</div>
          <div className="text-yellow-400">{gameData.player1points}</div>
        </div>
        <div className="text-center">
          <span className="bg-gray-500 px-3 py-1 rounded-full text-lg font-bold">G</span>
          <div className="mt-2">{player2.username}</div>
          <div className="text-yellow-400">{gameData.player2points}</div>
        </div>
      </div>

      {/* Number sequence */}
      <div className="flex gap-4 text-3xl mt-12">
        {question.split("").map((char, i) => (
          <span key={i} className="flex items-center">
            {char}
            <span className="w-6 h-6 border-2 border-gray mt-1 ml-2"></span>
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="mt-8 w-1/2 flex flex-col items-center justify-center">
        <Input
          className="text-center w-[420px] p-2 text-lg border-2 focus:ring-green-400 focus:ring-0 bg-black/50"
          placeholder="Type your Expression.."
          value={expression}
          onChange={(e) => handleExpressionChange(e.target.value)}
        />
        <div className="p-3">
          <Button
            ref={submitButtonRef}
            onClick={handleSubmit}
            variant="outline"
            className="mt-5 text-2xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-[none] border-b-green-600 h-[55px] text-black w-[431px] max-sm:w-full max-sm:max-w-[411px] hover:bg-green-600 transition-colors"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}