const styles = { title: "m-0 text-h2 text-graphite" } as const;

type SectionHeadingProps = { id?: string; title: string };

export function SectionHeading({ id, title }: SectionHeadingProps) {
  return (
    <h2 id={id} className={styles.title}>
      {title}
    </h2>
  );
}
