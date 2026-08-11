"use client";

import { useEffect, useState } from "react";
import SparklesIcon from "lucide-react/dist/esm/icons/sparkles.mjs";
import type { HeroAssistantScenario } from "@/content/types";

type HeroAssistantDemoProps = {
  demo: {
    buttonLabel: string;
    popupTitle: string;
    typingLabel: string;
    scenarios: HeroAssistantScenario[];
  };
};

type RenderedMessage = HeroAssistantScenario["messages"][number];

const waitDurations = {
  idle: 1200,
  press: 420,
  open: 760,
  assistantIntro: 900,
  assistantThinking: 1250,
  betweenMessages: 720,
  afterScenario: 3000,
  close: 760,
};

const typeCharacterDelay = 34;

function wait(ms: number, timers: Array<ReturnType<typeof setTimeout>>) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    timers.push(timer);
  });
}

export function HeroAssistantDemo({ demo }: HeroAssistantDemoProps) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "pressed" | "open" | "closing">("idle");
  const [messages, setMessages] = useState<RenderedMessage[]>([]);
  const [typingText, setTypingText] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const scenario = demo.scenarios[scenarioIndex] ?? demo.scenarios[0];

  useEffect(() => {
    if (!scenario || demo.scenarios.length === 0) {
      return;
    }

    let cancelled = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    async function runScenario() {
      const renderedMessages: RenderedMessage[] = [];

      setMessages([]);
      setTypingText("");
      setIsThinking(false);
      setPhase("idle");

      await wait(waitDurations.idle, timers);
      if (cancelled) return;

      setPhase("pressed");
      await wait(waitDurations.press, timers);
      if (cancelled) return;

      setPhase("open");
      await wait(waitDurations.open, timers);
      if (cancelled) return;

      for (const [messageIndex, message] of scenario.messages.entries()) {
        if (message.speaker === "assistant") {
          if (messageIndex === 0) {
            await wait(waitDurations.assistantIntro, timers);
          } else {
            setIsThinking(true);
            await wait(waitDurations.assistantThinking, timers);
            setIsThinking(false);
          }

          if (cancelled) return;

          renderedMessages.push(message);
          setMessages([...renderedMessages]);
        } else {
          setTypingText("");

          for (let index = 1; index <= message.text.length; index += 1) {
            if (cancelled) return;

            setTypingText(message.text.slice(0, index));
            await wait(typeCharacterDelay, timers);
          }

          if (cancelled) return;

          renderedMessages.push(message);
          setMessages([...renderedMessages]);
          setTypingText("");
        }

        await wait(waitDurations.betweenMessages, timers);
        if (cancelled) return;
      }

      await wait(waitDurations.afterScenario, timers);
      if (cancelled) return;

      setPhase("closing");
      setIsThinking(false);
      setTypingText("");

      await wait(waitDurations.close, timers);
      if (cancelled) return;

      setScenarioIndex((currentIndex) => (currentIndex + 1) % demo.scenarios.length);
    }

    runScenario();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [demo.scenarios.length, scenario, scenarioIndex]);

  if (!scenario) {
    return null;
  }

  const isPopupVisible = phase === "open" || phase === "closing";

  return (
    <div className="hero-assistant-demo relative mx-auto w-full max-w-[42rem] max-[809px]:max-w-none" aria-label={scenario.label}>
      <div className="relative overflow-hidden rounded-[1.7rem] border border-white/[0.12] bg-[linear-gradient(145deg,rgba(255,255,255,0.11),rgba(255,255,255,0.045)_44%,rgba(126,87,255,0.08))] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="overflow-hidden rounded-[1.25rem] border border-white/[0.1] bg-[#080b18]/92">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]/85" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f6c85f]/85" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#5ce28a]/85" aria-hidden="true" />
            </div>
          </div>

          <div className="grid min-h-[30rem] grid-cols-[0.34fr_1fr] max-[520px]:min-h-[31rem] max-[520px]:grid-cols-1">
            <aside className="border-r border-white/[0.08] bg-white/[0.025] p-4 max-[520px]:hidden">
              <div className="mb-5 h-7 w-24 rounded-md bg-white/[0.1]" />
              <div className="space-y-2.5">
                {["Overview", "Sales", "Branches", "Rules"].map((item, index) => (
                  <div className={`h-9 rounded-lg ${index === scenarioIndex ? "bg-white/[0.12]" : "bg-white/[0.055]"}`} key={item}>
                    <span className="block px-3 py-2 text-[0.72rem] text-white/48">{item}</span>
                  </div>
                ))}
              </div>
            </aside>

            <div className="relative p-5 max-[520px]:p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-[0.72rem] font-normal uppercase tracking-[0.16em] text-[var(--color-blue-soft)]/80">{scenario.label}</p>
                  <h2 className="mt-2 text-[clamp(1.35rem,2.6vw,2rem)] font-medium leading-none tracking-[-0.045em] text-white">
                    {scenario.dashboardTitle}
                  </h2>
                </div>
                <div className="rounded-2xl bg-white/[0.075] px-3.5 py-3 text-right">
                  <p className="m-0 text-[1.12rem] font-medium leading-none text-white">{scenario.dashboardMetric}</p>
                  <p className="m-0 mt-1 text-[0.7rem] font-light text-white/48">{scenario.dashboardDetail}</p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 max-[520px]:grid-cols-2">
                {[0, 1, 2].map((item) => (
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.045] p-3" key={item}>
                    <div className="hero-dashboard-shimmer h-2 w-16 rounded-full bg-white/[0.14]" />
                    <div className="mt-5 h-8 rounded-lg bg-white/[0.08]" />
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-28 rounded-full bg-white/[0.13]" />
                  <div className="h-3 w-14 rounded-full bg-[var(--color-blue-soft)]/28" />
                </div>
                <div className="flex h-32 items-end gap-2">
                  {[44, 66, 48, 82, 58, 74, 52, 88].map((height, index) => (
                    <span
                      className="hero-dashboard-bar flex-1 rounded-t-md bg-[linear-gradient(180deg,rgba(126,185,252,0.72),rgba(126,87,255,0.22))]"
                      style={{ height: `${height}%`, animationDelay: `${index * 80}ms` }}
                      key={`${height}-${index}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_0.72fr] gap-3 max-[520px]:grid-cols-1">
                <div className="space-y-2 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                  {[72, 92, 54].map((width, index) => (
                    <span className="hero-dashboard-shimmer block h-2.5 rounded-full bg-white/[0.12]" style={{ width: `${width}%` }} key={index} />
                  ))}
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                  <div className="h-14 rounded-xl bg-[linear-gradient(135deg,rgba(126,87,255,0.26),rgba(56, 182, 255,0.14))]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`hero-assistant-orb absolute bottom-5 right-5 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7f5cff,#4c2fe1)] text-white transition-transform duration-300 ${phase === "pressed" ? "scale-90" : "scale-100"}`}
          type="button"
          aria-label={demo.buttonLabel}
          tabIndex={-1}
        >
          <span className="absolute inset-0 rounded-full bg-white/15" aria-hidden="true" />
          <SparklesIcon className="relative h-7 w-7" strokeWidth={1.55} aria-hidden="true" />
        </button>

        {isPopupVisible ? (
          <>
            <div className={`hero-assistant-scrim absolute inset-3 z-[25] rounded-[1.25rem] bg-[#000407]/28 backdrop-blur-[3px] ${phase === "closing" ? "hero-assistant-scrim--closing" : ""}`} aria-hidden="true" />
            <div
              className={`hero-assistant-popup absolute bottom-24 right-5 z-30 w-[min(26rem,calc(100%-2.5rem))] rounded-[1.35rem] border border-white/[0.14] bg-[#0b0f1d]/95 p-3 text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl ${phase === "closing" ? "hero-assistant-popup--closing" : ""}`}
              aria-live="polite"
            >
              <div className="flex items-center border-b border-white/[0.08] px-1 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#8d6bff]" aria-hidden="true" />
                  <span className="text-[0.82rem] font-normal text-white/78">{demo.popupTitle}</span>
                </div>
              </div>

              <div className="mt-3 flex min-h-[18rem] max-h-[21rem] flex-col gap-2.5 overflow-hidden max-[520px]:min-h-[19rem]">
                {messages.map((message, index) => (
                  <div
                    className={`hero-assistant-message max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[0.84rem] font-light leading-[1.45] ${
                      message.speaker === "user"
                        ? "ml-auto rounded-br-md bg-[var(--color-blue)] text-white"
                        : "mr-auto rounded-bl-md bg-white/[0.09] text-white/82"
                    }`}
                    key={`${message.speaker}-${message.text}-${index}`}
                  >
                    {message.text}
                  </div>
                ))}

                {typingText ? (
                  <div className="hero-assistant-message ml-auto max-w-[86%] rounded-2xl rounded-br-md bg-[var(--color-blue)] px-3.5 py-2.5 text-[0.84rem] font-light leading-[1.45] text-white">
                    {typingText}
                    <span className="hero-assistant-caret ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-white/78" aria-hidden="true" />
                  </div>
                ) : null}

                {isThinking ? (
                  <div className="hero-assistant-message mr-auto flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/[0.09] px-3.5 py-3" aria-label={demo.typingLabel}>
                    <span className="hero-assistant-dot" />
                    <span className="hero-assistant-dot" />
                    <span className="hero-assistant-dot" />
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
