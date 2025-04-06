import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, Trophy, Clock, Target, CheckCircle, XCircle, Zap, Award, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '../navbar/navbar';
import axios from 'axios';

// Initial dummy data


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

function GameHistoryModal({ game, onClose, currentUserId }) {
  const isPlayerOne = game.player_one_id === currentUserId;
  const opponent = isPlayerOne ? game.player_two_id : game.player_one_id;
  const isWinner = game.winner_id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="border border-green-400/30 rounded-xl p-6 max-w-4xl w-full mx-4 bg-black/80"
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
            <div className="text-green-400">vs {opponent}</div>
            <div className={`px-3 py-1 rounded-full ${isWinner ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isWinner ? 'WIN' : 'LOSS'}
            </div>
          </div>

          <div className="border-t border-green-400/20 pt-4">
            <h4 className="text-green-400 mb-4">Questions & Solutions</h4>
            <div className="space-y-2">
              {game.questions.map((question, index) => (
                <div key={index} className="bg-green-400/10 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <span className="text-green-400">Q{index + 1}:</span>
                      <span className="text-white ml-2">{ isPlayerOne ? player1questions[index] : player2questions[index]  }</span>
                    </div>
                    <div className="col-span-6">
                      <span className="text-green-400">A{index + 1}:</span>
                      <span className="text-white ml-2">{isPlayerOne ? player1solves[index] : player2solves[index]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Test() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  function getCookie(name) {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
    return cookieValue ? decodeURIComponent(cookieValue) : "";
  }
  const [playerData, setPlayerData] = useState({
    username: "ProGamer123",
    userid: "2323",
    rating: 1750,
    time: 120,
    solves: 50,
    wrongsolves: 10,
    totalwins: 30,
    games: [
      {
        id: 1,
        player_one_id: "2323",
        player_two_id: "opponent1",
        winner_id: "2323",
        timestamp: new Date().getTime(),
        player1questions: [
          "What is the time complexity of QuickSort?",
          "Explain how a hash table works",
        ],
        player1solves: [
          "O(n log n) average case, O(n²) worst case",
          "Hash tables use a hash function to map keys to array indices",
        ],
        player2questions: [
          "What is the time complexity of QuickSort?",
          "Explain how a hash table works",
        ],
        player2solves: [
          "O(n log n) average case, O(n²) worst case",
          "Hash tables use a hash function to map keys to array indices",
        ]
      },
      {
        id: 2,
        player_one_id: "opponent2",
        player_two_id: "2323",
        winner_id: "opponent2",
        timestamp: new Date().getTime() - 86400000, // 1 day ago
        questions: [
          "What is recursion?",
          "Explain merge sort",
          "What is a binary tree?",
          "How does a stack work?",
          "What is a queue?"
        ],
        solutions: [
          "A function that calls itself",
          "Divide and conquer sorting algorithm",
          "Tree with at most 2 children per node",
          "LIFO data structure",
          "FIFO data structure"
        ]
      }
    ],
    ratings: [
      { timestamp: new Date().getTime() - 172800000, rating: 1700 }, // 2 days ago
      { timestamp: new Date().getTime() - 86400000, rating: 1725 },  // 1 day ago
      { timestamp: new Date().getTime(), rating: 1750 }              // now
    ]
    });

    const solutionsData = [
      { name: 'Correct', value: playerData.solves, color: '#4ade80' },
      { name: 'Wrong', value: playerData.wrongsolves, color: '#f87171' }
    ];
    const matchesData = [
      { name: 'Wins', value: playerData.totalwins, color: '#4ade80' },
      { name: 'Losses', value: playerData.games.length - playerData.totalwins, color: '#f87171' }
    ];

  useEffect(() => {
    const uid = getCookie("uid");
    setCurrentUserId(uid || "2323"); // Use dummy ID if no cookie
    
    const fetchPlayerInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/player/profile/${uid}`);
        // Update player data with API response
        // playerData = response.data;
        // console.log(playerData)
        
        // Update statistics
        setPlayerData(response.data);
        // solutionsData[0].value = playerData.solves;
        // solutionsData[1].value = playerData.wrongsolves;
        
        // const totalGames = playerData.games.length;
        // matchesData[0].value = playerData.totalwins;
        // matchesData[1].value = totalGames - playerData.totalwins;
      } catch (error) {
        console.error('Error fetching player info:', error);
        // Keep using dummy data if API fails
      }
    };

    fetchPlayerInfo();
  }, []);

  return (
    <div className='flex bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center'>
      <Navbar />
      <div className="min-h-screen text-white p-2 w-full">
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
                <StatCard 
                  icon={Clock} 
                  title="Avg. Solve Time" 
                  value={playerData.solves + playerData.wrongsolves > 0 
                    ? Math.round(playerData.time/(playerData.solves + playerData.wrongsolves)) 
                    : 0} 
                />
                <StatCard icon={Target} title="Total Solves" value={playerData.solves} />
                <StatCard 
                  icon={Award} 
                  title="Accuracy" 
                  value={playerData.solves > 0 
                    ? Math.round((playerData.solves / (playerData.solves + playerData.wrongsolves)) * 100) + '%'
                    : '0%'} 
                />
                <StatCard icon={Trophy} title="Total Matches" value={playerData.games.length} />
              </div>

              {/* Rating History Graph */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-sm p-4 rounded-xl border border-green-400/30"
              >
                <h2 className="text-lg font-bold mb-4 text-green-400">Rating History</h2>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={playerData.ratings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        scale="time"
                        stroke="#6ee7b7"
                        tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d, HH:mm')}
                      />
                      <YAxis stroke="#6ee7b7" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(74, 222, 128, 0.3)',
                          borderRadius: '8px',
                        }}
                        labelFormatter={(timestamp) => format(new Date(timestamp), 'PPpp')}
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
                      <PieChart>
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
                  {playerData.games.map((game) => {
                    const isPlayerOne = game.player_one_id === currentUserId;
                    const opponent = isPlayerOne ? game.player_two_id : game.player_one_id;
                    const isWinner = game.winner_id === currentUserId;
                    
                    return (
                      <motion.div
                        key={game.id}
                        className="p-3 hover:bg-green-400/5 cursor-pointer"
                        onClick={() => setSelectedGame(game)}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isWinner ? 'bg-green-400' : 'bg-red-400'}`} />
                            <div className="text-white">vs {opponent}</div>
                            <div className="text-gray-400 text-sm">
                              {format(new Date(game.timestamp), 'MMM d, HH:mm')}
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-green-400" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedGame && (
            <GameHistoryModal 
              game={selectedGame} 
              onClose={() => setSelectedGame(null)} 
              currentUserId={currentUserId}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Test;