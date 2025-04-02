import React from "react";

export default function Gameselect() {
    return (
        <div className="w-full h-screen overflow-hidden bg-black border border-solid border-black">
            <div className="h-screen bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center flex flex-col items-center">
                {/* Header */}
                <div className="w-full h-[88px] bg-black border border-solid border-[#818181] flex flex-wrap items-center justify-between px-12">
                    {/* Left Section: Logo and Viewers */}
                    <div className="flex items-center gap-4 mb-2 max-sm:mb-0">
                        <img
                            className="w-12 h-12 object-cover"
                            alt="Logo"
                            src="https://c.animaapp.com/fOFXwWPz/img/image-5@2x.png"
                        />
                        <p className="text-white text-sm">
                            Viewers: <span className="font-bold">2044</span>
                        </p>
                    </div>

                    {/* Right Section: Players */}
                    <div className="flex items-center gap-4 mb-2 max-sm:mb-0">
                        <img
                            className="w-12 h-12 object-cover"
                            alt="Players"
                            src="https://c.animaapp.com/fOFXwWPz/img/image-11@2x.png"
                        />
                        <p className="text-white text-sm">
                            Players: <span className="font-bold">2044</span>
                        </p>
                    </div>

                    {/* Extra Section: Additional Logo */}
                    <div className="flex items-center gap-4">
                        <img
                            className="w-12 h-12 object-cover"
                            alt="Logo"
                            src="https://c.animaapp.com/fOFXwWPz/img/image-5@2x.png"
                        />
                        <p className="text-white text-sm">
                            <span>Ayush12</span> <br /><span className="font-bold">2044</span>
                        </p>
                    </div>
                </div>

                {/* Game Modes */}
                <div className="flex flex-wrap justify-center items-center content-center gap-8 m-8 h-full mx-4 ">
                    {/* YOU VS BOT */}
                    <div className="w-[382px] h-[230px] rounded-[19px] overflow-hidden bg-gradient-to-r from-[#d7682c] to-[#983703] flex flex-col items-center justify-center text-center max-lg:w-[300px] max-lg:h-[200px] max-sm:w-[250px] max-sm:h-[180px]">
                        <img
                            className="w-[63px] h-[86px] max-lg:w-[50px] max-lg:h-[70px] max-sm:w-[40px] max-sm:h-[60px]"
                            alt="Vector"
                            src="https://c.animaapp.com/fOFXwWPz/img/vector.svg"
                        />
                        <p className="font-extrabold text-white text-[35px] mt-4 max-lg:text-[28px] max-sm:text-[20px]">
                            YOU VS BOT
                        </p>
                    </div>

                    {/* ONLINE DUELS */}
                    <div className="w-[377px] h-[230px] rounded-[19px] overflow-hidden bg-gradient-to-r from-[#d72cb2] to-[#54074e] flex flex-col items-center justify-center text-center max-lg:w-[300px] max-lg:h-[200px] max-sm:w-[250px] max-sm:h-[180px]">
                        <img
                            className="w-[65px] h-[62px] max-lg:w-[50px] max-lg:h-[50px] max-sm:w-[40px] max-sm:h-[40px]"
                            alt="Vector"
                            src="https://c.animaapp.com/fOFXwWPz/img/vector-1.svg"
                        />
                        <p className="font-extrabold text-white text-[35px] mt-4 max-lg:text-[28px] max-sm:text-[20px]">
                            ONLINE DUELS
                        </p>
                    </div>

                    {/* BATTLE ROYALE */}
                    <div className="w-[371px] h-[227px] rounded-[19px] overflow-hidden bg-gradient-to-r from-[#2cd773] to-[#0c5f31] flex flex-col items-center justify-center text-center max-lg:w-[300px] max-lg:h-[200px] max-sm:w-[250px] max-sm:h-[180px]">
                        <img
                            className="w-[69px] h-[76px] max-lg:w-[50px] max-lg:h-[50px] max-sm:w-[40px] max-sm:h-[40px]"
                            alt="Vector"
                            src="https://c.animaapp.com/fOFXwWPz/img/vector-2.svg"
                        />
                        <p className="font-extrabold text-white text-[35px] mt-4 max-lg:text-[28px] max-sm:text-[20px]">
                            BATTLE ROYALE
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}