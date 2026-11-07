"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import SendIcon from "lucide-react/dist/esm/icons/send.mjs";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routes";
import type { ContactFormContent } from "@/content/types";

type ContactFormProps = {
  locale: Locale;
  content: ContactFormContent;
};

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  website: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  interest: "opero-demo",
  message: "",
  website: "",
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-[var(--radius-button)] border border-[rgba(2,2,13,0.12)] bg-white px-3.5 py-3 text-[1rem] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-muted-light)] focus:border-[var(--color-blue)]";
const labelClass = "block text-[0.9rem] font-medium text-[var(--color-ink)]";

function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-[var(--color-blue)]">
      *
    </span>
  );
}

export function ContactForm({ locale, content }: ContactFormProps) {
  const formId = useId();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setSubmitState("error");
      setMessage(content.validationMessage);
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          locale,
          source: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      setSubmitState("success");
      setMessage(content.successMessage);
      setForm(initialState);
    } catch {
      setSubmitState("error");
      setMessage(content.errorMessage);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          autoComplete="off"
          id={`${formId}-website`}
          name="website"
          tabIndex={-1}
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-5 max-[809px]:grid-cols-1">
        <label className={labelClass} htmlFor={`${formId}-name`}>
          {content.nameLabel}
          <RequiredMark />
          <input
            autoComplete="name"
            className={inputClass}
            id={`${formId}-name`}
            name="name"
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>
        <label className={labelClass} htmlFor={`${formId}-company`}>
          {content.companyLabel}
          <input
            autoComplete="organization"
            className={inputClass}
            id={`${formId}-company`}
            name="company"
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-5 max-[809px]:grid-cols-1">
        <label className={labelClass} htmlFor={`${formId}-email`}>
          {content.emailLabel}
          <RequiredMark />
          <input
            autoComplete="email"
            className={inputClass}
            id={`${formId}-email`}
            name="email"
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label className={labelClass} htmlFor={`${formId}-phone`}>
          {content.phoneLabel}
          <input
            autoComplete="tel"
            className={inputClass}
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>
      </div>

      <label className={labelClass} htmlFor={`${formId}-interest`}>
        {content.interestLabel}
        <select
          className={`${inputClass} appearance-none`}
          id={`${formId}-interest`}
          name="interest"
          value={form.interest}
          onChange={(event) => updateField("interest", event.target.value)}
        >
          {content.interestOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass} htmlFor={`${formId}-message`}>
        {content.messageLabel}
        <RequiredMark />
        <textarea
          className={`${inputClass} min-h-36 resize-y leading-[1.6]`}
          id={`${formId}-message`}
          name="message"
          required
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>

      <p className="m-0 text-[0.82rem] leading-[1.6] text-[var(--color-muted)]">
        {content.consent}{" "}
        <Link
          className="underline decoration-[var(--color-blue)]/40 underline-offset-2 transition-colors hover:text-[var(--color-ink)] hover:decoration-[var(--color-blue)]"
          href={localizePath(locale, "privacy")}
        >
          {content.consentLinkLabel}
        </Link>
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="action action-ink disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitState === "submitting"}
          type="submit"
        >
          <SendIcon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          {submitState === "submitting" ? content.submittingLabel : content.submitLabel}
        </button>
        {message ? (
          <p
            aria-live="polite"
            className={`m-0 text-[0.92rem] leading-[1.55] ${submitState === "success" ? "text-[var(--color-blue-deep)]" : "text-[#9b1c1c]"}`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
