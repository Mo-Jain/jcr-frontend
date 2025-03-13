'use client'

// import Loader from '@/components/loader';
import ServerLoading from "@/components/server-loading";


const Page = () => {
  return (
    <div className="flex flex-col z-0 bg-background items-center justify-center w-screen h-screen">
      <div className="w-32 h-32 -mt-20">
        <ServerLoading/>
      </div>
      {/* <Loader/> */}
    </div>
  )
};

export default Page;
