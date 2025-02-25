import Header from "@/components/header/Header";
import MainView from "@/components/MainView";


export default async function Home() {
  return (
    <div className="scrollbar-hide">
      <Header />
      <MainView  />
    </div>
  );
}
