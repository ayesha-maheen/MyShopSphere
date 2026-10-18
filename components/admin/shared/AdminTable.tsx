"use client";

import type { ReactNode } from "react";

export type AdminTableColumn<T> = {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
  className?: string;
};

type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string | number;
  loading?: boolean;
  loadingText?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  minWidth?: string;
};

export default function AdminTable<T>({
  columns,
  data,
  getRowKey,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There is no data to display.",
  emptyIcon,
  minWidth = "700px",
}: AdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7E0EF] bg-white">
      {loading ? (
        <div
          className="overflow-x-auto"
          role="status"
          aria-label="Loading table data"
        >
          <table
            className="w-full text-left text-sm"
            style={{ minWidth }}
          >
            <thead className="bg-[#F8F5FC] text-[#65528A]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 font-semibold ${column.className ?? ""}`}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0EBF5]">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr
                  key={`skeleton-row-${rowIndex}`}
                  className="animate-pulse"
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.key}
                      className={`px-6 py-5 ${column.className ?? ""}`}
                    >
                      <div
                        className={`h-4 rounded-md bg-[#EDE7F5] ${
                          columnIndex === 0
                            ? "w-14"
                            : columnIndex === 1
                              ? "w-28"
                              : columnIndex === 2
                                ? "w-36"
                                : "w-20"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center p-10 text-center">
          {emptyIcon && (
            <div className="mb-3 text-[#B8A4E3]">
              {emptyIcon}
            </div>
          )}

          <p className="font-semibold text-[#292335]">
            {emptyTitle}
          </p>

          <p className="mt-1 text-sm text-[#827A8D]">
            {emptyDescription}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-sm"
            style={{ minWidth }}
          >
            <thead className="bg-[#F8F5FC] text-[#65528A]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 font-semibold ${column.className ?? ""}`}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0EBF5]">
              {data.map((item) => (
                <tr
                  key={getRowKey(item)}
                  className="transition hover:bg-[#FCFAFE]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 ${column.className ?? ""}`}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}