'use client'

import DoughnutGraph from "@/components/doughnut-graph";

const Page = () => {

   
  return (
    <div className="w-screen h-screen bg-background flex flex-col py-20 items-center">
        <DoughnutGraph data={[2,3]} className="w-20 h-20"/>
    </div>
  )
};

export default Page;
