import Loader from "./loader";

export default function LoadingScreen() {
  return (
    <div className=" bg-muted dark:bg-black ">
      <div className="flex space-x-2 justify-center items-center w-screen h-screen">
          <Loader/>
      </div>
    </div>
  );
}
