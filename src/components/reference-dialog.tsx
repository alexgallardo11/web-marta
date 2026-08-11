"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

export function ReferenceDialog({
  open,
  onClose,
  labelledBy,
  closeLabel,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  closeLabel: string;
  className?: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousOverflowRef = useRef("");

  const restorePageScroll = useCallback(() => {
    document.body.style.overflow = previousOverflowRef.current;
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) dialog.close();
      restorePageScroll();
    };
  }, [open, restorePageScroll]);

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleNativeClose() {
    restorePageScroll();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={`reference-dialog ${className}`}
      aria-labelledby={labelledBy}
      onClose={handleNativeClose}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className="reference-dialog__surface">
        <button
          type="button"
          className="reference-dialog__close"
          onClick={closeDialog}
          aria-label={closeLabel}
        >
          <X aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
