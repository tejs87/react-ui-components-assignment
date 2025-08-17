import React from "react";

type SortDir = "asc" | "desc";

export type Column<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  width?: string; // optional: Tailwind width like "w-40"
  render?: (row: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  selectable?: boolean;
  emptyMessage?: string;
  className?: string;
  onSelectionChange?: (selectedRows: T[]) => void;
};

function compareValues(a: unknown, b: unknown) {
  // numbers
  if (typeof a === "number" && typeof b === "number") return a - b;
  // dates
  const da = a instanceof Date ? a : new Date(String(a));
  const db = b instanceof Date ? b : new Date(String(b));
  if (!isNaN(da.getTime()) && !isNaN(db.getTime())) return da.getTime() - db.getTime();
  // strings (default)
  return String(a ?? "").localeCompare(String(b ?? ""));
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  loading = false,
  selectable = false,
  emptyMessage = "No data",
  className,
  onSelectionChange,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  // reset selection when data changes
  React.useEffect(() => setSelected(new Set()), [data]);

  // notify selection
  React.useEffect(() => {
    if (!onSelectionChange) return;
    const selectedRows = data.filter((r) => selected.has(rowKey(r)));
    onSelectionChange(selectedRows);
  }, [selected, data, rowKey, onSelectionChange]);

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const result = compareValues(a[sortKey], b[sortKey]);
      return sortDir === "asc" ? result : -result;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const allVisibleIds = React.useMemo(() => sortedData.map(rowKey), [sortedData, rowKey]);
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.has(id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        allVisibleIds.forEach((id) => next.delete(id));
      } else {
        allVisibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const onHeaderClick = (col: Column<T>) => {
    if (!col.sortable) return;
    if (sortKey !== col.key) {
      setSortKey(col.key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className ?? ""}`}>
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {selectable && (
              <th className="px-3 py-2 w-10">
                <input
                  aria-label="Select all rows"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-3 py-2 font-semibold text-gray-700 select-none ${col.width ?? ""} ${col.sortable ? "cursor-pointer" : ""}`}
                onClick={() => onHeaderClick(col)}
                title={col.sortable ? "Click to sort" : undefined}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {sortKey === col.key && (
                    <span aria-hidden>{sortDir === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            // Loading skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="animate-pulse">
                {selectable && <td className="px-3 py-3"><div className="h-4 w-4 bg-gray-200 rounded" /></td>}
                {columns.map((c, j) => (
                  <td key={j} className="px-3 py-3">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </td>
                ))}
              </tr>
            ))
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                className="px-3 py-6 text-center text-gray-500"
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => {
              const id = rowKey(row);
              return (
                <tr key={id} className="border-t hover:bg-gray-50">
                  {selectable && (
                    <td className="px-3 py-2">
                      <input
                        aria-label={`Select row ${id}`}
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selected.has(id)}
                        onChange={() => toggleOne(id)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-3 py-2">
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
