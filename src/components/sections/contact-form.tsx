"use client";

import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
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
import type {
  PaperPlaneProps,
  PlaneOutcome,
} from "@/components/contact/paper-plane/paper-plane";
import type { ContactMock } from "@/lib/contact/mock";
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
  sent: sheet.sent,
  sentTitle: cn("text-h3 text-graphite", sheet.sentTitle),
  sentBody: cn("text-body text-graphite", sheet.sentBody),
  sentEmail: sheet.sentEmail,
  sentActions: sheet.sentActions,
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
  sentTitle: string;
  /** Raw message with an `{email}` placeholder for the visitor's address. */
  sentBody: string;
  sendAnother: string;
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
const TURNSTILE_FLEXIBLE_MIN_WIDTH = 300;
/** How long the form's content takes to fade before the sheet takes over. */
const COLLECT_MS = 200;
/** The tallest the success card gets, to keep it inside the form's box. */
const SENT_CARD_MAX_HEIGHT = 240;

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
 *   sent ──"send another"──▶ idle (a new token → ready)
 *
 * The Turnstile token is tracked beside the phase: after a send the widget
 * resets and may hand over a new token while a result is still on screen.
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
  | { type: "edit" }
  | { type: "again" };

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
    case "again":
      // The used token is gone; the widget is reset for a new one.
      return { phase: "idle", token: "", error: "" };
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
      // The success card shows it; the status line announces it as soon as
      // the server confirms, without waiting for the plane.
      return { text: copy.sentTitle, tone: "hidden" } as const;
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

/*
 * The paper plane is loaded the first time a field takes focus, so it costs
 * nothing until someone starts writing. A failed load means no animation:
 * the form then crossfades to the success card, as with reduced motion.
 */
type PaperPlane = ComponentType<PaperPlaneProps>;
let paperPlane: Promise<PaperPlane | null> | null = null;

