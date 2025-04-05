import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Header() {
    const [viewers, setViewers] = useState(0);
    const [players, setPlayers] = useState(0);

    useEffect(() => {
        fetchViewers();
        fetchPlayers();
    }, []);

    const fetchViewers = () => {
        // Placeholder function to fetch viewers
        setViewers(2044); // Replace with actual API call
    };

    const fetchPlayers = () => {
        // Placeholder function to fetch players
        setPlayers(2044); // Replace with actual API call
    };

    const headerVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };


    return (
        <div className="w-full ">

                <motion.div
                    className="w-full h-[11vh] bg-green-300/20  backdrop-blur-sm  shadow-lg shadow-green-300/20 flex flex-wrap items-center justify-between px-12  pl-20 max-md:px-8 border-r-2 border-b-[4px]  border-green-300/20 rounded-b-md"
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Left Section: Logo and Viewers */}
                    <div className="flex items-center gap-4 max-sm:mb-0">
                        <motion.img
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-12 h-12 object-cover"
                            alt="Logo"
                            src="https://c.animaapp.com/fOFXwWPz/img/image-5@2x.png"
                        />
                        <motion.p
                            className="text-white text-sm"
                            whileHover={{ scale: 1.1 }}
                        >
                            Viewers: <span className="font-bold">{viewers}</span>
                        </motion.p>
                    </div>

                    {/* Right Section: Players */}
                    <div className="flex items-center gap-4 max-sm:mb-0">
                        <motion.img
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-12 h-12 object-cover"
                            alt="Players"
                            src="https://c.animaapp.com/fOFXwWPz/img/image-11@2x.png"
                        />
                        <motion.p
                            className="text-white text-sm"
                            whileHover={{ scale: 1.1 }}
                        >
                            Players: <span className="font-bold">{players}</span>
                        </motion.p>
                    </div>

                    {/* Extra Section: Additional Logo */}
                    <div className="flex items-center gap-4">
                        <motion.img
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-12 h-12 object-cover"
                            alt="Logo"
                            src="https://c.animaapp.com/fOFXwWPz/img/image-5@2x.png"
                        />
                        <motion.p
                            className="text-white text-sm"
                            whileHover={{ scale: 1.1 }}
                        >
                            <span>Ayush12</span> <br /><span className="font-bold">2044</span>
                        </motion.p>
                    </div>
                </motion.div>

           </div>
    );
}