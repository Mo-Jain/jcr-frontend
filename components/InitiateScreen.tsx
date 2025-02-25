"use client"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const InitiateScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname()
    useEffect(() => {
        // Hide the splash screen after 3 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3200);
        return () => clearTimeout(timer);
        }, []);

    
    if(!isLoading || pathname != '/') return null;



    return (
        <div className="relative">
            <div className="fixed top-0 left-0 z-[999999] w-full h-full flex items-center justify-center bg-black/95 backdrop-blur-sm">
            </div>
        </div>
    )
};

export default InitiateScreen;
