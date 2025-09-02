import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import React from "react";

interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        {message}
        <DialogFooter>
          <Button onClick={onConfirm}>Xác nhận</Button>
          <Button onClick={onCancel}>Hủy bỏ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
