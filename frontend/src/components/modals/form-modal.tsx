import Separator from "@/components/common/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalActions } from "@/store/modal-store";
import { DialogDescription } from "@radix-ui/react-dialog";
import React from "react";

export default function FormModal({
  title,
  children,
  index,
}: {
  title?: string;
  children: React.ReactNode;
  index: number;
}) {
  const { removeModalAt } = useModalActions();
  return (
    <Dialog open={true} onOpenChange={(o) => !o && removeModalAt(index)}>
      <DialogContent
        className="p-0 gap-0 max-h-[90dvh] overflow-y-auto app"
        showCloseButton={false}
      >
        <DialogDescription></DialogDescription>
        <DialogHeader>
          {title && (
            <>
              <DialogTitle className="font-bold text-2xl px-4 py-2">
                {title}
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
