"use client";

import { useEffect, useRef, useCallback } from "react";

export function useInactivityLogout(timeoutMinutes?: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modalRef = useRef<(() => void) | null>(null);

  const showExpiredModal = useCallback(() => {
    // dispatch custom event to show modal
    window.dispatchEvent(new Event("session-expired"));
  }, []);

  useEffect(() => {
    if (!timeoutMinutes) return;

    const timeoutMs = timeoutMinutes * 60 * 1000;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        showExpiredModal();
      }, timeoutMs);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

    resetTimer();
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [timeoutMinutes, showExpiredModal]);
}