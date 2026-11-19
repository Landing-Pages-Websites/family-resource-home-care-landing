import type { SubmittedFormData } from "@/lib/leadPayload";

export type SubmissionStatus = "submitting" | "success" | "error";

/** Called only after the form's validate-first gate passed; nothing here dispatches a native submit. */
export interface SubmissionSteps {
  /** Resolves with the accepted `form_data`; throws on any failure. */
  send: () => Promise<SubmittedFormData>;
  onAccepted: (sent: SubmittedFormData) => void;
  onStatus: (status: SubmissionStatus) => void;
}

/** One submission at a time: the lock is taken synchronously, kept after success, released on a failed send for a retry. */
export async function runSubmission(lock: { current: boolean }, steps: SubmissionSteps): Promise<void> {
  if (lock.current) return;
  lock.current = true;
  steps.onStatus("submitting");
  let sent: SubmittedFormData;
  try {
    sent = await steps.send();
  } catch {
    lock.current = false;
    steps.onStatus("error");
    return;
  }
  // Outside the try: the lead is saved, so nothing after this may release the lock for a duplicate retry.
  steps.onStatus("success");
  steps.onAccepted(sent);
}
