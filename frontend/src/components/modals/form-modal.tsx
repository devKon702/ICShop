import Separator from "@/components/common/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalActions } from "@/store/modal-store";
import { DialogDescription } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";

export default function FormModal({
  title,
  children,
  titleExtraComponent,
  index,
  useCloseButton = false,
}: {
  title?: string;
  children: React.ReactNode;
  titleExtraComponent?: React.ReactNode;
  index: number;
  useCloseButton?: boolean;
}) {
  const { removeModalAt } = useModalActions();
  return (
    <Dialog open={true} onOpenChange={(o) => !o && removeModalAt(index)}>
      <DialogContent
        className="p-0 gap-0 max-h-[90dvh] overflow-y-auto app"
        showCloseButton={false}
        {...(useCloseButton
          ? {
              onEscapeKeyDown: (e) => e.preventDefault(),
              onPointerDownOutside: (e) => e.preventDefault(),
            }
          : {})}
      >
        <DialogDescription></DialogDescription>
        <DialogHeader>
          {title && (
            <>
              <DialogTitle className="font-bold text-2xl px-4 py-2">
                {title}
                {titleExtraComponent}
                {useCloseButton && (
                  <DialogClose className="cursor-pointer float-right p-1">
                    <X />
                  </DialogClose>
                )}
              </DialogTitle>
              <Separator />
            </>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
