export function EvidenceReference({ number }: { number: number }) {
  return (
    <span
      className="mr-2 inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-ink text-small font-bold text-ink"
      data-evidence-reference={number}
    >
      {number}
    </span>
  );
}
