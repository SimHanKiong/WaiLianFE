'use client';

import { CellContext } from '@tanstack/react-table';
import { Checkbox } from './ui/checkbox';

interface DataWithId {
  id: string;
}

export default function EditCell<TData extends DataWithId>({
  row,
}: CellContext<TData, any>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={row.getToggleSelectedHandler()}
    />
  );
}
