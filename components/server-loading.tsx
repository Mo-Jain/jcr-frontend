'use client';
import React, { useState, useEffect } from "react";
import Rocket from './RocketSVG';
import Server from '@/public/server.svg';
import Info from "@/public/info.svg";

const ServerLoading = () => {
    const [timer, setTimer] = useState(45);
    const [showTimer, setShowTimer] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    useEffect(() => {
        // Delay the start of the countdown by 10 seconds
        const delay = setTimeout(() => {
            setShowTimer(true);
        }, 10000);

        return () => clearTimeout(delay);
    }, []);

    useEffect(() => {
        if (showTimer && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [showTimer, timer]);
    return (
        <div style={{ zIndex: 999999 }} className="fixed top-0 left-0 z-10000 bg-white/30 dark:bg-black/20 backdrop-blur-lg flex flex-col items-center justify-center w-screen h-screen">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="absolute top-[-23%] left-[28%] w-24 h-32 flex items-center justify-center">
                        <Rocket className="fill-blue-300 stroke-yellow-600" />
                    </div>
                    <Server className="w-44 h-44 fill-green-400" />
                </div>
                <div className="flex items-center gap-1">
                    {showTimer ? (
                        <>
                            Server is initiating in 
                            <span className="text-green-600 dark:text-green-400"> {timer} secs </span>
                            
                            {/* make tooltip for below components */}
                            <div className="relative">
                                <Info
                                    className="w-4 h-4 fill-blue-400 hover:fill-blue-500 cursor-pointer"
                                    onMouseEnter={() => setTooltipVisible(true)}
                                    onMouseLeave={() => setTooltipVisible(false)}
                                    onClick={() => setTooltipVisible((prev) => !prev)}
                                    />
                                    {tooltipVisible && (
                                        <div className="absolute top-full max-sm:left-[-300%] transform -translate-x-1/2 mt-2 w-48 p-2 text-xs text-white  bg-black/50 dark:bg-white/30 backdrop-blur-lg rounded-md shadow-lg">
                                            Server might take some time to load after inactivity. Please wait for sometime.
                                        </div>
                                        )}
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-blue-600 dark:text-blue-400">Preparing server</span>
                            <div className="flex items-end py-1 h-full">
                                <span className="sr-only">Loading...</span>
                                <div className="h-1 w-1 bg-blue-600 dark:bg-blue-400 mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-1 w-1 bg-blue-600 dark:bg-blue-400 mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-1 w-1 bg-blue-600 dark:bg-blue-400 mx-[2px] border-border rounded-full animate-bounce"></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServerLoading;