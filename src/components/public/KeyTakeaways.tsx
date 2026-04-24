const KeyTakeaways = ({ items }: { items: string[] }) => {
  if (items.length === 0) return null;
  return (
    <aside className="not-prose my-8 rounded-lg border-l-4 border-[var(--emerald)] bg-emerald-50/60 p-6">
      <p className="text-xs uppercase tracking-wider font-bold text-[var(--emerald)]">
        Key takeaways
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3 text-[var(--navy)]">
            <span
              className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--emerald)] text-white text-xs"
              aria-hidden
            >
              ✓
            </span>
            <span className="text-base leading-relaxed">{t}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default KeyTakeaways;
