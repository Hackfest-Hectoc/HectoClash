import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Lock, HelpCircle } from 'lucide-react';
import { div } from 'framer-motion/client';

interface RoundData {
  question: string;
  solved: string;
}

function Test() {
  const [currentRound, setCurrentRound] = useState(3);

  const roundsData: RoundData[] = [
    { question: "123456", solved: "ABCDEF" },
    { question: "234567", solved: "BCDEFG" },
    { question: "345678", solved: "CDEFGH" },
    { question: "456789", solved: "DEFGHI" },
    { question: "567890", solved: "EFGHIJ" },
  ];

  const getSymbol = (roundIndex: number) => {
    if (roundIndex < currentRound) {
      return <CheckCircle2 className="text-green-500" size={20} />;
    } else if (roundIndex === currentRound) {
      return <Circle className="text-black animate-pulse" size={20} />;
    } else {
      return <Lock className="text-black" size={20} />;
    }
  };

  return (
    <div className="m-2 p-2 max-w-[500px] bg-green-300/50 flex items-center justify-center p-4 border-l-2 border-r-2 border-t-2 border-green-900/20 rounded-lg shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 w-full max-w-2xl"
      >

        <div className="">
          <div className="grid grid-cols-[auto_1fr_1fr] gap-2 font-medium text-black px-2 my-1 bg-green-300/70 ">
            <div>Round</div>
            <div className='ml-2'>Question</div>
            <div className='ml-2'>Solution</div>
          </div>

          <div className='flex flex-col gap-2'>
          {roundsData.map((round, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-[auto_1fr_1fr]  gap-4 items-center  p-0.5 rounded-lg bg-gradient-to-r from-[#69c8c1] to-[#a9f99e] text-black h-[40px"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  {getSymbol(index)}
                </div>
                <span className="font-medium text-black">{index + 1}</span>
              </div>

              <div className="flex items-center space-x-2 ml-2">
                <HelpCircle className="text-black" size={20} />
                <span className="font-mono">
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
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span className="font-mono">{round.solved}</span>
                  </motion.div>
                ) : (

                  <span className=" flex gap-2 font-mono text-black">{getSymbol(index)} ------</span>
                )}
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Test;