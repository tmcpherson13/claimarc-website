## Add Model Toggle (Claude vs Gemini) to AI Generate Panel

### 1. `supabase/functions/generate-content/index.ts`
- Parse optional `model` from request body.
- Add MODELS map and resolve `selectedModel` (Claude default fallback).
- Pass `model: selectedModel` to the Lovable AI Gateway fetch body in place of the hardcoded model string.

### 2. `src/pages/admin/AdminContentEditor.tsx`
- Add state: `const [aiModel, setAiModel] = useState<'claude' | 'gemini'>('claude');`
- In the AI Generate panel (when expanded), render a 2-button toggle (`✦ Claude` / `◆ Gemini`) above the textarea, with the helper caption: "Claude: consistent brand voice — Gemini: faster for bulk drafts".
- Pass `model: aiModel` in the `supabase.functions.invoke('generate-content', ...)` call.

### Out of scope
- No changes to system prompt, tool schema, returned JSON shape, or form-population logic.
- No new secrets — uses existing `LOVABLE_API_KEY` via the Lovable AI Gateway.