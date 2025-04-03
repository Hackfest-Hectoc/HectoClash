import { useEffect, useState } from "react";

const WEBSOCKET_URL = "wss://your-websocket-server-url"; // Replace with your WebSocket server URL

export function useGameWebSocket() {
  const Backend_Url = import.meta.env.Backend_Url;
  const [socket, setSocket] = (useState < WebSocket) | (null > null);
  const [game, setGame] = useState(null);
  const [opponent, setOpponent] = useState({
    id: "",
    name: "",
    profileImage: "",
    rating: "",
  });
  const [roundDetails, setRoundDetails] = useState(null);
  const [question, setQuestion] = useState("");
  const [expression, setExpression] = useState("");

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket(`${Backend_Url}/game/duelgame`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle incoming messages
      switch (data.type) {
        case "gameinitialised":
          setOpponent((prevOpponent) => ({
            ...prevOpponent,
            id: data.payload.player2id,
          }));
          fetchplayer2Details();
          setQuestion(data.payload.question);
          setGame(data.payload.game);

          break;
        case "gameDetails":
          setGame(data.payload);
          break;
        case "SubmissionDetails":
          if (data.payload.Correctanswer == true) {
            setQuestion(data.payload.newquestion);
          } else {
            console.log("Wrong answer!");
          }
        case "Gamefinished":

          break;
        default:
          console.warn("Unknown message type:", data.type);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);

  // Function to send the answer to the server
  const sendAnswer = (answer) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "submitAnswer",
          payload: answer,
        })
      );
    } else {
      console.error("WebSocket is not open");
    }
  };

  const fetchplayer2Details = async () => {
    try {
      const response = await axios.get(`${Backend_Url}/player`, {
        params: {
          id: opponent,
        },
      });
      setOpponent((prevOpponent) => ({
        ...prevOpponent,
        name: response.data.username,
        profileImage: response.data.profileImage,
        rating: response.data.rating,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const startGame = async () => {};

  const handleSubmit = () => {
    sendAnswer(expression);
    setExpression(""); // Clear input after submission
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center text-white">
      {/* Opponent Details */}
      {opponent && (
        <div className="absolute top-4 right-4">
          <span> {opponent.name}</span>
          <span>{opponent.rating}</span>
          <span>{opponent.profileImage}</span>
        </div>
      )}

      {/* Round Details */}
      {roundDetails && (
        <div className="absolute top-16">
          <span>Round: {roundDetails.roundNumber}</span>
        </div>
      )}

      {/* Question */}
      <div className="mt-8">
        <h2 className="text-2xl">Question: {question}</h2>
      </div>

      {/* Input */}
      <div className="mt-8 w-1/2 flex flex-col items-center justify-center">
        <Input
          className="text-center w-[420px] p-2 text-lg border-2  focus:ring-green-400 focus:ring-0 bg-black/50"
          placeholder="Type your Expression.."
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          variant="outline"
          className="mt-5 text-2xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-[none] border-b-green-600 h-[55px] text-black w-[431px] max-sm:w-full max-sm:max-w-[411px] hover:bg-green-600 transition-colors"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}