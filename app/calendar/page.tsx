import Header from "@/components/header/Header";
import MainView from "@/components/MainView";

export default async function Home() {
  return (
    <div className="scrollbar-hide h-screen bg-white/90 dark:bg-black/90 backdrop-blur-xl">
      <Header />
      <MainView />
    </div>
  );
}
