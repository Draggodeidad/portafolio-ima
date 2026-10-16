"use client";

import { useState } from "react";
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
  disabledButton:
    "min-h-11 !cursor-not-allowed !border-control-border !bg-control-surface !text-muted-foreground opacity-100",
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

export function ContactForm({ copy }: { copy: FormCopy }) {
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  function validateField(field: HTMLInputElement | HTMLTextAreaElement) {
    const name = field.name as FieldName;
    const error = getFieldError(field, copy.validation);
    setErrors((current) => ({ ...current, [name]: error }));
  }

  return (
    <form
      className={styles.form}
      aria-labelledby="contact-form-title"
      onSubmit={(event) => event.preventDefault()}
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
      <p className={styles.status} role="status">
        {copy.providerPending}
      </p>
      <Button
        className={styles.disabledButton}
        disabled
        type="submit"
        disableRipple
      >
        {copy.submit}
      </Button>
    </form>
  );
}
