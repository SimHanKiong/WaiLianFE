import { CellContext } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

export default function DisplayCell<TData>({
  getValue,
}: CellContext<TData, string>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="flex w-full px-3 py-1 text-base md:text-sm">{value}</div>
  );
}
