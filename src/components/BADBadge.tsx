interface BADBadgeProps {
  required: boolean;
}

const BADBadge = ({ required }: BADBadgeProps) => {
  const base =
    "text-xs px-2 py-0.5 rounded-full font-medium inline-block border";
  const cls = required
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <span className={`${base} ${cls}`}>
      {required ? "BAA Required" : "No BAA Required"}
    </span>
  );
};

export default BADBadge;
