import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

export type FileStatus = {
  name: string;
  documentId: string;
  progress: number;
  status: string;
};

/**
 * useWorkspaceStatus — Manages document upload + real-time ingestion progress via WebSocket.
 *
 * The backend broadcasts status updates like:
 *   { document_id: "...", status: "processing", progress: 50, message: "Chunking..." }
 *
 * Each file is uniquely identified by its `documentId` to prevent
 * cross-file state contamination.
 */
export function useWorkspaceStatus(workspaceId: string | undefined) {
  const { getToken } = useAuth();
  const [files, setFiles] = useState<FileStatus[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    const setupWs = async () => {
      const token = await getToken();
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
      if (!wsUrl) {
        console.error("[useWorkspaceStatus] NEXT_PUBLIC_WS_URL is missing");
        return;
      }
      
      const ws = new WebSocket(`${wsUrl}/status/${workspaceId}?token=${token}`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data.document_id) return;

          setFiles((prev) => {
            // Check if we already have this document tracked
            const exists = prev.some((f) => f.documentId === data.document_id);

            if (exists) {
              // Update only the matching document — NOT all documents
              return prev.map((f) =>
                f.documentId === data.document_id
                  ? { ...f, progress: data.progress, status: data.message }
                  : f
              );
            } else {
              // New document we haven't seen yet — add it
              return [
                ...prev,
                {
                  name: data.filename || "Unknown File",
                  documentId: data.document_id,
                  progress: data.progress,
                  status: data.message,
                },
              ];
            }
          });
        } catch (e) {
          console.error("[useWorkspaceStatus] WebSocket parse error:", e);
        }
      };

      ws.onerror = (e) => {
        console.error("[useWorkspaceStatus] WebSocket error:", e);
      };
    };

    setupWs();

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [workspaceId, getToken]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !workspaceId) return;
    const file = e.target.files[0];

    // Generate a temporary client-side ID until the server assigns a real one
    const tempId = `temp_${Date.now()}`;

    // Add to UI state immediately for instant feedback
    setFiles((prev) => [
      ...prev,
      { name: file.name, documentId: tempId, progress: 0, status: "Uploading..." },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[useWorkspaceStatus] NEXT_PUBLIC_API_URL is missing");
      setFiles((prev) =>
        prev.map((f) =>
          f.documentId === tempId
            ? { ...f, status: "Config error", progress: 0 }
            : f
        )
      );
      return;
    }

    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/workspaces/${workspaceId}/documents/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);

      const result = await res.json();
      const realDocId = result.document?.id;

      // Replace the temp ID with the real server-assigned document ID
      if (realDocId) {
        setFiles((prev) =>
          prev.map((f) =>
            f.documentId === tempId
              ? { ...f, documentId: realDocId, status: "Processing..." }
              : f
          )
        );
      }
    } catch (err) {
      console.error("[useWorkspaceStatus] Upload error:", err);
      setFiles((prev) =>
        prev.map((f) =>
          f.documentId === tempId
            ? { ...f, status: "Upload failed", progress: 0 }
            : f
        )
      );
    }

    // Reset input so the same file can be re-uploaded
    e.target.value = "";
  };

  return { files, handleUpload };
}
