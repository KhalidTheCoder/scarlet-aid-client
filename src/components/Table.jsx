import React from "react";
import {
  User,
  Droplet,
  MapPin,
  CalendarDays,
  Clock3,
  ShieldCheck,
  Info,
} from "lucide-react";

const Table = ({
  columns,
  data,
  currentPage = 1,
  limit = 5,
  emptyMessage = "No data found.",
}) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 hidden lg:block">
        <table className="table table-zebra text-sm min-w-full">
          <thead className="text-lg">
            <tr>
              <th>#</th>
              {columns.map((col) => (
                <th key={col.accessor}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-medium">
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={row._id || index}>
                  <th>{(currentPage - 1) * limit + index + 1}</th>
                  {columns.map((col) => (
                    <td key={col.accessor}>
                      {typeof col.cell === "function"
                        ? col.cell(row[col.accessor], row)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center font-semibold text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden mt-4">
        {data.length > 0 ? (
          data.map((row, index) => (
            <div
              key={row._id || index}
              className="relative p-4 rounded-xl bg-white font-medium border border-base-300 shadow-sm transition-all hover:shadow-md"
            >
              <p className="absolute top-2 right-3 text-sm text-gray-400 font-semibold">
                #{(currentPage - 1) * limit + index + 1}
              </p>

              <div className="space-y-2 text-sm text-gray-700">
                {columns.map((col) => {
                  const value =
                    typeof col.cell === "function"
                      ? col.cell(row[col.accessor], row)
                      : row[col.accessor];

                  let Icon = Info;
                  const lowerHeader = col.header.toLowerCase();
                  if (lowerHeader.includes("name")) Icon = User;
                  else if (lowerHeader.includes("blood")) Icon = Droplet;
                  else if (
                    lowerHeader.includes("location") ||
                    lowerHeader.includes("district")
                  )
                    Icon = MapPin;
                  else if (lowerHeader.includes("date")) Icon = CalendarDays;
                  else if (lowerHeader.includes("time")) Icon = Clock3;
                  else if (lowerHeader.includes("status")) Icon = ShieldCheck;

                  return (
                    <div key={col.accessor} className="flex items-start gap-2">
                      <Icon className="w-5 h-5 mt-0.5 text-black" />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-600">
                          {col.header}:{" "}
                        </span>
                        <span>
                          {col.header.toLowerCase() === "status" ? (
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold 
                          ${
                            value === "done"
                              ? "bg-green-100 text-green-600"
                              : value === "canceled"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                            >
                              {value}
                            </span>
                          ) : (
                            value
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Table;
