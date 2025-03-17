'use client';
import React, { useEffect } from "react"
import { useMediaQuery } from "react-responsive";

const SkeletonPreLoader = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 400 });

  useEffect(() => {
    document.documentElement.classList.add("no-scroll");

    return () => {
      document.documentElement.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div style={{ zIndex: 99 }}
    className="flex fixed top-[81px] sm:top-[58px] left-0 overflow-hidden scrollbar-hide flex-col z-0 bg-blue-200 dark:bg-black items-center w-full p-2">
        <div className="max-h-[300px] my-0 relative py-12 sm:py-20 w-full ">
          {!isSmallScreen ?   
            <>
            <div className="w-[600px] h-[42px] mx-auto max-sm:w-[350px] max-sm:h-[30px] bg-black/5 dark:bg-white/15  rounded-full mb-4  animate-pulse"/>
            <div className="w-[800px] h-[25px] mx-auto max-sm:w-[380px] max-sm:h-[10px] bg-black/5 dark:bg-white/15 rounded-full mb-2 animate-pulse"/>
            <div className="w-[300px] h-[25px] mx-auto max-sm:w-[200px] max-sm:h-[10px] bg-black/5 dark:bg-white/15 rounded-full mb-6 animate-pulse"/>
            <div className="w-[200px] h-[50px] mx-auto max-sm:w-[140px] max-sm:h-[36px] bg-black/5 dark:bg-white/15 rounded-sm animate-pulse"/>
            </>
            :
            <>
              <div className=" w-[220px] h-[30px] mx-auto bg-black/5 dark:bg-white/15 rounded-full mb-2  animate-pulse"/>
              <div className=" w-[150px] h-[30px] mx-auto bg-black/5 dark:bg-white/15 rounded-full mb-4 animate-pulse"/>
              <div className=" w-[300px] h-[10px] mx-auto bg-black/5 dark:bg-white/15 rounded-full mb-2 animate-pulse"/>
              <div className=" w-[250px] h-[10px] mx-auto bg-black/5 dark:bg-white/15 rounded-full mb-2 animate-pulse"/>
              <div className=" w-[100px] h-[10px] mx-auto bg-black/5 dark:bg-white/15 rounded-full mb-6 animate-pulse"/>
              <div className=" w-[140px] h-[36px] mx-auto bg-black/5 dark:bg-white/15 rounded-sm animate-pulse"/>
            </>
            }
        </div>
        <div className="py-6 bg-white w-full h-full bg-opacity-30 dark:bg-opacity-10 rounded-t-md backdrop-blur-lg sm:px-4 px-2">
            <div className="flex justify-between items-center sm:px-4 px-2 mb-4">
                <div className="flex gap-2">
                  <div
                    className="sm:text-3xl text-xl animate-pulse font-black font-myfont w-[130px] h-[40px] max-sm:w-[65px] max-sm:h-[28px] bg-black/5 dark:bg-white/15 rounded-sm"
                  >
                  </div>
                  <div
                    className="sm:text-3xl text-xl animate-pulse font-black font-myfont w-[150px] h-[40px] max-sm:w-[85px] max-sm:h-[28px] bg-black/5 dark:bg-white/15 rounded-sm"
                  >
                  </div>
                </div>
                
                <div
                  className=" rounded-sm bg-black/5 animate-pulse dark:bg-white/15 hover:bg-opacity-80 w-[120px] h-[40px] max-sm:w-[89px] max-sm:h-[36px]"
                >
                </div>
            </div>
            <div className="flex items-center gap-2 w-full px-4 mt-2 border-b border-border pb-3 mb-1">
              <div className="flex items-center gap-1 text-sm">
                <span
                  className="h-2 w-2 sm:h-3 sm:w-3 animate-pulse flex justify-center items-center text-xs p-1 text-center bg-black/5 dark:bg-white/15 text-white rounded-full shadow-sm font-extrabold"
                  ></span>
                  <span className="w-[92px] h-[21px] animate-pulse bg-black/5 dark:bg-white/15 rounded-full"></span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span
                className="h-2 w-2 sm:h-3 sm:w-3 flex animate-pulse justify-center items-center text-xs p-1 text-center bg-black/5 dark:bg-white/15 text-white rounded-full shadow-sm font-extrabold"
                ></span>
                  <span className="w-[80px] h-[21px] animate-pulse bg-black/5 dark:bg-white/15 rounded-full"></span>
              </div>
            </div>
            <div
                className="grid z-0 grid-cols-2 mt-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 "
              >
                 <div className="w-full  rounded-lg p-2 bg-white/50 dark:bg-white/10 h-fit">
                    <div className="border relative overflow-hidden skeleton border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-lg flex-shrink-0 h-24 sm:h-44"/>
                    <div className="flex flex-col items-center justify-center gap-2 p-2 sm:p-4 h-fit">
                      <div className="w-[140px] h-[30px] max-sm:w-[110px] max-sm:h-[17px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                      <div className="w-[160px] h-[30px] max-sm:w-[95px] max-sm:h-[19px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                    </div>
                </div>

                <div className="w-full  rounded-lg p-2 bg-white/50 dark:bg-white/10 h-fit">
                    <div className="border relative overflow-hidden skeleton border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-lg flex-shrink-0 h-24 sm:h-44"/>
                    <div className="flex flex-col items-center justify-center gap-2 p-2 sm:p-4 h-fit">
                      <div className="w-[140px] h-[30px] max-sm:w-[110px] max-sm:h-[17px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                      <div className="w-[160px] h-[30px] max-sm:w-[95px] max-sm:h-[19px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                    </div>
                </div>

                <div className="w-full  rounded-lg p-2 bg-white/50 dark:bg-white/10 h-fit">
                    <div className="border relative overflow-hidden skeleton border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-lg flex-shrink-0 h-24 sm:h-44"/>
                    <div className="flex flex-col items-center justify-center gap-2 p-2 sm:p-4 h-fit">
                      <div className="w-[140px] h-[30px] max-sm:w-[110px] max-sm:h-[17px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                      <div className="w-[160px] h-[30px] max-sm:w-[95px] max-sm:h-[19px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                    </div>
                </div>

                <div className="w-full  rounded-lg p-2 bg-white/50 dark:bg-white/10 h-fit">
                    <div className="border relative overflow-hidden skeleton border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-lg flex-shrink-0 h-24 sm:h-44"/>
                    <div className="flex flex-col items-center justify-center gap-2 p-2 sm:p-4 h-fit">
                      <div className="w-[140px] h-[30px] max-sm:w-[110px] max-sm:h-[17px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                      <div className="w-[160px] h-[30px] max-sm:w-[95px] max-sm:h-[19px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                    </div>
                </div>
                <div className="w-full  rounded-lg p-2 bg-white/50 dark:bg-white/10 h-fit">
                    <div className="border relative overflow-hidden skeleton border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-lg flex-shrink-0 h-24 sm:h-44"/>
                    <div className="flex flex-col items-center justify-center gap-2 p-2 sm:p-4 h-fit">
                      <div className="w-[140px] h-[30px] max-sm:w-[110px] max-sm:h-[17px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                      <div className="w-[160px] h-[30px] max-sm:w-[95px] max-sm:h-[19px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                    </div>
                </div>
                <div className="w-full  rounded-lg p-2 bg-white/50 dark:bg-white/10 h-fit">
                    <div className="border relative overflow-hidden skeleton border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-lg flex-shrink-0 h-24 sm:h-44"/>
                    <div className="flex flex-col items-center justify-center gap-2 p-2 sm:p-4 h-fit">
                      <div className="w-[140px] h-[30px] max-sm:w-[110px] max-sm:h-[17px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                      <div className="w-[160px] h-[30px] max-sm:w-[95px] max-sm:h-[19px] bg-black/5 dark:bg-white/5 rounded-full animate-pulse"/>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
};

export default SkeletonPreLoader;
