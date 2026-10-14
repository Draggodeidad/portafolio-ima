const styles = {
  eyebrow: "mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-accent",
  title:
    "m-0 font-display text-[clamp(28px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.035em] text-foreground",
} as const;

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
};

export function SectionHeading({
  id,
  eyebrow = "// PORTAFOLIO",
  title,
}: SectionHeadingProps) {
  return (
    <div>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
    </div>
  );
}
