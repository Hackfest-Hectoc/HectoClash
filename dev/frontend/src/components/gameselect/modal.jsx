import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, ArrowDown, ArrowUp } from 'lucide-react';


const GameCompletionModal = ({ isOpen, onClose, player1, player2, winner,uid,navigate,page }) => {
  if (!isOpen) return null;

  // Determine winner and loser data
  const isPlayer1Winner = winner === player1.id;
  const winnerData = isPlayer1Winner ? player1 : player2;
  const loserData = isPlayer1Winner ? player2 : player1;

  // Calculate new ratings (even though they're passed in separately)
  const winnerNewRating = winnerData.rating + winnerData.ratingChange;
  const loserNewRating = loserData.rating + loserData.ratingChange;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        className="relative z-10 w-full max-w-lg bg-[#0a0a0a]/90 border border-green-400/30 rounded-xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.3 }}
      >
        {/* Header */}
        <div className="bg-black/60 backdrop-blur-sm border-b border-green-400/20 py-4 px-6">
          <h2 className="text-center text-2xl font-bold text-white">Results</h2>
        </div>

        {/* Winner/Loser Display */}
        <div className="flex justify-between px-6 py-4 border-b border-green-400/20">
          <div className="flex flex-col items-center">
            <div className="text-green-400 text-sm font-semibold mb-2 flex items-center gap-2">
              <Trophy size={16} /> WINNER
            </div>
            <motion.div
              className={`bg-green-600 w-12 h-12 rounded-full text-xl font-bold shadow-lg flex items-center justify-center text-white border-2 border-green-400`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {winnerData.username[0]}
            </motion.div>
            <div className="mt-3 text-xl font-bold text-white">{winnerData.username}</div>
          </div>
          {
            uid == winner? (
              <div className="text-green-400 text-2xl font-semibold mb-2 flex items-center gap-2">
                <Trophy size={20} /> YOU WON
              </div>
            ) : (
              <div className="text-red-400 text-2xl font-semibold mb-2 flex items-center gap-2">
                 YOU LOST
              </div>
            )
          }

          <div className="flex flex-col items-center">
            <div className="text-red-400 text-sm font-semibold mb-2">LOSER</div>
            <motion.div
              className={`bg-red-600 w-12 h-12 rounded-full text-xl font-bold shadow-lg flex items-center justify-center text-white border-2 border-red-400`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {loserData.username[0]}
            </motion.div>
            <div className="mt-3 text-xl font-bold text-white">{loserData.username}</div>
          </div>
        </div>

        {/* Rating Information */}
        <div className="px-6 py-2">
          <div className="text-green-400 text-sm font-semibold mb-3 flex items-center gap-2">
            <User size={16} /> PLAYER RATINGS
          </div>

          <div className="bg-black/40 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 text-center py-3 bg-black/50 border-b border-green-400/20">
              <div className="text-green-400 text-sm font-semibold">PLAYER</div>
              <div className="text-green-400 text-sm font-semibold">PREV RATING</div>
              <div className="text-green-400 text-sm font-semibold">CHANGE</div>
              <div className="text-green-400 text-sm font-semibold">NEW RATING</div>
            </div>

            {/* Winner Row */}
            <motion.div 
              className="grid grid-cols-4 text-center py-4 border-b border-green-400/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="font-medium text-white">{winnerData.username}</div>
              <div className="text-white">{winnerData.rating}</div>
              <div className="text-green-400 flex items-center justify-center gap-1">
                <ArrowUp size={16} />
                {winnerData.ratingChange}
              </div>
              <div className="text-green-400 font-medium">{winnerNewRating}</div>
            </motion.div>

            {/* Loser Row */}
            <motion.div 
              className="grid grid-cols-4 text-center py-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="font-medium text-white">{loserData.username}</div>
              <div className="text-white">{loserData.rating}</div>
              <div className="text-red-400 flex items-center justify-center gap-1">
                <ArrowDown size={16} />
                {Math.abs(loserData.ratingChange)}
              </div>
              <div className="text-red-400 font-medium">{loserNewRating}</div>
            </motion.div>
          </div>
        </div>

        {/* Close Button */}
        <div className='flex items-center justify-center'>
        <div className="flex justify-center px-6 pb-6 pt-2">
          <motion.button
            className="mt-5 text-2xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-[none] border-b-green-600 h-[55px] text-black w-[201px] max-sm:w-full max-sm:max-w-[411px] hover:bg-green-600 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.assign(`/${page}`)}
          >
            Play Again 
          </motion.button>
        </div>
        <div className="flex justify-center px-6 pb-6 pt-2 ">
          <motion.button
            className="mt-5 text-2xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-[none] border-b-green-600 h-[55px] text-black w-[201px] max-sm:w-full max-sm:max-w-[411px] hover:bg-green-600 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/home", { replace: true })}
          >
            Home
          </motion.button>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameCompletionModal;