"use client";

import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import Script from "next/script";
import {
  ButtonSpinner,
  NotebookButton,
  SwapLabel,
} from "@/components/ui/notebook-button";
import { cn } from "@/lib/cn";
import sheet from "./contact.module.css";

const styles = {
  form: cn(sheet.form, sheet.snap),
  title: cn("text-h3 text-graphite", sheet.formTitle),
  intro: cn("text-body text-graphite-soft", sheet.formIntro),
  fields: cn(sheet.fields, sheet.snap, "[--snap-base:var(--c1)]"),
  field: "min-w-0",
  fieldWide: cn("min-w-0", sheet.wide),
  label: cn("text-label text-graphite", sheet.label),
  control: sheet.control,
  error: sheet.fieldError,
  verification: sheet.verification,
  submitRow: sheet.submitRow,
  status: sheet.status,
  statusMessage: sheet.statusMessage,
} as const;

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type FormCopy = {
  formTitle: string;
  formIntro: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submit: string;
  submitPending: string;
  submitting: string;
  success: string;
  errorGeneric: string;
  errorRateLimit: string;
  verification: string;
  verificationRequired: string;
  validation: {
    required: string;
    email: string;
    tooShort: string;
    tooLong: string;
  };
};

const FIELD_NAMES: readonly FieldName[] = ["name", "email", "message"];

function getFieldError(
  field: HTMLInputElement | HTMLTextAreaElement,
  copy: FormCopy["validation"],
) {
  const value = field.value.trim();
  if (field.required && !value) return copy.required;
  if (field.validity.typeMismatch) return copy.email;
  // Checked by hand: `validity.tooShort` ignores values set by script.
  if (field.minLength > 0 && value.length < field.minLength)
    return copy.tooShort;
  if (field.maxLength > 0 && field.value.length > field.maxLength)
    return copy.tooLong;
  return "";
}

/*
 * Form state machine. One phase at a time, so one message at a time:
 *
 *   idle ──token──▶ ready ──submit──▶ sending ──▶ sent | error
 *     │                                              │
 *     └─submit without token─▶ needs-verification ───┘ (token → ready)
 *
 * The Turnstile token is tracked beside the phase: after a send the widget
 * resets and may hand over a new token while "sent" is still on screen.
 */
type Phase =
  "idle" | "needs-verification" | "ready" | "sending" | "sent" | "error";

type FormState = { phase: Phase; token: string; error: string };

type FormEventAction =
  | { type: "token"; token: string }
  | { type: "token-expired" }
  | { type: "submit-unverified" }
  | { type: "send" }
  | { type: "sent" }
  | { type: "failed"; error: string }
  | { type: "edit" };

const initialState: FormState = { phase: "idle", token: "", error: "" };

function formReducer(state: FormState, action: FormEventAction): FormState {
  switch (action.type) {
    case "token":
      return {
        ...state,
        token: action.token,
        // A fresh token answers the verification hint; it never hides a
        // result the visitor has not read yet.
        phase:
          state.phase === "idle" || state.phase === "needs-verification"
            ? "ready"
            : state.phase,
      };
    case "token-expired":
      return {
        ...state,
        token: "",
        phase: state.phase === "ready" ? "idle" : state.phase,
      };
    case "submit-unverified":
      return { ...state, phase: "needs-verification", error: "" };
    case "send":
      return { ...state, phase: "sending", error: "" };
    case "sent":
      return { phase: "sent", token: "", error: "" };
    case "failed":
      return { phase: "error", token: "", error: action.error };
    case "edit":
      // The confirmation belongs to the message just sent; typing a new
      // one clears it.
      return state.phase === "sent"
        ? { ...state, phase: state.token ? "ready" : "idle" }
        : state;
  }
}

function statusFor(state: FormState, copy: FormCopy) {
  switch (state.phase) {
    case "needs-verification":
      return { text: copy.verificationRequired, tone: "neutral" } as const;
    case "sending":
      // The button already shows "Sending…"; this is for screen readers.
      return { text: copy.submitting, tone: "hidden" } as const;
    case "sent":
      return { text: copy.success, tone: "success" } as const;
    case "error":
      return { text: state.error, tone: "error" } as const;
    default:
      return null;
  }
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

type FieldProps = {
  name: FieldName;
  label: string;
  error?: string;
  wide?: boolean;
} & (
  | ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
  | ({ multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
);

function Field({ name, label, error, wide, multiline, ...props }: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    className: styles.control,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const;
  return (
    <div className={wide ? styles.fieldWide : styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...shared}
        />
      ) : (
        <input
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          {...shared}
        />
      )}
      {error ? (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm({
  copy,
  locale,
  className,
}: {
  copy: FormCopy;
  locale: string;
  className?: string;
}) {
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

  const [state, dispatch] = useReducer(formReducer, initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const inFlight = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);
  const sending = state.phase === "sending";

  useEffect(() => {
    if (!scriptReady || !siteKey || !container.current || !window.turnstile)
      return;
    const turnstile = window.turnstile;
    const id = turnstile.render(container.current, {
      sitekey: siteKey,
      size: "compact",
      action: "contact",
      callback: (token: string) => dispatch({ type: "token", token }),
      "expired-callback": () => dispatch({ type: "token-expired" }),
      "error-callback": () =>
        dispatch({ type: "failed", error: copy.verification }),
    });
    widget.current = id;
    return () => {
      turnstile.remove(id);
      widget.current = null;
    };
  }, [scriptReady, siteKey, copy.verification]);

  function validateField(field: HTMLInputElement | HTMLTextAreaElement) {
    const name = field.name as FieldName;
    const error = getFieldError(field, copy.validation);
    setErrors((current) => ({ ...current, [name]: error }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;

    // Field errors first, each beside its field; focus the first one.
    const fieldErrors: FieldErrors = {};
    let firstInvalid: HTMLInputElement | HTMLTextAreaElement | null = null;
    for (const name of FIELD_NAMES) {
      const field = form.elements.namedItem(name) as
        HTMLInputElement | HTMLTextAreaElement;
      const error = getFieldError(field, copy.validation);
      if (error) {
        fieldErrors[name] = error;
        firstInvalid ??= field;
      }
    }
    setErrors(fieldErrors);
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    if (!state.token) {
      dispatch({ type: "submit-unverified" });
      return;
    }

    const values = new FormData(form);
    inFlight.current = true;
    dispatch({ type: "send" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          email: values.get("email"),
          message: values.get("message"),
          token: state.token,
        }),
      });
      if (response.ok) {
        form.reset();
        setErrors({});
        dispatch({ type: "sent" });
        return;
      }
      if (response.status === 422) {
        const result: { fields?: Record<string, unknown> } =
          await response.json();
        const serverErrors: FieldErrors = {};
        for (const name of FIELD_NAMES) {
          const code = result.fields?.[name];
          if (
            code === "required" ||
            code === "email" ||
            code === "tooShort" ||
            code === "tooLong"
          )
            serverErrors[name] = copy.validation[code];
        }
        setErrors(serverErrors);
      }
      dispatch({
        type: "failed",
        error:
          response.status === 429
            ? copy.errorRateLimit
            : response.status === 403
              ? copy.verification
              : copy.errorGeneric,
      });
    } catch {
      dispatch({ type: "failed", error: copy.errorGeneric });
    } finally {
      inFlight.current = false;
      // A token is single-use: every attempt asks Turnstile for a new one.
      if (widget.current) window.turnstile?.reset(widget.current);
    }
  }

  // The form exists only when the server confirms a configured provider.
  // Until then the direct contact routes beside it are the whole section.
  if (!siteKey) return null;

  const status = statusFor(state, copy);
  const fieldEvents = {
    disabled: sending,
    onBlur: (event: {
      currentTarget: HTMLInputElement | HTMLTextAreaElement;
    }) => validateField(event.currentTarget),
    onInput: (event: {
      currentTarget: HTMLInputElement | HTMLTextAreaElement;
    }) => {
      const name = event.currentTarget.name as FieldName;
      if (errors[name]) validateField(event.currentTarget);
    },
  };

  return (
    <form
      className={cn(styles.form, className)}
      data-grid-snap
      lang={locale}
      noValidate
      aria-labelledby="contact-form-title"
      onSubmit={submit}
      onInput={() => dispatch({ type: "edit" })}
    >
      <h3 className={styles.title} id="contact-form-title">
        {copy.formTitle}
      </h3>
      <p className={styles.intro}>{copy.formIntro}</p>
      <div className={styles.fields} data-grid-snap>
        <Field
          {...fieldEvents}
          name="name"
          label={copy.nameLabel}
          error={errors.name}
          autoComplete="name"
          required
          maxLength={100}
        />
        <Field
          {...fieldEvents}
          name="email"
          label={copy.emailLabel}
          error={errors.email}
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
        <Field
          {...fieldEvents}
          multiline
          wide
          name="message"
          label={copy.messageLabel}
          error={errors.message}
          required
          minLength={10}
          maxLength={5000}
          rows={6}
        />
      </div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => dispatch({ type: "failed", error: copy.verification })}
      />
      <div ref={container} className={styles.verification} />
      <div className={styles.submitRow}>
        <NotebookButton type="submit" loading={sending}>
          <SwapLabel
            active={sending ? "sending" : "idle"}
            labels={{
              idle: copy.submit,
              sending: (
                <>
                  <ButtonSpinner />
                  {copy.submitPending}
                </>
              ),
            }}
          />
        </NotebookButton>
      </div>
      <p className={styles.status} role="status" aria-live="polite">
        {status ? (
          <span
            // A new key re-runs the entry transition for each new message.
            key={`${state.phase}:${status.text}`}
            className={cn(
              styles.statusMessage,
              status.tone === "hidden" && "sr-only",
            )}
            data-tone={status.tone}
          >
            {status.text}
          </span>
        ) : null}
      </p>
    </form>
  );
}
