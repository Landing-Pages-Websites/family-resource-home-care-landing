/** Same id scheme as lp-starter fieldProps.ts, so ids stay unique across the two placements. */
export function fieldInputId(formId: string, name: string): string {
  return `${formId}-${name}`;
}

export function fieldErrorId(inputId: string): string {
  return `${inputId}-error`;
}
