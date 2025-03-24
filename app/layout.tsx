import "@/app/globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { NavBar } from "@/components/navbar";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/provider";
import Initiate from "@/components/initiate";
import StarryBackground from "@/components/starry-background";
import ThemeBg from "@/components/theme-bg";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jain Car Rentals",
  description: "Track your car bookings with ease",
  icons: "/favicon.png",
};

const teratur = localFont({
  src: "./fonts/teratur-bold.ttf",
  variable: "--font-teratur",
  weight: "100 900",
});

const alcova = localFont({
  src: "./fonts/Alcova-Pro.ttf",
  variable: "--font-alcova",
  weight: "100 900",
});

const xova = localFont({
  src: "./fonts/XOVA-ROUNDED.woff",
  variable: "--font-xova",
  weight: "100 900",
});

const equinox = localFont({
  src: "./fonts/Equinox-Bold.woff",
  variable: "--font-equinox",
  weight: "100 900",
});

const alma = localFont({
  src: "./fonts/AlmaMono-Heavy.ttf",
  variable: "--font-alma",
  weight: "100 900",
});

const borisna = localFont({
  src: "./fonts/Borisna.ttf",
  variable: "--font-borisna",
  weight: "100 900",
});

const leoscar = localFont({
  src: "./fonts/Leoscar.ttf",
  variable: "--font-leoscar",
  weight: "100 900",
});
const pier = localFont({
  src: "./fonts/Pier.otf",
  variable: "--font-pier",
  weight: "100 900",
});

const bigjohnbold = localFont({
  src: "./fonts/BigJohnBold.otf",
  variable: "--font-bigjohnbold",
  weight: "100 900",
});

const bigjohn = localFont({
  src: "./fonts/BigJohn.otf",
  variable: "--font-bigjohn",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${teratur.variable} ${alcova.variable} ${xova.variable} ${equinox.variable} ${alma.variable} ${borisna.variable} ${leoscar.variable} ${pier.variable} ${bigjohnbold.variable} ${bigjohn.variable} antialiased`}
      >
        <Providers>
          <StarryBackground />
          <ThemeBg />
          <Initiate />
          <NavBar />
          <div className="">
            {children}
          </div>
          <BottomNav />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
