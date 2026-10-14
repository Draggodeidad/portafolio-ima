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
    <div className="section-heading">
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-heading__title">
        {title}
      </h2>
    </div>
  );
}
