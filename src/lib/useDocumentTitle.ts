import { useEffect } from "react";

export function useDocumentTitle(...parts: Array<string | null | undefined>) {
  const title = parts.filter(Boolean).join(" | ");
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
