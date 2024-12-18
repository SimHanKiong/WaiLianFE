'use client';

import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { CellContext } from '@tanstack/react-table';

interface DataWithId {
  id: string;
}

interface TextInputCellProps<TData> extends CellContext<TData, string> {
  updateCellAction: (id: string, dataUpdate: Partial<TData>) => Promise<void>;
}

export default function TextInputCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  updateCellAction,
}: TextInputCellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() =>
        updateCellAction(row.original.id, {
          [column.id]: value,
        } as Partial<TData>)
      }
      type="text"
    />
  );
}
