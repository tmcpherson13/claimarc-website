import { useState } from "react";
import { useChatbot } from "@/context/ChatbotContext";

export default function ChatbotButton() {
  const { isOpen, open, messageCount, isLoading } = useChatbot();
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);

  const visible = hover || focused;
  const badgeLabel = messageCount > 0 ? String(messageCount) : "Z";
  // Disable while a message is in flight to prevent re-opens / repeated triggers.
  const disabled = isLoading;

  return (
    <>
      <style>{`
        @keyframes zdAiPing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes zdAiSpin {
          to { transform: rotate(360deg); }
        }
        .zd-ai-button:focus-visible {
          outline: 2px solid #10B981;
          outline-offset: 3px;
        }
      `}</style>

      <div
        aria-hidden={isOpen}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 49,
          width: 52,
          height: 52,
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? "none" : "auto",
          transition: "opacity 200ms ease",
        }}
      >
        {/* Pulse ring */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid #10B981",
            animation: "zdAiPing 2.5s cubic-bezier(0,0,0.2,1) infinite",
            pointerEvents: "none",
          }}
        />

        {/* Tooltip — always rendered for accessibility (aria-describedby).
            Visibility is controlled by hover OR keyboard focus. */}
        <div
          id="zd-ai-button-tooltip"
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            right: 0,
            background: "#0F172A",
            color: "#CBD5E1",
            fontSize: 11,
            padding: "5px 10px",
            borderRadius: 6,
            border: "1px solid #1E3A5F",
            whiteSpace: "nowrap",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 150ms ease, transform 150ms ease",
            pointerEvents: "none",
          }}
        >
          {disabled ? "Sending…" : "Chat with Z"}
        </div>

        {/* Button */}
        <button
          type="button"
          className="zd-ai-button"
          onClick={() => {
            if (disabled) return;
            open();
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={disabled ? "ZDefense AI is responding" : "Ask ZDefense AI"}
          aria-describedby="zd-ai-button-tooltip"
          aria-busy={disabled || undefined}
          disabled={disabled}
          style={{
            position: "relative",
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0F172A, #10B981)",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            boxShadow: hover && !disabled
              ? "0 6px 28px rgba(16, 185, 129, 0.45)"
              : "0 4px 20px rgba(16, 185, 129, 0.3)",
            transform: hover && !disabled ? "scale(1.08)" : "scale(1)",
            transition: "all 200ms ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            opacity: disabled ? 0.7 : 1,
          }}
        >
          {disabled ? (
            // Spinner during in-flight requests
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ animation: "zdAiSpin 0.9s linear infinite" }}
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2.5"
              />
              <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          )}

          {/* Notification badge */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              minWidth: 18,
              height: 18,
              padding: "0 4px",
              borderRadius: 999,
              background: "#10B981",
              color: "#0B1628",
              fontSize: messageCount > 0 ? 10 : 8,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              border: "2px solid #0F172A",
              boxSizing: "content-box",
            }}
          >
            {badgeLabel}
          </span>
        </button>
      </div>
    </>
  );
}
