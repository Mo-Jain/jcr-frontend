"use client";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import DownArrow from "@/public/down-arrow.svg";
import { useMediaQuery } from "react-responsive";

const smoothScrollTo = (targetY: number, duration: number = 600) => {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // Keep progress between 0 and 1
    window.scrollTo(0, startY + difference * progress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

export const TopSection = () => {
  const { name } = useUserStore();
  const router = useRouter();
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });

  const handleDownArrow = () => {
    const scrollY = window.scrollY;
    const end = isSmallScreen ? 110 : 200;
    const duration = 200 * (200 - scrollY) / end;
    smoothScrollTo(end,duration);
  }
  return (
    <div>
      <section className="dark:bg-black/20  my-0 relative overflow-hidden py-12 sm:py-16">
        {/* Background Components */}
          
        <div className="container mx-auto px-4 h-fit ">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1
              className="sm:text-4xl text-2xl font-bold [text-shadow:_0_8px_8px_rgb(103_103_110_/_0.8)] text-gray-900 dark:text-gray-200 mb-4"
              style={{ fontFamily: "var(--font-alma), sans-serif" }}
            >
              SEAMLESS CAR BOOKINGS TRACKING
            </h1>
            
            {name ? (
              <div className="flex justify-center mt-8 items-center bg-transparent">
                <div
                  onClick={handleDownArrow}
                  className=" p-2 cursor-pointer rounded-full bg-blue-400 bg-opacity-40"
                >
                  <div
                  className="p-3 flex items-center  rounded-full bg-blue-400 hover:bg-blue-500 active:scale-95 text-white">
                    <DownArrow className="h-6 w-6 fill-white" />
                  </div>

                </div>
              </div>
            ) : (
              <>
                <p 
                  style={{ fontFamily: "var(--font-alma), sans-serif" }}
                  className="sm:text-lg text-xs mb-6 text-gray-500 dark:text-gray-400">
                    Manage your car rentals with ease using our intuitive booking
                    scheduler.
                </p>
                <div className="flex justify-center items-center bg-transparent">
                  <div
                    onClick={() => router.push("/auth")}
                    className="bg-white/20 hover:bg-white/40 dark:hover:bg-white/30 max-w-[220px] bg-opacity-20 backdrop-blur-md cursor-pointer shadow-xl max-sm:text-sm text-foreground px-3 sm:px-6 py-3 rounded-sm font-semibold transition duration-300"
                  >
                    Get Started
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
