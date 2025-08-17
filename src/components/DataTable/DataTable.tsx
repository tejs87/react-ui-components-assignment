import React from "react";

export type Column<T> = {
  key: string;
  title: string;
  dataIndex: keyof T | string; // allow string OR keyof T
  sortable?: boolean;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (rows: T[]) => void;
};

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = React.useState<T[]>([]);

  const toggleRow = (row: T) => {
    let updated: T[];
    if (selectedRows.includes(row)) {
      updated = selectedRows.filter((r) => r !== row);
    } else {
      updated = [...selectedRows, row];
    }
    setSelectedRows(updated);
    if (onRowSelect) onRowSelect(updated);
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  return (
    <table className="min-w-full border border-gray-300 rounded-md">
      <thead className="bg-gray-100">
        <tr>
          {selectable && <th className="px-4 py-2">Select</th>}
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-2 border-b text-left">
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {selectable && (
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row)}
                  onChange={() => toggleRow(row)}
                />
              </td>
            )}
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2 border-b">
                {/* @ts-ignore to allow loose typing for now */}
                {row[col.dataIndex as keyof T]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
