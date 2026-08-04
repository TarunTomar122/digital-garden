"use client";

import { useLinkStatus } from "next/link";

export default function LinkLoadingIndicator() {
  const { pending } = useLinkStatus();

  return pending ? (
    <span role="status" aria-live="polite" className="ml-2 animate-pulse text-xs text-[#777]">
      loading…
    </span>
  ) : null;
}
