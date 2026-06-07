"use client";

import { useEffect, useState } from "react";
import SendIcon from "lucide-react/dist/esm/icons/send.mjs";
import WorkflowIcon from "lucide-react/dist/esm/icons/workflow.mjs";
import XIcon from "lucide-react/dist/esm/icons/x.mjs";
import type { HomeContent } from "@/content/types";

type AiChatMockupProps = {
  chat: HomeContent["ai"]["chat"];
};

type ChatState = "idle" | "sent" | "typing" | "reply" | "done";

export function AiChatMockup({ chat }: AiChatMockupProps) {
  const [state, setState] = useState<ChatState>("idle");

  const hasSent = state !== "idle";
  const showTyping = state === "typing";
  const showReply = state === "reply" || state === "done";
  const showReport = state === "done";

  useEffect(() => {
    if (state !== "sent") return;

    const timeout = window.setTimeout(() => setState("typing"), 450);

    return () => window.clearTimeout(timeout);
  }, [state]);

  useEffect(() => {
    if (state !== "typing") return;

    const timeout = window.setTimeout(() => setState("reply"), 2000);

    return () => window.clearTimeout(timeout);
  }, [state]);

  useEffect(() => {
    if (state !== "reply") return;

    const timeout = window.setTimeout(() => setState("done"), 650);

    return () => window.clearTimeout(timeout);
  }, [state]);

  const handleSend = () => {
    if (state !== "idle") return;
    setState("sent");
  };

  return (
    <div className="relative z-[1] overflow-hidden rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.08)] bg-white/72 shadow-[0_18px_48px_rgba(2,2,13,0.08)]">
      <div className="absolute right-3 top-3 z-10" aria-hidden="true">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(2,2,13,0.1)] bg-white/86 text-[var(--color-muted)] shadow-[0_8px_24px_rgba(2,2,13,0.08)]">
          <XIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
        </span>
      </div>

      <div className="grid min-h-[34rem] grid-rows-[1fr_auto] gap-3 p-[clamp(1rem,3vw,1.45rem)] pt-14" aria-label={chat.reportTitle}>
        <div className="grid content-start gap-3">
          <div className="ai-chat-message flex justify-start">
            <p className="m-0 max-w-[min(100%,25rem)] rounded-[1.25rem] rounded-bl-sm border border-[rgba(2,2,13,0.08)] bg-white/88 px-4 py-3 leading-[1.5] text-[var(--color-ink-soft)] shadow-[0_10px_30px_rgba(2,2,13,0.06)]">
              {chat.assistantPrompt}
            </p>
          </div>

          {hasSent ? (
            <>
              <div className="ai-chat-message flex justify-end">
                <p className="m-0 max-w-[min(100%,29rem)] rounded-[1.25rem] rounded-br-sm bg-[var(--color-ink)] px-4 py-3 leading-[1.5] text-white/86 shadow-[0_14px_38px_rgba(2,2,13,0.18)]">
                  {chat.userRequest}
                </p>
              </div>

            {showTyping ? (
              <div className="ai-chat-message flex justify-start">
                <div className="ai-typing-indicator flex items-center gap-1.5 rounded-full border border-[rgba(2,2,13,0.08)] bg-white/88 px-4 py-3 shadow-[0_10px_30px_rgba(2,2,13,0.06)]" aria-label="Typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : null}

            {showReply ? (
              <>
                <div className="ai-chat-message flex justify-start">
                  <p className="m-0 max-w-[min(100%,28rem)] rounded-[1.25rem] rounded-bl-sm border border-[rgba(0,103,244,0.16)] bg-white/90 px-4 py-3 leading-[1.5] text-[var(--color-ink-soft)] shadow-[0_10px_30px_rgba(0,103,244,0.08)]">
                    {chat.assistantReply}
                  </p>
                </div>

                {showReport ? (
                <div className="ai-chat-message overflow-hidden rounded-[calc(var(--radius-panel)-10px)] border border-[rgba(2,2,13,0.08)] bg-white/92 shadow-[0_18px_45px_rgba(2,2,13,0.08)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[rgba(2,2,13,0.08)] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <WorkflowIcon className="h-4 w-4 text-[var(--color-blue)]" strokeWidth={1.8} aria-hidden="true" />
                      <p className="m-0 text-[0.86rem] font-semibold text-[var(--color-ink)]">{chat.reportTitle}</p>
                    </div>
                    <span className="rounded-full bg-[var(--color-blue)]/[0.08] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]">{chat.statusLabel}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-[0.82rem]">
                      <thead className="text-[0.68rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                        <tr>
                          {chat.tableHeaders.map((header) => (
                            <th className="px-4 py-2 font-semibold" key={header}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-[var(--color-ink-soft)]">
                        {chat.tableRows.map((row) => (
                          <tr className="border-t border-[rgba(2,2,13,0.06)]" key={row[0]}>
                            {row.map((cell, cellIndex) => (
                              <td className={`px-4 py-2.5 ${cellIndex === 0 ? "font-medium text-[var(--color-ink)]" : ""}`} key={cell}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                ) : null}
              </>
            ) : null}
            </>
          ) : null}
        </div>

        <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-full border border-[rgba(2,2,13,0.08)] bg-white/84 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <p className={`m-0 truncate px-3 text-[0.86rem] ${hasSent ? "text-[var(--color-muted)]/45" : "text-[var(--color-ink-soft)]"}`}>
            {hasSent ? chat.inputPlaceholder : chat.userRequest}
          </p>
          <button
            className="ai-send-button grid h-9 w-9 place-items-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] transition-[background,opacity,transform] hover:cursor-pointer hover:scale-105 disabled:bg-[var(--color-muted-light)] disabled:text-[var(--color-muted)] disabled:cursor-default disabled:opacity-70 disabled:hover:scale-100"
            type="button"
            aria-label={chat.sendLabel}
            disabled={hasSent}
            onClick={handleSend}
          >
            <SendIcon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
