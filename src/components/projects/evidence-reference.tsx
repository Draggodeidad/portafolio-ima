export function EvidenceReference({ number }: { number: number }) {
  return (
    <span
      className="mr-[10px] inline-flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 border-ink text-small font-bold text-ink"
      data-evidence-reference={number}
    >
      {number}
    </span>
  );
}
