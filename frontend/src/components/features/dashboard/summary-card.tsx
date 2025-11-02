import React from "react";

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

export default function SummaryCard({ icon, title, value }: SummaryCardProps) {
  return (
    <div className="flex space-x-3 items-start justify-start py-2 px-4 rounded-md border shadow-sm">
      {icon}
      <div>
        <p className="font-medium opacity-50">{title}</p>
        <p className="font-medium text-lg">{value}</p>
      </div>
    </div>
  );
}
