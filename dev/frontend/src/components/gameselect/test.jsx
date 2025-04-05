// Import the modal at the top of your file
import GameCompletionModal from './modal.jsx';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect } from 'react';
import { useRef } from 'react';


export default function Test() {

// Inside your MathGame component, add state for the modal
const [showGameCompleteModal, setShowGameCompleteModal] = useState(true);
const [gameResults, setGameResults] = useState({
  player1: {
    username: "Anubhab",
    rating: 1200,
    ratingChange: 15
  },
  player2: {
    username: "Sagnik",
    rating: 1150,
    ratingChange: -15
  },
  winner: "Sagnik" // Username of winner
});

// // Add this to your WebSocket message handler to show the modal when game ends


// Add the modal component at the end of your return statement
return (
  <div className="bg-[url(...)] ...">
    {/* All your existing UI */}
    
    {/* Game completion modal */}
    <GameCompletionModal
      isOpen={showGameCompleteModal}
      onClose={() => setShowGameCompleteModal(false)}
      player1={gameResults.player1}
      player2={gameResults.player2}
      winner={gameResults.winner}
    />
  </div>
);
}