'use client'

// import Loader from '@/components/loader';
// import ServerLoading from "@/components/server-loading";
import SkeletonPreLoader from "@/components/skeleton-loader";


const Page = () => {
  return (
    <div className="">
      {/* <div className="w-32 h-32 -mt-20">
        <ServerLoading/>
      </div> */}
      {/* <Loader/> */}
      <SkeletonPreLoader/>
    </div>
  )
};

export default Page;
