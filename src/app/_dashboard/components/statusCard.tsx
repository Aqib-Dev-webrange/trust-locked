import React from "react";

interface StatusCardProps {
  icon?: React.ReactNode;
  label: string;
  count: number;
  color?: string; // Tailwind color class like "bg-blue-500"
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, label, count, color }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl py-8 px-4 flex flex-col border items-start gap-6 min-w-[350px]">
      {icon && (
        <div className={`rounded-full p-2 ${color ?? "bg-gray-800"} text-white`}>
          <span className="text-2xl">{icon}</span>
        </div>
      )}
      <div className="flex flex-col items-start gap-2">
        <h3 className="text-[38px] font-semibold leading-none">{count}</h3>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatusCard;
