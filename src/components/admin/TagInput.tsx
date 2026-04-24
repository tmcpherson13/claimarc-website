import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

const TagInput = ({ value, onChange, placeholder = "Add a tag…" }: Props) => {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const t = raw.trim().replace(/,$/, "").trim();
    if (!t) return;
    if (value.includes(t)) {
      setDraft("");
      return;
    }
    onChange([...value, t]);
    setDraft("");
  };

  const removeTag = (t: string) => {
    onChange(value.filter((v) => v !== t));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 min-h-10 w-full rounded-md border border-input bg-background px-2 py-1.5">
      {value.map((tag) => (
        <span
          key={tag}
          className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
            className="hover:text-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => {
          const v = e.target.value;
          if (v.endsWith(",")) {
            addTag(v.slice(0, -1));
          } else {
            setDraft(v);
          }
        }}
        onKeyDown={onKeyDown}
        onBlur={() => draft.trim() && addTag(draft)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[8rem] bg-transparent text-sm outline-none px-1"
      />
    </div>
  );
};

export default TagInput;
