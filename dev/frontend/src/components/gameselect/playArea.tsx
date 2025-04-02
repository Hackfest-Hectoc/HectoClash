import { useState } from "react";
import { Bolt, MessageSquare, Clock } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";


export default function MathGame() {
  const [expression, setExpression] = useState("");
  const [input, setInput] = useState('')
  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)", backgroundSize: "cover" }}
    >
      {/* Top bar */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Bolt className="text-green-500" />
        <MessageSquare className="text-yellow-500" />
        <span className="text-lg font-bold">4</span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-sm">A</span>
          <span>ayush7233</span>
          <span className="text-yellow-400">1007</span>
        </div>
        <Clock className="text-green-500" />
      </div>

      {/* Players */}
      <div className="flex gap-12 mt-12">
        <div className="text-center">
          <span className="bg-red-600 px-3 py-1 rounded-full text-lg font-bold">A</span>
          <div className="mt-2">You</div>
          <div className="text-yellow-400">1097</div>
        </div>
        <div className="text-center">
          <span className="bg-gray-500 px-3 py-1 rounded-full text-lg font-bold">G</span>
          <div className="mt-2">Guest</div>
          <div className="text-yellow-400">1020</div>
        </div>
      </div>

      {/* Number sequence */}
      <div className="flex gap-4 text-3xl mt-12">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex flex-row   items-center">
            6
            <span className="w-6 h-6 border-2 border-gray  mt-1 ml-2"></span>
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="mt-8 w-1/2 flex flex-col items-center justify-center ">
        <Input
          className="text-center w-[420px] p-2 text-lg border-2 border focus:ring-green-400 focus:ring-0 bg-black/50"
          placeholder="Type your Expression.."
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
        <div className="p-3">
            <Link to="/" >
        <Button variant="outline" className="mt-5 text-2xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-[none] border-b-green-600 h-[55px] text-black w-[431px] max-sm:w-full max-sm:max-w-[411px] hover:bg-green-600 transition-colors">Submit</Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
