import { useEffect } from "react";

interface ShortcutOptions {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  key: string;
  onTrigger: () => void;
}

export function useKeyboardShortcut({
  ctrl = false,
  shift = false,
  alt = false,
  key,
  onTrigger,
}: ShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const ctrlMatch = !ctrl || event.ctrlKey || event.metaKey;
      const shiftMatch = !shift || event.shiftKey;
      const altMatch = !alt || event.altKey;
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        onTrigger();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ctrl, shift, alt, key, onTrigger]);
}
