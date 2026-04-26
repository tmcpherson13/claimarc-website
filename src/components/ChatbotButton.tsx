import { useState } from "react";
import { useChatbot } from "@/context/ChatbotContext";

export default function ChatbotButton() {
  const { isOpen, open, messageCount } = useChatbot();
  const [hover, setHover] = useState(false);

  const badgeLabel = messageCount > 0 ? String(messageCount) : "AI";

  return (
    <>
      <style>{`
        @keyframes zdAiPing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
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

        {/* Tooltip */}
        <div
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
            opacity: hover ? 1 : 0,
            transform: hover ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 150ms ease, transform 150ms ease",
            pointerEvents: "none",
          }}
        >
          Ask ZDefense AI
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={() => open()}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          aria-label="Ask ZDefense AI"
          style={{
            position: "relative",
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0F172A, #10B981)",
            border: "none",
            cursor: "pointer",
            boxShadow: hover
              ? "0 6px 28px rgba(16, 185, 129, 0.45)"
              : "0 4px 20px rgba(16, 185, 129, 0.3)",
            transform: hover ? "scale(1.08)" : "scale(1)",
            transition: "all 200ms ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
          }}
        >
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
