import React from "react";

const Table = ({
  columns,
  data,
  currentPage = 1,
  limit = 5,
  emptyMessage = "No data found.",
}) => {
  return (
    <div className="w-full">
      {/* Table layout for md+ screens */}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 hidden md:block">
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

      {/* Card layout for mobile */}
      <div className="grid gap-4 md:hidden mt-4">
        {data.length > 0 ? (
          data.map((row, index) => (
            <div
              key={row._id || index}
              className="p-4 rounded-lg bg-base-100 shadow border border-base-300"
            >
              <p className="text-sm text-gray-500 mb-2 font-medium">
                #{(currentPage - 1) * limit + index + 1}
              </p>
              {columns.map((col) => (
                <div key={col.accessor} className="text-sm mb-1">
                  <span className="font-medium">{col.header}: </span>
                  <span>
                    {typeof col.cell === "function"
                      ? col.cell(row[col.accessor], row)
                      : row[col.accessor]}
                  </span>
                </div>
              ))}
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
