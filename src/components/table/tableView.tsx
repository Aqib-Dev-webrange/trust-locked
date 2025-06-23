"use client";
import React from "react";

export interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableViewProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function TableView<T>({ columns, data }: TableViewProps<T>) {
  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`text-left py-4 px-2 text-gray-400 font-semibold text-lg ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="last:border-b-0 hover:bg-gray-50 transition"
              style={{ borderWidth: 1, borderStyle: "dashed", borderColor: "#e5e7eb", borderLeft: "none", borderRight: "none" ,borderBottom: "none"}}
            >
              {columns.map((col, j) => (
                <td key={j} className="py-4 px-2 align-middle">
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row as any)[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}