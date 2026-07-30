"use client";

import { useState, useTransition } from "react";
import { deleteContentItem, moveContentItem } from "../../app/admin/actions";
import { ConfirmDialog } from "./ConfirmDialog";

export function ListRowControls({
  typeKey,
  recordId,
  itemLabel,
  isFirst,
  isLast,
}: {
  typeKey: string;
  recordId: string;
  itemLabel: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(direction: "up" | "down") {
    setError(null);
    startTransition(async () => {
      try {
        await moveContentItem(typeKey, recordId, direction);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      }
    });
  }

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteContentItem(typeKey, recordId);
        setConfirmOpen(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-y-1">
      <div className="flex items-center justify-end gap-x-2">
        <button
          type="button"
          onClick={() => move("up")}
          disabled={isFirst || isPending}
          aria-label={`Move ${itemLabel} up`}
          className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => move("down")}
          disabled={isLast || isPending}
          aria-label={`Move ${itemLabel} down`}
          className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={isPending}
          className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
        >
          Delete
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete "${itemLabel}"?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        pending={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
