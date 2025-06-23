"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";
import type { ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const data = {
  labels: ["City", "City", "City", "City", "City", "City"],
  datasets: [
    {
      label: "Revenue",
      data: [30000, 43000, 18000, 30000, 13000, 70000],
      backgroundColor: [
        "#E5E7EB", // gray-200
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#7C5CFA", // highlight last bar
      ],
      borderRadius: 6,
      barPercentage: 0.6,
      categoryPercentage: 0.6,
    },
  ],
};

const options: ChartOptions<"bar"> = {
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `$${context.parsed.y.toLocaleString()}k`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#6B7280", // gray-500
        font: { size: 16, weight: "bold" as const },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#E5E7EB", // gray-200
      },
      ticks: {
        callback: (value) => `$${Number(value) / 1000}K`,
        color: "#6B7280",
        font: { size: 16, weight: "bold" },
        stepSize: 50000,
      },
      max: 80000,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default function BarChart() {
  return (
    <div className="bg-white rounded-2xl p-6 w-full "  style={{ minHeight: 400 }}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold">Sales By City</h2>
          <p className="text-gray-400 text-sm">View the most sales by the city</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-gray-400 font-semibold">Status</span>
          <span className="font-semibold">By Revenue</span>
          <input
            type="text"
            value="5 Jan 2023 - 3 Feb 2023"
            readOnly
            className="ml-4 px-3 py-1 rounded bg-gray-100 text-gray-500 text-sm outline-none"
            style={{ width: 170 }}
          />
        </div>
      </div>
      <div style={{ height: 300 }} className="w-[700px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}