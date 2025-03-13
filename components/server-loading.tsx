'use client';
import React, { useState, useEffect } from "react";
import Rocket from './RocketSVG';
import Server from '@/public/server.svg';

const ServerLoading = () => {
    const [timer, setTimer] = useState(55);

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
                    <div className="absolute top-[-23%] left-[28%] w-24 h-32 flex items-center justify-center">
                        <Rocket rocketStroke="white" className="fill-blue-300 stroke-yellow-600" />
                    </div>
                    <Server className="w-44 h-44 fill-green-400" />
                </div>
                <p>Server is initiating in 
                    <span className="text-green-600 dark:text-green-400"> {timer} secs </span>   
                </p>
              
            </div>
        </div>
    );
};

export default ServerLoading;