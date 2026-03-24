import Link from "next/link";

export default function SectionHeader({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-sm font-semibold text-white/90">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="text-xs font-medium text-white/60 transition hover:text-white/90"
        >
          Ver tudo →
        </Link>
      ) : (
        <span className="text-xs text-white/40"> </span>
      )}
    </div>
  );
}

