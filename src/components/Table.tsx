type Column<T> = {
    header: string;
    accessor: keyof T; // Ensure that accessor matches the keys of the data
    className?: string;
  };
  
  type TableProps<T> = {
    columns: Column<T>[];
    renderRow: (item: T) => React.ReactNode;
    data: T[];
  };
  
  const Table = <T extends object>({ columns, renderRow, data }: TableProps<T>) => {
    return (
      <table className="w-full mt-4">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((col) => (
              <th key={String(col.accessor)} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item) => renderRow(item))}</tbody>
      </table>
    );
  };
  
  export default Table;
  