import { clsx } from "clsx";
import { Image as ImageIcon } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Message } from "@prisma/client";

export function ChatThread({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-2">
      {messages.map((m) => (
        <div
          key={m.id}
          className={clsx("flex", m.direction === "OUT" ? "justify-end" : "justify-start")}
        >
          <div
            className={clsx(
              "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
              m.direction === "OUT"
                ? "rounded-br-sm bg-brand-red text-white"
                : "rounded-bl-sm bg-brand-gray-100 text-brand-gray-900",
            )}
          >
            {m.type === "IMAGE" ? (
              <p className="flex items-center gap-1.5">
                <ImageIcon size={14} /> {m.content}
              </p>
            ) : (
              <p>{m.content}</p>
            )}
            <p
              className={clsx(
                "mt-1 text-[10px]",
                m.direction === "OUT" ? "text-white/70" : "text-brand-gray-400",
              )}
            >
              {formatDateTime(m.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
