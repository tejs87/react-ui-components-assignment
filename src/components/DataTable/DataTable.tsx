import React, { useState } from "react";

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // ✅ Sorting logic
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    const newDirection = sortColumn === column.key && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column.key);
    setSortDirection(newDirection);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[columns.find(c => c.key === sortColumn)!.dataIndex];
    const valB = b[columns.find(c => c.key === sortColumn)!.dataIndex];
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // ✅ Selection logic
  const toggleRow = (id: string | number, row: T) => {
    const updated = new Set(selectedRows);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedRows(updated);
    if (onRowSelect) {
      const selected = data.filter((item) => updated.has(item.id));
      onRowSelect(selected);
    }
  };

  // ✅ Handle loading state
  if (loading) {
    return <p className="p-4 text-center">Loading...</p>;
  }

  // ✅ Handle empty state
  if (data.length === 0) {
    return <p className="p-4 text-center">No data available</p>;
  }

  return (
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          {selectable && <th className="p-2 border">Select</th>}
          {columns.map((col) => (
            <th
              key={col.key}
              className="p-2 border cursor-pointer"
              onClick={() => handleSort(col)}
            >
              {col.title}
              {col.sortable && sortColumn === col.key && (
                <span>{sortDirection === "asc" ? " 🔼" : " 🔽"}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={row.id} className="odd:bg-white even:bg-gray-50">
            {selectable && (
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.has(row.id)}
                  onChange={() => toggleRow(row.id, row)}
                />
              </td>
            )}
            {columns.map((col) => (
              <td key={col.key} className="p-2 border">
                {String(row[col.dataIndex])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
