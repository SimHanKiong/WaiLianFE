import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button, ButtonProps } from "./ui/button";

type DialogWrapperProps = {
  openText: ReactNode;
  title: string;
  children: ReactNode;
  buttonClassName?: ButtonProps["className"];
  buttonVariant?: ButtonProps["variant"];
};

export default function DialogWrapper({
  openText,
  title,
  children,
  buttonClassName,
  buttonVariant = "secondary",
}: DialogWrapperProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName}>
          {openText}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full rounded-lg border p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
