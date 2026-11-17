export function ActionArrow({ download = false }: { download?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="ml-2 inline-block size-4 shrink-0 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={download ? "M10 2v12m-5-4 5 5 5-5M3 18h14" : "M4 16 16 4M6 4h10v10"}
      />
    </svg>
  );
}
