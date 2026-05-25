"use client";

import { useId, useRef, useState } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import {
  CUSTOMER_ID,
  SITE_ID,
  SOURCE_PROVIDER,
  READY_OPTIONS,
  HEARD_FROM_OPTIONS,
  leadIsQualified,
  type ReadyValue,
  type HeardFromValue,
  type Territory,
} from "./Brand";

interface LeadFormProps {
  territory: Territory;
  variant?: "hero" | "contact";
  headline?: string;
  subhead?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
  ready: ReadyValue | "";
  heardFrom: HeardFromValue | "";
}

const initial: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  zip: "",
  ready: "",
  heardFrom: "",
};

type FieldKey = keyof FormData;
type FieldErrors = Partial<Record<FieldKey, string>>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    MegaTag?: {
      trackEvent?: (
        eventName: string,
        eventData?: Record<string, unknown>
      ) => void;
      [k: string]: unknown;
    };
  }
}

const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

function validateField(key: FieldKey, value: string): string | undefined {
  switch (key) {
    case "firstName":
      if (!value.trim()) return "Please enter your first name.";
      return undefined;
    case "lastName":
      if (!value.trim()) return "Please enter your last name.";
      return undefined;
    case "email": {
      const v = value.trim();
      if (!v) return "Please enter your email address.";
      if (!EMAIL_RE.test(v)) return "Please enter a valid email address.";
      return undefined;
    }
    case "phone": {
      const digits = value.replace(/\D/g, "");
      if (!digits) return "Please enter your phone number.";
      if (digits.length !== 10) return "Phone must be a 10-digit number.";
      return undefined;
    }
    case "zip": {
      const v = value.trim();
      if (!v) return "Please enter your home ZIP code.";
      if (!ZIP_RE.test(v)) return "Please enter a valid 5-digit ZIP code.";
      return undefined;
    }
    case "ready":
      if (!value) return "Please answer Yes or No.";
      return undefined;
    case "heardFrom":
      // Optional per task spec — never required.
      return undefined;
  }
}

function validateAll(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  (Object.keys(data) as FieldKey[]).forEach((k) => {
    const err = validateField(k, data[k]);
    if (err) errors[k] = err;
  });
  return errors;
}

