import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { CellContext } from '@tanstack/react-table';

export default function NumberInputCell<TData>({
  getValue,
  row,
  column,
  table,
}: CellContext<TData, number>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      type="number"
    />
  );
}
