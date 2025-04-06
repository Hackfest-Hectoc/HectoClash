import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Navbar from "../navbar/navbar";

export default function GameSelect() {


    const navigate = useNavigate();


    const handleGameModeClick = (mode: string) => {
        // Navigate to the respective game mode route
        navigate(`/${mode.toLowerCase().replace(/\s+/g, '-')}`);
    };

        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.2
                }
            }
        };
    
        const itemVariants = {
            hidden: { y: 50, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.6, ease: "easeOut" }
            },
            hover: {
                scale: 1.05,
                transition: { duration: 0.2 }
            },
            tap: {
                scale: 0.95
            }
        };
    return (
        <div className="flex bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center h-screen overflow-hidden ">
        <Navbar/>
        <div className="w-full h-screen overflow-hidden  border border-solid border-black">
            <div className="h-screen  flex flex-col items-center">
                <motion.div 
                    className="flex flex-wrap justify-center items-center content-center gap-8 m-8 h-full mx-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* YOU VS BOT */}
                    <motion.div 
                        className="w-[382px] h-[230px] rounded-[19px] overflow-hidden bg-gradient-to-r from-[#d7682c] to-[#983703] flex flex-col items-center justify-center text-center max-lg:w-[300px] max-lg:h-[200px] max-sm:w-[250px] max-sm:h-[180px] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleGameModeClick('gamearea2')}
                    >
                        <motion.img
                            whileHover={{ scale: 1.2 }}
                            className="w-[63px] h-[86px] max-lg:w-[50px] max-lg:h-[70px] max-sm:w-[40px] max-sm:h-[60px]"
                            alt="Vector"
                            src="https://c.animaapp.com/fOFXwWPz/img/vector.svg"
                        />
                        <p className="font-extrabold text-white text-[35px] mt-4 max-lg:text-[28px] max-sm:text-[20px]">
                            Duels Drag and Drop
                        </p>
                    </motion.div>

                    <motion.div 
                        className="w-[371px] h-[227px] rounded-[19px] overflow-hidden bg-gradient-to-r from-[#2cd773] to-[#0c5f31] flex flex-col items-center justify-center text-center max-lg:w-[300px] max-lg:h-[200px] max-sm:w-[250px] max-sm:h-[180px] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleGameModeClick('practice')}
                    >
                        <motion.img
                            whileHover={{ scale: 1.2 }}
                            className="w-[69px] h-[76px] max-lg:w-[50px] max-lg:h-[50px] max-sm:w-[40px] max-sm:h-[40px]"
                            alt="Vector"
                            src="https://c.animaapp.com/fOFXwWPz/img/vector-2.svg"
                        />
                        <p className="font-extrabold text-white text-[35px] mt-4 max-lg:text-[28px] max-sm:text-[20px]">
                            Practice
                        </p>
                    </motion.div>

                    {/* ONLINE DUELS */}
                    <motion.div 
                        className="w-[377px] h-[230px] rounded-[19px] overflow-hidden bg-gradient-to-r from-[#d72cb2] to-[#54074e] flex flex-col items-center justify-center text-center max-lg:w-[300px] max-lg:h-[200px] max-sm:w-[250px] max-sm:h-[180px] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleGameModeClick('gamearea')}
                    >
                        <motion.img
                            whileHover={{ scale: 1.2 }}
                            className="w-[65px] h-[62px] max-lg:w-[50px] max-lg:h-[50px] max-sm:w-[40px] max-sm:h-[40px]"
                            alt="Vector"
                            src="https://c.animaapp.com/fOFXwWPz/img/vector-1.svg"
                        />
                        <p className="font-extrabold text-white text-[35px] mt-4 max-lg:text-[28px] max-sm:text-[20px]">
                            ONLINE DUELS
                        </p>
                    </motion.div>

                    {/* BATTLE ROYALE */}
                    <motion.div 
                        className="w-[371px] h-[227px] rounded-[19px] overflow-hidden bg-gradient-to-r from-[#2cd773] to-[#0c5f31] flex flex-col items-center justify-center text-center max-lg:w-[300px] max-lg:h-[200px] max-sm:w-[250px] max-sm:h-[180px] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleGameModeClick('battleroyale')}
                    >
                        <motion.img
                            whileHover={{ scale: 1.2 }}
                            className="w-[69px] h-[76px] max-lg:w-[50px] max-lg:h-[50px] max-sm:w-[40px] max-sm:h-[40px]"
                            alt="Vector"
                            src="https://c.animaapp.com/fOFXwWPz/img/vector-2.svg"
                        />
                        <p className="font-extrabold text-white text-[35px] mt-4 max-lg:text-[28px] max-sm:text-[20px]">
                            BATTLE ROYALE
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
        </div>
    );
}