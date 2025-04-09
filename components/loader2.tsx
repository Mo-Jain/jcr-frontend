import React from "react";

const Loader2 = () => {
  return (
       <div className="flex items-end py-1 h-full">
            <span className="sr-only">Loading...</span>
            <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.4s]"></div>
            <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.2s]"></div>
            <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY"></div>
        </div>
  );
};

export default Loader2;