export function LeadForm({
  territory,
  variant = "hero",
  headline,
  subhead,
}: LeadFormProps) {
  const { status, errorMessage, submitLead } = useMegaLeadForm({
    customerId: CUSTOMER_ID,
    siteId: SITE_ID,
    sourceProvider: SOURCE_PROVIDER,
    pagePath: `/${territory.id}`,
  });

  const fid = useId();
  const id = (k: string) => `${k}-${fid}`;
  const errId = (k: string) => `${k}-${fid}-err`;

  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});
  const [data, setData] = useState<FormData>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const inFlightRef = useRef(false);

  const update = <K extends FieldKey>(k: K, v: FormData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((prev) => {
      if (!prev[k]) return prev;
      const err = validateField(k, String(v));
      if (err) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const markTouched = (k: FieldKey, currentValue: string) => {
    setTouched((t) => ({ ...t, [k]: true }));
    const err = validateField(k, currentValue);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[k] = err;
      else delete next[k];
      return next;
    });
  };

  const submitting = status === "submitting";
  const success = status === "success" || submitted;

  const formatPhone = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 10);
    const p = [];
    if (d.length > 0) p.push(d.slice(0, 3));
    if (d.length >= 4) p.push(d.slice(3, 6));
    if (d.length >= 7) p.push(d.slice(6, 10));
    return p.join("-");
  };

  // Validate FIRST, then submit. Button is type="button" — bypasses the
  // optimizer's capture-phase submit listener so empty submits never fire
  // a phantom form_submit event. (SHLY Optimizer Empty-Submit fix.)
  const handleClick = async () => {
    if (submitting || success || inFlightRef.current) return;
    const allErrors = validateAll(data);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        zip: true,
        ready: true,
        heardFrom: true,
      });
      const order: FieldKey[] = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "zip",
        "ready",
      ];
      const firstBad = order.find((k) => allErrors[k]);
      if (firstBad) {
        const el = fieldRefs.current[firstBad];
        if (el) {
          try {
            (el as HTMLInputElement).focus({ preventScroll: false });
          } catch {
            el.focus();
          }
        }
      }
      return;
    }
    inFlightRef.current = true;

    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const email = data.email.trim();
    const phone = data.phone.replace(/\D/g, "");
    const zip = data.zip.trim();
    const ready = data.ready as ReadyValue;
    const heardFrom = data.heardFrom as HeardFromValue;

    const readyLabel =
      READY_OPTIONS.find((o) => o.value === ready)?.label ?? ready;
    const heardFromLabel =
      HEARD_FROM_OPTIONS.find((o) => o.value === heardFrom)?.label ?? "";

    const { qualified, reason } = leadIsQualified({ ready });

    try {
      // 1. Lead API — ALL leads submit, qualified or not (Peter mandate 2026-05-14).
      //    Disqualified leads still reach CRM tagged with qualified:no + reason.
      await submitLead({
        firstName,
        lastName,
        email,
        phone,
        zip,
        ready,
        readyLabel,
        heardFrom,
        heardFromLabel,
        territory: territory.id,
        territoryName: territory.name,
        territoryPhone: territory.phoneDisplay,
        qualified: qualified ? "yes" : "no",
        disqualification_reason: reason,
      });

      // 2. Manual form_submit through MegaTag — separated field keys so
      //    Conversions tab shows each field as its own column.
      if (typeof window !== "undefined" && window.MegaTag?.trackEvent) {
        try {
          window.MegaTag.trackEvent("form_submit", {
            element: `form-${variant}-${territory.id}`,
            firstName,
            lastName,
            email,
            phone,
            zip,
            ready,
            readyLabel,
            heardFrom,
            heardFromLabel,
            territory: territory.id,
            territoryName: territory.name,
            qualified: qualified ? "yes" : "no",
            disqualification_reason: reason,
          });

          // 3. qualified_lead fires ONLY when Q1 was "yes". This is the
          //    optimization signal for paid campaigns.
          if (qualified) {
            window.MegaTag.trackEvent("qualified_lead", {
              element: `form-${variant}-${territory.id}`,
              firstName,
              lastName,
              email,
              phone,
              zip,
              territory: territory.id,
              territoryName: territory.name,
            });
          }
        } catch {
          /* silent */
        }
      }

      // 4. GTM dataLayer — form_submission for all, qualified_lead only for qualified.
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "form_submission",
          form_id: `frhc-${territory.id}-${variant}`,
          territory: territory.id,
          qualified: qualified ? "yes" : "no",
          disqualification_reason: reason,
        });
        if (qualified) {
          window.dataLayer.push({
            event: "qualified_lead",
            form_id: `frhc-${territory.id}-${variant}`,
            territory: territory.id,
          });
        }
      }

      setSubmitted(true);
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleNativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // ─── Success state — branch by qualified vs. not-ready ───
  if (success) {
    const wasQualified =
      leadIsQualified({ ready: data.ready as ReadyValue }).qualified;
    return (
      <div
        className={`rounded-2xl p-8 sm:p-10 ${
          variant === "hero"
            ? "bg-white shadow-2xl border border-[var(--color-border)]"
            : "bg-[var(--color-soft)] border border-[var(--color-border)]"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/15 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[var(--color-success)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path
                d="M20 6 9 17l-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-extrabold text-[var(--color-primary)] mb-2">
            Thank you{data.firstName ? `, ${data.firstName}` : ""}!
          </h3>
          {wasQualified ? (
            <p className="text-[var(--color-text-muted)] max-w-sm">
              We&rsquo;ve received your request. A {territory.name} care
              coordinator will call you shortly to confirm details and schedule
              your free in-home assessment — usually same day or next day.
              Need to speak with someone now? Call{" "}
              <a
                className="font-semibold text-[var(--color-primary)] underline"
                href={territory.phoneHref}
              >
                {territory.phoneDisplay}
              </a>
              .
            </p>
          ) : (
            <p className="text-[var(--color-text-muted)] max-w-sm">
              Thanks for reaching out. We&rsquo;ll keep your information on file
              so we&rsquo;re ready when the time is right. If anything changes
              or you&rsquo;d like to learn more, feel free to call{" "}
              <a
                className="font-semibold text-[var(--color-primary)] underline"
                href={territory.phoneHref}
              >
                {territory.phoneDisplay}
              </a>
              .
            </p>
          )}
        </div>
      </div>
    );
  }

  const showErr = (k: FieldKey) => Boolean(touched[k] && errors[k]);
  const inputCls = (k: FieldKey) =>
    `lp-input ${showErr(k) ? "lp-input-error" : ""}`;

  return (
    <form
      ref={formRef}
      onSubmit={handleNativeSubmit}
      noValidate
      className={`relative rounded-2xl p-6 sm:p-8 ${
        variant === "hero"
          ? "bg-white shadow-2xl border border-[var(--color-border)]"
          : "bg-white shadow-lg border border-[var(--color-border)]"
      }`}
      aria-describedby={
        status === "error" && errorMessage ? errId("form") : undefined
      }
    >
      {(headline || subhead) && (
        <div className="mb-5 sm:mb-6">
          {headline && (
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-primary)] leading-tight">
              {headline}
            </h3>
          )}
          {subhead && (
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              {subhead}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={id("firstName")} className="sr-only">
            First name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.firstName = el;
            }}
            id={id("firstName")}
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name *"
            className={inputCls("firstName")}
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            onBlur={(e) => markTouched("firstName", e.target.value)}
            disabled={submitting}
            aria-invalid={showErr("firstName") || undefined}
            aria-describedby={
              showErr("firstName") ? errId("firstName") : undefined
            }
          />
          {showErr("firstName") && (
            <p
              id={errId("firstName")}
              role="alert"
              aria-live="polite"
              className="lp-field-error"
            >
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={id("lastName")} className="sr-only">
            Last name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.lastName = el;
            }}
            id={id("lastName")}
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name *"
            className={inputCls("lastName")}
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            onBlur={(e) => markTouched("lastName", e.target.value)}
            disabled={submitting}
            aria-invalid={showErr("lastName") || undefined}
            aria-describedby={
              showErr("lastName") ? errId("lastName") : undefined
            }
          />
          {showErr("lastName") && (
            <p
              id={errId("lastName")}
              role="alert"
              aria-live="polite"
              className="lp-field-error"
            >
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor={id("email")} className="sr-only">
          Email
        </label>
        <input
          ref={(el) => {
            fieldRefs.current.email = el;
          }}
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          pattern="^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$"
          placeholder="Email address *"
          className={inputCls("email")}
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={(e) => markTouched("email", e.target.value)}
          disabled={submitting}
          aria-invalid={showErr("email") || undefined}
          aria-describedby={showErr("email") ? errId("email") : undefined}
        />
        {showErr("email") && (
          <p
            id={errId("email")}
            role="alert"
            aria-live="polite"
            className="lp-field-error"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={id("phone")} className="sr-only">
            Phone
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.phone = el;
            }}
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="Phone *"
            className={inputCls("phone")}
            value={data.phone}
            onChange={(e) => update("phone", formatPhone(e.target.value))}
            onBlur={(e) => markTouched("phone", e.target.value)}
            disabled={submitting}
            aria-invalid={showErr("phone") || undefined}
            aria-describedby={showErr("phone") ? errId("phone") : undefined}
          />
          {showErr("phone") && (
            <p
              id={errId("phone")}
              role="alert"
              aria-live="polite"
              className="lp-field-error"
            >
              {errors.phone}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={id("zip")} className="sr-only">
            Home ZIP code
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.zip = el;
            }}
            id={id("zip")}
            name="zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Home ZIP *"
            maxLength={10}
            className={inputCls("zip")}
            value={data.zip}
            onChange={(e) => update("zip", e.target.value)}
            onBlur={(e) => markTouched("zip", e.target.value)}
            disabled={submitting}
            aria-invalid={showErr("zip") || undefined}
            aria-describedby={showErr("zip") ? errId("zip") : undefined}
          />
          {showErr("zip") && (
            <p
              id={errId("zip")}
              role="alert"
              aria-live="polite"
              className="lp-field-error"
            >
              {errors.zip}
            </p>
          )}
        </div>
      </div>

      {/* Q1 — Ready to receive care? (Yes/No required) */}
      <div
        className="mt-4"
        ref={(el) => {
          fieldRefs.current.ready = el;
        }}
      >
        <label className="block text-xs uppercase tracking-wider font-bold text-[var(--color-primary)] mb-1.5">
          Are you or your loved one ready to receive care?{" "}
          <span className="text-red-600">*</span>
        </label>
        <div
          className="grid grid-cols-2 gap-2.5"
          role="radiogroup"
          aria-invalid={showErr("ready") || undefined}
          aria-describedby={showErr("ready") ? errId("ready") : undefined}
        >
          {READY_OPTIONS.map((opt) => {
            const selected = data.ready === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  update("ready", opt.value);
                  markTouched("ready", opt.value);
                }}
                disabled={submitting}
                className={`rounded-lg border-2 px-3 py-3 text-sm font-bold transition ${
                  selected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : showErr("ready")
                    ? "border-red-500 text-[var(--color-text)] hover:border-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
                }`}
              >
                {opt.value === "yes" ? "Yes" : "No"}
                <span
                  className={`block text-[10px] font-medium mt-0.5 leading-tight ${
                    selected
                      ? "text-white/85"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {opt.value === "yes" ? "Ready to start" : "Just researching"}
                </span>
              </button>
            );
          })}
        </div>
        {showErr("ready") && (
          <p
            id={errId("ready")}
            role="alert"
            aria-live="polite"
            className="lp-field-error"
          >
            {errors.ready}
          </p>
        )}
      </div>

      {/* Q2 — How did you hear about us? (optional) */}
      <div className="mt-4">
        <label
          htmlFor={id("heardFrom")}
          className="block text-xs uppercase tracking-wider font-bold text-[var(--color-primary)] mb-1.5"
        >
          How did you hear about us?{" "}
          <span className="text-[var(--color-text-muted)] font-medium normal-case tracking-normal">
            (optional)
          </span>
        </label>
        <div className="relative">
          <select
            ref={(el) => {
              fieldRefs.current.heardFrom = el;
            }}
            id={id("heardFrom")}
            name="heardFrom"
            disabled={submitting}
            value={data.heardFrom}
            onChange={(e) =>
              update("heardFrom", e.target.value as HeardFromValue)
            }
            className={`lp-input appearance-none pr-10 ${
              !data.heardFrom ? "text-[#6b7280]" : ""
            }`}
          >
            {HEARD_FROM_OPTIONS.map((opt) => (
              <option
                key={opt.value || "blank"}
                value={opt.value}
                disabled={opt.value === ""}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="w-5 h-5 text-[#9ca3af]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {errorMessage && status === "error" && (
        <div
          id={errId("form")}
          role="alert"
          aria-live="assertive"
          className="mt-3 text-sm text-red-600"
        >
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={submitting || success}
        className="btn-primary w-full mt-5 text-base sm:text-lg py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending…" : "Request My Free In-Home Assessment"}
      </button>

      <p className="mt-3 text-[11px] sm:text-xs leading-relaxed text-[var(--color-text-muted)] text-center">
        Same-day or next-day assessments available. Your info stays private —
        we never share it.
      </p>
    </form>
  );
}