function loadPaperPlane() {
  paperPlane ??= import("@/components/contact/paper-plane/paper-plane").then(
    (module) => module.default,
    () => {
      paperPlane = null;
      return null;
    },
  );
  return paperPlane;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Where the success card goes inside the form: at the top, or, when the
 * form's top is scrolled out of view (a phone), one cell below the top of
 * what the visitor can see, on the grid.
 */
function sentCardTop(form: HTMLFormElement) {
  const rect = form.getBoundingClientRect();
  const header = document.querySelector("header");
  const ceiling = Math.max(
    window.visualViewport?.offsetTop ?? 0,
    header && getComputedStyle(header).position === "fixed"
      ? header.getBoundingClientRect().bottom
      : 0,
  );
  const hidden = ceiling - rect.top;
  if (hidden <= 0) return 0;
  const cell =
    parseFloat(getComputedStyle(form).getPropertyValue("--grid-cell")) || 20;
  const lowest = Math.floor((rect.height - SENT_CARD_MAX_HEIGHT) / cell) * cell;
  return Math.max(0, Math.min(Math.ceil(hidden / cell) * cell + cell, lowest));
}

type SendResult =
  { ok: true } | { ok: false; error: string; fields: FieldErrors };

type SentCardState = { email: string; top: number; leaving: boolean };

function SentCard({
  copy,
  card,
  onAgain,
}: {
  copy: Pick<FormCopy, "sentTitle" | "sentBody" | "sendAnother">;
  card: SentCardState;
  onAgain: () => void;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus();
  }, []);
  const [before, after] = copy.sentBody.split("{email}");
  return (
    <div
      className={styles.sent}
      data-leaving={card.leaving || undefined}
      style={{ "--sent-top": `${card.top}px` } as CSSProperties}
    >
      <h3 ref={title} className={styles.sentTitle} tabIndex={-1}>
        {copy.sentTitle}
      </h3>
      <p className={styles.sentBody}>
        {before}
        <span className={styles.sentEmail}>{card.email}</span>
        {after}
      </p>
      <div className={styles.sentActions}>
        <NotebookButton type="button" variant="secondary" onClick={onAgain}>
          {copy.sendAnother}
        </NotebookButton>
      </div>
    </div>
  );
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
  const [state, dispatch] = useReducer(formReducer, initialState);
  // Development only: a stand-in service (see src/lib/contact/mock.ts).
  const mock = useRef<ContactMock | null>(null);
  const [mocked, setMocked] = useState<{ speed: number } | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const loadConfig = () =>
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

    if (process.env.NODE_ENV !== "production") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("mockContact")) {
        void import("@/lib/contact/mock").then(({ createContactMock }) => {
          if (!active) return;
          const contactMock = createContactMock(params);
          if (!contactMock) return void loadConfig();
          mock.current = contactMock;
          setMocked({ speed: contactMock.speed });
          setSiteKey("mock");
          dispatch({ type: "token", token: "mock" });
        });
        return () => {
          active = false;
          controller.abort();
        };
      }
    }

    void loadConfig();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const inFlight = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);
  const sending = state.phase === "sending";

  // The send animation: the plane, the form's content faded away, the card.
  const [Plane, setPlane] = useState<PaperPlane | null>(null);
  const [flight, setFlight] = useState<{
    form: HTMLFormElement;
    outcome: PlaneOutcome | null;
  } | null>(null);
  const [away, setAway] = useState(false);
  const [card, setCard] = useState<SentCardState | null>(null);
  const sentCard = useRef<SentCardState | null>(null);
  const failure = useRef<Extract<SendResult, { ok: false }> | null>(null);
  const focusOnReturn = useRef<{
    element: HTMLElement | null;
    preventScroll: boolean;
  } | null>(null);

  // Turnstile's flexible size needs at least 300px; narrower columns (a
  // phone) get the compact widget instead of overflowing the sheet.
  const [widgetSize, setWidgetSize] = useState<"flexible" | "compact" | null>(
    null,
  );
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setWidgetSize(
        entry.contentRect.width >= TURNSTILE_FLEXIBLE_MIN_WIDTH
          ? "flexible"
          : "compact",
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [siteKey]);

  useEffect(() => {
    if (
      !scriptReady ||
      !siteKey ||
      !widgetSize ||
      !container.current ||
      !window.turnstile
    )
      return;
    const turnstile = window.turnstile;
    const id = turnstile.render(container.current, {
      sitekey: siteKey,
      action: "contact",
      // Fixed, so the widget matches the paper page instead of following
      // the system's dark mode or the browser's language.
      theme: "light",
      language: locale,
      size: widgetSize,
      callback: (token: string) => dispatch({ type: "token", token }),
      "expired-callback": () => dispatch({ type: "token-expired" }),
      "error-callback": () =>
        dispatch({ type: "failed", error: copy.verification }),
    });
    widget.current = id;
    return () => {
      turnstile.remove(id);
      widget.current = null;
      // The removed widget's token cannot be used any more.
      dispatch({ type: "token-expired" });
    };
  }, [scriptReady, siteKey, widgetSize, locale, copy.verification]);

  // The form comes back (an error, or "send another"): focus where the
  // visitor continues, once it can take focus again.
  useEffect(() => {
    if (away || !focusOnReturn.current) return;
    const { element, preventScroll } = focusOnReturn.current;
    element?.focus({ preventScroll });
    focusOnReturn.current = null;
  }, [away]);

  // A leaving card fades out, then goes.
  useEffect(() => {
    if (!card?.leaving) return;
    const timer = window.setTimeout(() => setCard(null), 200);
    return () => window.clearTimeout(timer);
  }, [card?.leaving]);

  function validateField(field: HTMLInputElement | HTMLTextAreaElement) {
    const name = field.name as FieldName;
    const error = getFieldError(field, copy.validation);
    setErrors((current) => ({ ...current, [name]: error }));
  }

  /** A token is single-use: every new attempt needs a fresh one. */
  function refreshVerification() {
    if (mock.current) dispatch({ type: "token", token: "mock" });
    else if (widget.current) window.turnstile?.reset(widget.current);
  }

  function warmPaperPlane() {
    if (Plane || prefersReducedMotion()) return;
    void loadPaperPlane().then((component) => {
      if (component) setPlane(() => component);
    });
  }

  async function readResult(response: Response): Promise<SendResult> {
    if (response.ok) return { ok: true };
    const fields: FieldErrors = {};
    if (response.status === 422) {
      const result: { fields?: Record<string, unknown> } = await response
        .json()
        .catch(() => ({}));
      for (const name of FIELD_NAMES) {
        const code = result.fields?.[name];
        if (
          code === "required" ||
          code === "email" ||
          code === "tooShort" ||
          code === "tooLong"
        )
          fields[name] = copy.validation[code];
      }
    }
    return {
      ok: false,
      fields,
      error:
        response.status === 429
          ? copy.errorRateLimit
          : response.status === 403
            ? copy.verification
            : copy.errorGeneric,
    };
  }

  function applyFailure(
    result: Extract<SendResult, { ok: false }>,
    form: HTMLFormElement,
    refocus: boolean,
  ) {
    setErrors(result.fields);
    dispatch({ type: "failed", error: result.error });
    refreshVerification();
    inFlight.current = false;
    if (!refocus) return;
    // Focus was lost with the hidden form: give it back where it helps.
    // Both were on screen a moment ago, so the page is not scrolled.
    const invalid = FIELD_NAMES.find((name) => result.fields[name]);
    focusOnReturn.current = {
      element: invalid
        ? (form.elements.namedItem(invalid) as HTMLElement)
        : form.querySelector<HTMLElement>("button[type=submit]"),
      preventScroll: true,
    };
  }

  function showCard() {
    if (sentCard.current) setCard(sentCard.current);
  }

  function sendAnother(form: HTMLFormElement) {
    form.reset();
    setErrors({});
    dispatch({ type: "again" });
    refreshVerification();
    sentCard.current = null;
    setCard((current) => current && { ...current, leaving: true });
    // The name field may be above the screen on a phone: scroll to it.
    focusOnReturn.current = {
      element: form.elements.namedItem("name") as HTMLElement,
      preventScroll: false,
    };
    setAway(false);
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
    // Stays set until the animation has finished: no second send meanwhile.
    inFlight.current = true;
    dispatch({ type: "send" });
    const request = mock.current
      ? mock.current.send()
      : fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.get("name"),
            email: values.get("email"),
            message: values.get("message"),
            token: state.token,
          }),
        });
    const result = request.then(readResult, () => ({
      ok: false as const,
      fields: {},
      error: copy.errorGeneric,
    }));
    sentCard.current = {
      email: String(values.get("email") ?? "").trim(),
      top: sentCardTop(form),
      leaving: false,
    };

    // The plane folds while the request is out; it takes off only once the
    // server has confirmed.
    const component = prefersReducedMotion() ? null : await loadPaperPlane();
    const flying = Boolean(component);
    if (component) {
      setPlane(() => component);
      setFlight({ form, outcome: null });
      setAway(true);
    }

    const outcome = await result;
    if (outcome.ok) {
      setErrors({});
      // Announced now; the card waits for the plane.
      dispatch({ type: "sent" });
      if (flying)
        setFlight((current) => current && { ...current, outcome: "sent" });
      else {
        showCard();
        setAway(true);
        inFlight.current = false;
      }
      return;
    }
    if (flying) {
      failure.current = outcome;
      setFlight((current) => current && { ...current, outcome: "failed" });
    } else applyFailure(outcome, form, false);
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
    <>
      <form
        ref={formRef}
        className={cn(styles.form, className)}
        data-grid-snap
        data-away={away || undefined}
        style={
          mocked && mocked.speed !== 1
            ? ({
                "--collect": `${COLLECT_MS / mocked.speed}ms`,
              } as CSSProperties)
            : undefined
        }
        lang={locale}
        noValidate
        aria-labelledby="contact-form-title"
        onSubmit={submit}
        onInput={() => dispatch({ type: "edit" })}
        onFocus={warmPaperPlane}
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
        {mocked ? null : (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={() => setScriptReady(true)}
            onError={() =>
              dispatch({ type: "failed", error: copy.verification })
            }
          />
        )}
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
        {card ? (
          <SentCard
            copy={copy}
            card={card}
            onAgain={() => {
              if (formRef.current) sendAnother(formRef.current);
            }}
          />
        ) : null}
      </form>
      {Plane && flight ? (
        <Plane
          form={flight.form}
          outcome={flight.outcome}
          speed={mocked?.speed ?? 1}
          onCardCue={showCard}
          onRestore={() => {
            const result = failure.current;
            failure.current = null;
            setAway(false);
            if (result) applyFailure(result, flight.form, true);
          }}
          onFinish={() => {
            setFlight(null);
            inFlight.current = false;
          }}
        />
      ) : null}
    </>
  );
}
