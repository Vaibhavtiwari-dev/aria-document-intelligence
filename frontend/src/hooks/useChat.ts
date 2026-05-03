import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

export type Message = {
  role: "user" | "ai";
  text: string;
};

/**
 * useChat — Streams AI responses via Server-Sent Events (SSE).
 *
 * The backend returns `data: {"chunk": "..."}` lines.
 * This hook reads them incrementally using ReadableStream,
 * so the UI updates token-by-token instead of blocking
 * until the entire response is generated.
 */
export function useChat(workspaceId: string | undefined) {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello! I'm Aria. I can answer questions about any documents uploaded to this workspace.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const submitChat = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !workspaceId || isStreaming) return;

      const userMsg = input.trim();
      setInput("");
      setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

      // Append a placeholder AI message that we'll stream into
      setMessages((prev) => [...prev, { role: "ai", text: "" }]);
      setIsStreaming(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Allow in-flight cancellation
      abortRef.current = new AbortController();

      try {
        const token = await getToken();
        const res = await fetch(
          `${apiUrl}/workspaces/${workspaceId}/qa/`,
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ query: userMsg }),
            signal: abortRef.current.signal,
          }
        );

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No readable stream available");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse SSE lines: each chunk is `data: {"chunk": "..."}\n\n`
          const lines = buffer.split("\n");
          // Keep the last potentially incomplete line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const jsonStr = trimmed.slice(5).trim(); // Remove "data: " prefix
            if (!jsonStr) continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const chunk = parsed.chunk || "";

              // Append chunk to the last AI message
              setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && lastMsg.role === "ai") {
                  updated[updated.length - 1] = {
                    ...lastMsg,
                    text: lastMsg.text + chunk,
                  };
                }
                return updated;
              });
            } catch {
              // Skip malformed JSON lines silently
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // User cancelled — do nothing
          return;
        }

        console.error("[useChat] Stream error:", err);
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === "ai" && lastMsg.text === "") {
            updated[updated.length - 1] = {
              ...lastMsg,
              text: "Sorry, an error occurred while searching documents. Please try again.",
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [input, workspaceId, isStreaming]
  );

  return { messages, input, setInput, submitChat, scrollRef, isStreaming };
}
