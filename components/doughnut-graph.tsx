'use client'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useMemo } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { cn } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutGraph = ({ className, data }: { className?: string, data: number[] }) => {
    const isSingleValue = data.includes(0); // Check if one of the values is 0

    const chartData = useMemo(() => {
        return {
            datasets: [
                {
                    data: data,
                    backgroundColor: ['#15d42b', '#4385e8'],
                    borderColor: ['#15d42b', '#4385e8'],
                    borderWidth: 1,
                },
            ],
        };
    }, [data]);

    const options = {
        cutout: '65%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
            datalabels: {
                display: !isSingleValue, // Hide labels if one value is 0
                color: "white",
                font: {
                    weight: 900,
                    size: 14,
                    family: 'intern',
                },
            }
        },
    }

    return (
        <div className={cn("relative flex items-center justify-center h-20 w-20 rounded-full", className)}>
            <Doughnut className='w-full h-fit' data={chartData} options={options} />
            <div className="absolute top-[25%] left-[35%] h-fit flex items-center justify-center rounded-full ">
                <div className="text-center">
                    <div className="text-xl font-bold m-0 h-fit">{data[0] + data[1]}</div>
                    <div className="text-[10px] -mt-1 text-muted-foreground">Total</div>
                </div>
            </div>
        </div>
    )
};

export default DoughnutGraph;
