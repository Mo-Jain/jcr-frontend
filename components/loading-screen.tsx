
export default function LoadingScreen() {

  return (
    <div className=" bg-muted dark:bg-black ">
      <div className="flex space-x-2 justify-center items-center w-screen h-screen">
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce"></div>
      </div>
    </div>
  );
} 