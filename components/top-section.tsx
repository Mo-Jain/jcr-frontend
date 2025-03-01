"use client";
import StarryBackground from "./starry-background";
import ThemeBg from "./theme-bg";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export const TopSection = () => {
  const { name } = useUserStore();
  const router = useRouter();
  return (
    <div>
      <section className="bg-transparent max-h-[300px] my-0 relative overflow-hidden py-12 sm:py-20">
        {/* Background Components */}
          <StarryBackground />
          <ThemeBg />
        <div className="container mx-auto px-4 h-fit">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1
              className="sm:text-4xl text-2xl font-bold [text-shadow:_0_8px_8px_rgb(103_103_110_/_0.8)] text-gray-900 dark:text-gray-200 mb-4"
              style={{ fontFamily: "var(--font-alma), sans-serif" }}
            >
              SEAMLESS CAR BOOKINGS
            </h1>
            <p className="sm:text-xl text-sm mb-8">
              Manage your car rentals with ease using our intuitive booking
              scheduler.
            </p>
            {name ? (
              <div className="flex justify-center items-center bg-transparent">
                <div
                  onClick={() => router.push("/bookings")}
                  className="bg-white/20 hover:bg-white/40 dark:hover:bg-white/30 max-w-[220px] bg-opacity-20 backdrop-blur-md cursor-pointer shadow-xl max-sm:text-sm text-foreground px-3 sm:px-6 py-3 rounded-sm font-semibold transition duration-300"
                >
                  <span className="text-foreground">
                    Start Booking Now
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center bg-transparent">
                <div
                  onClick={() => router.push("/login")}
                  className="bg-white/20 hover:bg-white/40 dark:hover:bg-white/30 max-w-[220px] bg-opacity-20 backdrop-blur-md cursor-pointer shadow-xl max-sm:text-sm text-foreground px-3 sm:px-6 py-3 rounded-sm font-semibold transition duration-300"
                >
                  Get Started
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
