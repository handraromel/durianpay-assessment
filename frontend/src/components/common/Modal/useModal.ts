import { useEffect, useRef, useState } from "react";

export function useModal(
  isOpen: boolean,
  children: React.ReactNode,
  transitionMs = 300,
) {
  const [preservedChildren, setPreservedChildren] =
    useState<React.ReactNode | null>(isOpen ? children : null);

  const closeTimerRef = useRef<number | null>(null);
  const preserveTimerRef = useRef<number | null>(null);
  const lastChildrenRef = useRef<React.ReactNode>(children);

  useEffect(() => {
    lastChildrenRef.current = children;
  }, [children]);

  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (preserveTimerRef.current) {
        clearTimeout(preserveTimerRef.current);
        preserveTimerRef.current = null;
      }
      // Opening: don't set state synchronously here
      return;
    }

    // Closing: snapshot children asynchronously and clear after transition
    if (!isOpen) {
      if (preserveTimerRef.current) {
        clearTimeout(preserveTimerRef.current);
        preserveTimerRef.current = null;
      }

      preserveTimerRef.current = window.setTimeout(() => {
        setPreservedChildren(lastChildrenRef.current);
        preserveTimerRef.current = null;
      }, 0);

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      closeTimerRef.current = window.setTimeout(() => {
        setPreservedChildren(null);
        closeTimerRef.current = null;
      }, transitionMs);
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (preserveTimerRef.current) {
        clearTimeout(preserveTimerRef.current);
        preserveTimerRef.current = null;
      }
    };
  }, [isOpen, transitionMs]);

  return {
    preservedChildren,
    shouldRender: isOpen || preservedChildren != null,
  };
}
