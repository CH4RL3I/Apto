interface Props {
  columns: string[];
  rows: string[][];
}

export function DataTable({ columns, rows }: Props) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-pale-sage">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`border border-sage-mist-2 px-3 py-2.5 font-semibold text-charcoal-2 ${
                  i === 0 ? "text-left" : "text-center"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={ri % 2 === 1 ? "bg-pale-sage/40" : "bg-chalk"}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border border-sage-mist-2 px-3 py-2 ${
                    ci === 0
                      ? "text-charcoal text-left"
                      : "text-charcoal-2 text-center"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
