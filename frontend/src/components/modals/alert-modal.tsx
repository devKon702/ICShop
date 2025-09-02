import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import React from "react";

interface AlertModalProps {
  title?: string;
  message: string;
  onClose: () => void;
}

export default function AlertModal({
  title,
  message,
  onClose,
}: AlertModalProps) {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        {message}
        <DialogFooter>
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
