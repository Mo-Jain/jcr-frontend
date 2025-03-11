'use client';
import React, { useState, useEffect } from "react";
import Rocket from './RocketSVG';
import Server from '@/public/server.svg';

const ServerLoading = () => {
    const [timer, setTimer] = useState(40);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    return (
        <div style={{ zIndex: 999999 }} className="fixed top-0 left-0 z-10000 bg-white/30 dark:bg-black/20 backdrop-blur-lg flex flex-col items-center justify-center w-screen h-screen">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="absolute top-[-15%] left-[32%] w-20 h-28 flex items-center justify-center">
                        <Rocket className="fill-black dark:fill-white stroke-black dark:stroke-white" />
                    </div>
                    <Server className="w-44 h-44 stroke-black dark:stroke-white fill-black dark:fill-white" />
                </div>
                <p>Server is initiating...</p>
                <p>Please wait, server might take 
                    <span className="text-green-600 dark:text-green-400"> {timer} secs </span>   
                    to start
                </p>
            </div>
        </div>
    );
};

export default ServerLoading;