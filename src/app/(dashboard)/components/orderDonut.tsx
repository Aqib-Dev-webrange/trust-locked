"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import React from "react";
import StatusCard from "./statusCard";

Chart.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Pending", "Shipped", "Delivered", "Canceled", "Confirm"],
  datasets: [
    {
      data: [10, 20, 30, 15, 25], // Replace with your actual data
      backgroundColor: [
        "#3B82F6", // blue-500
        "#6366F1", // indigo-500
        "#10B981", // green-500
        "#EF4444", // red-500
        "#A21CAF", // purple-700
      ],
      borderWidth: 0,
    },
  ],
};


const options = {
  cutout: "70%", // Makes it a donut
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
};

const centerText = {
  id: "centerText",
  afterDraw: (chart: Chart<"doughnut">) => {
    const { ctx } = chart;
    ctx.save();
    ctx.font = "bold 20px Poppins, sans-serif";
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Confirm", chart.width / 2, chart.height / 2 - 10);
    ctx.font = "bold 24px Poppins, sans-serif";
    ctx.fillText("40%", chart.width / 2, chart.height / 2 + 20);
    ctx.restore();
  },
};

export default function OrderStatusDonut() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <StatusCard label="Order Status" count={2000} />
      </div>
      <div className="w-full flex items-center gap-4 min-w-[300px] border p-4 rounded-lg bg-white shadow-sm">
        <div className="flex flex-col  mt-4 gap-2 ">
          <div className="flex items-center gap-2 p-1 rounded bg-[#F2F2F7]">
            <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
            <span className="text-xs">Pending</span>
          </div>
          <div className="flex items-center gap-2 p-1 rounded bg-[#F2F2F7] px-2">
            <span className="w-3 h-3 rounded bg-indigo-500 inline-block" />
            <span className="text-xs">Shipped</span>
          </div>
          <div className="flex items-center gap-2 p-1 rounded bg-[#F2F2F7] px-2">
            <span className="w-3 h-3 rounded bg-green-500 inline-block" />
            <span className="text-xs">Delivered</span>
          </div>
          <div className="flex items-center gap-2 p-1 rounded bg-[#F2F2F7] px-2">
            <span className="w-3 h-3 rounded bg-red-500 inline-block" />
            <span className="text-xs">Canceled</span>
          </div>
          <div className="flex items-center gap-2 p-1 rounded bg-[#F2F2F7] px-2">
            <span className="w-3 h-3 rounded bg-purple-700 inline-block" />
            <span className="text-xs">Confirm</span>
          </div>
        </div>
        <div className="w-64 h-64">
          <Doughnut data={data} options={options} plugins={[centerText]} />
        </div>
      </div>
  </div>
    
  );
}