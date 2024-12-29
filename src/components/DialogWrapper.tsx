import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';

type DialogWrapperProps = {
  openText: ReactNode;
  title: string;
  children: ReactNode;
};

export default function DialogWrapper({
  openText,
  title,
  children,
}: DialogWrapperProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">{openText}</Button>
      </DialogTrigger>
      <DialogContent className="w-full rounded-lg p-6 shadow-lg border">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
