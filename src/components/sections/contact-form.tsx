"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/b-button";

const styles = {
  form: "space-y-5 border border-border-subtle bg-surface p-5 sm:p-7",
  title: "m-0 font-display text-xl font-semibold text-foreground",
  intro: "m-0 text-sm leading-6 text-muted-foreground",
  fields: "grid gap-4 sm:grid-cols-2",
  field: "min-w-0 space-y-2",
  fieldWide: "space-y-2 sm:col-span-2",
  label: "block text-sm font-medium text-foreground",
  input:
    "min-h-11 w-full rounded-control border border-control-border bg-background px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 aria-invalid:border-error",
  textarea:
    "min-h-36 w-full resize-y rounded-control border border-control-border bg-background px-3 py-2.5 text-base leading-6 text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 aria-invalid:border-error",
  error: "m-0 text-sm leading-5 text-error",
  status:
    "border-l-2 border-accent bg-background/70 px-4 py-3 text-sm leading-6 text-navigation",
} as const;

type FieldName = "name" | "email" | "message";
type FormCopy = {
  formTitle: string;
  formIntro: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submit: string;
  providerPending: string;
  submitting: string;
  success: string;
  errorGeneric: string;
  errorRateLimit: string;
  verification: string;
  validation: {
    required: string;
    email: string;
    tooShort: string;
    tooLong: string;
  };
};

function getFieldError(
  field: HTMLInputElement | HTMLTextAreaElement,
  copy: FormCopy["validation"],
) {
  if (field.validity.valueMissing) return copy.required;
  if (field.validity.typeMismatch) return copy.email;
  if (field.validity.tooShort) return copy.tooShort;
  if (field.validity.tooLong) return copy.tooLong;
  return "";
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}
export function ContactForm({ copy }: { copy: FormCopy }) {
  const [siteKey, setSiteKey] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/contact/config", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { siteKey?: unknown } | null) => {
        if (typeof data?.siteKey === "string" && data.siteKey)
          setSiteKey(data.siteKey);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [statusText, setStatusText] = useState("");
  const [token, setToken] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const inFlight = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);
  useEffect(() => {
    if (!scriptReady || !siteKey || !container.current || !window.turnstile)
      return;
    const turnstile = window.turnstile;
    const id = turnstile.render(container.current, {
      sitekey: siteKey,
      size: "compact",
      action: "contact",
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => {
        setToken("");
        setStatus("error");
        setStatusText(copy.verification);
      },
    });
    widget.current = id;
    return () => {
      turnstile.remove(id);
      widget.current = null;
    };
  }, [scriptReady, siteKey, copy.verification]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !token) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    inFlight.current = true;
    setStatus("submitting");
    setStatusText(copy.submitting);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          email: values.get("email"),
          message: values.get("message"),
          token,
        }),
      });
      if (response.ok) {
        form.reset();
        setErrors({});
        setStatus("success");
        setStatusText(copy.success);
      } else {
        if (response.status === 422) {
          const result: { fields?: Record<string, unknown> } =
            await response.json();
          const fieldErrors: Partial<Record<FieldName, string>> = {};
          for (const name of ["name", "email", "message"] as const) {
            const code = result.fields?.[name];
            if (
              code === "required" ||
              code === "email" ||
              code === "tooShort" ||
              code === "tooLong"
            )
              fieldErrors[name] = copy.validation[code];
          }
          setErrors(fieldErrors);
        }
        setStatus("error");
        setStatusText(
          response.status === 429
            ? copy.errorRateLimit
            : response.status === 403
              ? copy.verification
              : copy.errorGeneric,
        );
      }
    } catch {
      setStatus("error");
      setStatusText(copy.errorGeneric);
    } finally {
      inFlight.current = false;
      setToken("");
      if (widget.current) window.turnstile?.reset(widget.current);
    }
  }

  function validateField(field: HTMLInputElement | HTMLTextAreaElement) {
    const name = field.name as FieldName;
    const error = getFieldError(field, copy.validation);
    setErrors((current) => ({ ...current, [name]: error }));
  }

  return (
    <form
      className={styles.form}
      aria-labelledby="contact-form-title"
      onSubmit={submit}
    >
      <h3 className={styles.title} id="contact-form-title">
        {copy.formTitle}
      </h3>
      <p className={styles.intro}>{copy.formIntro}</p>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-name">
            {copy.nameLabel}
          </label>
          <input
            className={styles.input}
            id="contact-name"
            name="name"
            autoComplete="name"
            disabled={status === "submitting"}
            required
            maxLength={100}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onBlur={(event) => validateField(event.currentTarget)}
            onInput={(event) => {
              if (errors.name) validateField(event.currentTarget);
            }}
          />
          {errors.name ? (
            <p
              className={styles.error}
              id="contact-name-error"
              aria-live="polite"
            >
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">
            {copy.emailLabel}
          </label>
          <input
            className={styles.input}
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={status === "submitting"}
            required
            maxLength={254}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            onBlur={(event) => validateField(event.currentTarget)}
            onInput={(event) => {
              if (errors.email) validateField(event.currentTarget);
            }}
          />
          {errors.email ? (
            <p
              className={styles.error}
              id="contact-email-error"
              aria-live="polite"
            >
              {errors.email}
            </p>
          ) : null}
        </div>
        <div className={styles.fieldWide}>
          <label className={styles.label} htmlFor="contact-message">
            {copy.messageLabel}
          </label>
          <textarea
            className={styles.textarea}
            id="contact-message"
            name="message"
            disabled={status === "submitting"}
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            onBlur={(event) => validateField(event.currentTarget)}
            onInput={(event) => {
              if (errors.message) validateField(event.currentTarget);
            }}
          />
          {errors.message ? (
            <p
              className={styles.error}
              id="contact-message-error"
              aria-live="polite"
            >
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>
      {siteKey ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={() => setScriptReady(true)}
            onError={() => {
              setStatus("error");
              setStatusText(copy.verification);
            }}
          />
          <div ref={container} />
        </>
      ) : null}
      <p className={styles.status} role="status" aria-live="polite">
        {siteKey ? statusText : copy.providerPending}
      </p>
      <Button
        disabled={!siteKey || !token || status === "submitting"}
        loading={status === "submitting"}
        type="submit"
        disableRipple
      >
        {copy.submit}
      </Button>
    </form>
  );
}
