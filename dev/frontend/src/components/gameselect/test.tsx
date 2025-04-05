import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, Trophy, Clock, Target, CheckCircle, XCircle, Zap, Award, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '../navbar/navbar';
import { div } from 'framer-motion/client';

// Mock data with Unix timestamps
const playerData = {
  username: "ProGamer123",
  rating: 1850,
  stats: {
    avgSolveTime: "2m 15s",
    totalSolves: 324,
    rightSubs: 289,
    wrongSubs: 35,
    accuracy: "89%",
    wins: 45,
    losses: 12,
    totalMatches: 57
  },
  ratingHistory: [
    { timestamp: 1709283200000, rating: 1500 }, // 2024-03-01 10:00:00
    { timestamp: 1709650200000, rating: 1580 }, // 2024-03-05 15:30:00
    { timestamp: 1710068400000, rating: 1650 }, // 2024-03-10 12:00:00
    { timestamp: 1710520200000, rating: 1720 }, // 2024-03-15 18:45:00
    { timestamp: 1710924900000, rating: 1680 }, // 2024-03-20 09:15:00
    { timestamp: 1711374400000, rating: 1750 }, // 2024-03-25 14:20:00
    { timestamp: 1711797000000, rating: 1850 }  // 2024-03-30 11:30:00
  ],
  gameHistory: [
    {
      id: 1,
      opponent: "CodeMaster",
      date: "2024-03-15",
      result: "win",
      score: "3-2",
      questions: ["Array Sum", "Binary Search", "Tree Traversal"],
      solutions: ["O(n)", "O(log n)", "O(n)"]
    },
    {
      id: 2,
      opponent: "AlgoNinja",
      date: "2024-03-14",
      result: "loss",
      score: "2-3",
      questions: ["Graph DFS", "Dynamic Programming", "Heap Sort"],
      solutions: ["O(V+E)", "O(n²)", "O(n log n)"]
    }
  ]
};

// Prepare data for pie charts
const solutionsData = [
  { name: 'Correct', value: playerData.stats.rightSubs, color: '#4ade80' },
  { name: 'Wrong', value: playerData.stats.wrongSubs, color: '#f87171' }
];

const matchesData = [
  { name: 'Wins', value: playerData.stats.wins, color: '#4ade80' },
  { name: 'Losses', value: playerData.stats.losses, color: '#f87171' }
];

function StatCard({ icon: Icon, title, value, color = "green" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`backdrop-blur-sm border border-${color}-400/30 rounded-xl p-3`}
    >
      <div className={`text-${color}-400 flex items-center gap-2 mb-1`}>
        <Icon size={16} />
        {title}
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
    </motion.div>
  );
}

function GameHistoryModal({ game, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="border border-green-400/30 rounded-xl p-6 max-w-2xl w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Game Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-green-400">vs {game.opponent}</div>
            <div className={`px-3 py-1 rounded-full ${game.result === 'win' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {game.result.toUpperCase()}
            </div>
          </div>
          
          <div className="border-t border-green-400/20 pt-4">
            <h4 className="text-green-400 mb-2">Questions & Solutions</h4>
            {game.questions.map((q, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-green-400/10">
                <div className="text-white">{q}</div>
                <div className="text-green-400">{game.solutions[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Test() {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className='flex bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center '>
        <Navbar></Navbar>
    <div className="min-h-screen  text-white p-2 w-full">
      <div className="max-w-full mx-auto space-y-4">
        {/* Player Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4 backdrop-blur-sm p-4 rounded-xl border border-green-400/30"
        >
          <div className="bg-green-600 w-16 h-16 rounded-full text-2xl font-bold shadow-lg flex items-center justify-center border-2 border-green-400">
            {playerData.username[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <User size={20} className="text-green-400" />
              {playerData.username}
            </h1>
            <div className="text-green-400 font-semibold flex items-center gap-2">
              <Zap size={16} />
              Rating: {playerData.rating}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Stats and Charts */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <StatCard icon={Clock} title="Avg. Solve Time" value={playerData.stats.avgSolveTime} />
              <StatCard icon={Target} title="Total Solves" value={playerData.stats.totalSolves} />
              <StatCard icon={Award} title="Accuracy" value={playerData.stats.accuracy} />
              <StatCard icon={Target} title="Total Matches" value={playerData.stats.totalMatches} />
            </div>

            {/* Rating History Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className=" backdrop-blur-sm p-4 rounded-xl border border-green-400/30"
            >
              <h2 className="text-lg font-bold mb-4 text-green-400">Rating History</h2>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={playerData.ratingHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="timestamp"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      scale="time"
                      stroke="#6ee7b7"
                      tickFormatter={(timestamp) => format(timestamp, 'MMM d, HH:mm')}
                    />
                    <YAxis stroke="#6ee7b7" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(timestamp) => format(timestamp, 'PPpp')}
                    />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#4ade80"
                      strokeWidth={2}
                      dot={{ fill: '#4ade80' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Pie Charts */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-sm p-4 rounded-xl border border-green-400/30"
              >
                <h2 className="text-lg font-bold mb-2 text-green-400">Solutions Distribution</h2>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart className='text-white'>
                      <Pie
                        data={solutionsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {solutionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(74, 222, 128, 0.3)',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-sm p-4 rounded-xl border border-green-400/30"
              >
                <h2 className="text-lg font-bold mb-2 text-green-400">Match Results</h2>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={matchesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {matchesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(74, 222, 128, 0.3)',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Game History */}
          <div className="col-span-12 lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-transparent backdrop-blur-sm rounded-xl border border-green-400/30 overflow-hidden h-full"
            >
              <div className="p-3 border-b border-green-400/20">
                <h2 className="text-lg font-bold text-green-400">Recent Games</h2>
              </div>
              <div className="divide-y divide-green-400/20">
                {playerData.gameHistory.map((game) => (
                  <motion.div
                    key={game.id}
                    className="p-3 hover:bg-green-400/5 cursor-pointer"
                    onClick={() => setSelectedGame(game)}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${game.result === 'win' ? 'bg-green-400' : 'bg-red-400'}`} />
                        <div className="text-white">vs {game.opponent}</div>
                        <div className="text-gray-400 text-sm">{game.date}</div>
                      </div>
                      <ChevronRight size={16} className="text-green-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedGame && (
          <GameHistoryModal game={selectedGame} onClose={() => setSelectedGame(null)} />
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}

export default Test;