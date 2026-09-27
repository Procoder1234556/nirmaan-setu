import * as React from "react";
import type { ToastActionElement, ToastProps } from "../components/ui/toast";

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type ToastInput = Omit<ToasterToast, "id">;

let nextToastId = 0;
let memoryToasts: ToasterToast[] = [];
const listeners = new Set<(toasts: ToasterToast[]) => void>();

function publish() {
  listeners.forEach((listener) => listener(memoryToasts));
}

export function toast(input: ToastInput) {
  const id = String(++nextToastId);
  const dismiss = () => {
    memoryToasts = memoryToasts.filter((item) => item.id !== id);
    publish();
  };

  memoryToasts = [
    {
      ...input,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
    ...memoryToasts,
  ].slice(0, 1);
  publish();

  return { id, dismiss };
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>(memoryToasts);

  React.useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: (toastId?: string) => {
      memoryToasts = toastId
        ? memoryToasts.filter((item) => item.id !== toastId)
        : [];
      publish();
    },
  };
}
