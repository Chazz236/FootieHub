const Table = ({ children, className = '', ...props }) => {
  return (
    <table className={`table-fixed bg-white shadow-md rounded-lg overflow-hidden border-collapse ${className}`} {...props}>
      {children}
    </table>
  );
}

Table.Header = ({ children, className = '' }) => {
  return (
    <thead className={`bg-foreground text-white text-sm ${className}`}>
      {children}
    </thead>
  );
}

Table.HeaderRow = ({ children, className = '' }) => {
  return (
    <tr className={`${className}`}>
      {children}
    </tr>
  );
}

Table.HeaderCell = ({ children, className = '' }) => {
  return (
    <td className={`py-3 px-6 ${className}`}>
      {children}
    </td>
  );
}

Table.Body = ({ children, className = '' }) => (
  <tbody className={`${className}`}>
    {children}
  </tbody>
);

Table.Row = ({ children, className = '' }) => {
  return (
    <tr className={`border-b border-gray-300 ${className}`}>
      {children}
    </tr>
  );
}

Table.Cell = ({ children, className = '' }) => {
  return (
    <td className={`py-3 px-6 border-r border-gray-300 ${className}`}>
      {children}
    </td>
  );
}

export default Table;