export default function SectionHeading({
  number,
  label,
  trailing,
}: {
  number: string;
  label: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4 border-t-2 border-fg pt-3.5 font-mono text-[10px] font-light uppercase text-dim">
      <span style={{ color: "var(--ink2)" }}>{number}</span> / {label}
      {trailing}
    </div>
  );
}
