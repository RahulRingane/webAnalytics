/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { create } from "zustand";

type ModalType = "createProject" | "editProject" | "deleteProject" | null;

interface ModalStore {
  isOpen: boolean;
  type: ModalType;
  data?: any;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  data: undefined,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: undefined }),
}));

export const useKeyboardShortcut = () => {
  const { onOpen } = useModal();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "m") {
        event.preventDefault(); // Prevent the default behavior of the browser
        onOpen("createProject");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpen]);
};