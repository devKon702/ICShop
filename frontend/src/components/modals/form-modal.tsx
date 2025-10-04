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
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const { closeModal } = useModalActions();
  return (
    <Dialog open={true} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent showCloseButton={false} className="p-0 gap-0">
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
