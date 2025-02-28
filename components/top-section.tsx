"use client";
import Link from "next/link";
import StarryBackground from "./starry-background";
import ThemeBg from "./theme-bg";
import { useUserStore } from "@/lib/store";

export const TopSection = () => {
  const { name } = useUserStore();
  return (
    <div>
      <section className="bg-blue-200  my-0 dark:bg-[#181818] relative overflow-hidden py-12 sm:py-20">
        {/* Background Components */}
        <div className="absolute inset-0 dark:opacity-50 -z-1">
          <StarryBackground />
          <ThemeBg />
        </div>
        <div className="container mx-auto px-4">
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
              <Link
                href="/bookings"
                className="bg-primary shadow-xl max-sm:text-sm text-white px-3 sm:px-6 py-3 rounded-sm font-semibold hover:bg-primary/90 transition duration-300"
              >
                Start Booking Now
              </Link>
            ) : (
              <div>
                <Link
                  href="/login"
                  className="bg-primary shadow-xl max-sm:text-sm text-white px-3 sm:px-6 py-3 rounded-sm font-semibold hover:bg-primary/90 transition duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
