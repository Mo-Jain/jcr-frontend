"use client"
import Link from "next/link"
import StarryBackground from "./starry-background"
import ThemeBg from "./theme-bg";
import { useUserStore } from "@/lib/store";


export const TopSection = () => {
    const {name} = useUserStore();
    return (
        <div>
            <section className="dark:bg-black bg-white relative overflow-hidden py-12 sm:py-20">
                
                {/* <RayBg className="absolute top-0 left-0 dark:w-0 transition-all duration-300 h-full"/> */}
                
                {/* Background Components */}
                <div className="absolute inset-0 -z-1">
                    <StarryBackground />
                    <ThemeBg />
                </div>
                <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none w-full h-full bg-primary dark:bg-black opacity-10 dark:opacity-60  "/>
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h1 className="sm:text-4xl text-2xl font-bold [text-shadow:_0_8px_8px_rgb(103_103_110_/_0.8)] text-gray-900 dark:text-gray-200 mb-4"
                        style={{ fontFamily: "var(--font-alma), sans-serif" }}>
                        SEAMLESS CAR BOOKINGS
                    </h1>
                    <p className="sm:text-xl text-sm text-muted-foreground mb-8">
                        Manage your car rentals with ease using our intuitive booking scheduler.
                    </p>
                    {
                        name ?
                        <Link
                            href="/bookings"
                            className="bg-primary max-sm:text-sm text-primary-foreground px-3 sm:px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition duration-300"
                        >
                            Start Booking Now
                        </Link>
                        :
                        <div>
                            <Link
                                href="/login"
                                className="bg-primary max-sm:text-sm text-primary-foreground px-3 sm:px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition duration-300"
                            >
                                Get Started
                            </Link>

                        </div>
                    }
                    </div>
                </div>
            </section>

        </div>
    )
} 