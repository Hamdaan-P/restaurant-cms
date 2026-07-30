import type { ContentField } from "@/lib/contentTypes";

export function coerceField(
  field: ContentField,
  formData: FormData
): { value?: unknown; error?: string } {
  if (field.input === "boolean") {
    return { value: formData.get(field.name) === "on" };
  }

  const raw = formData.get(field.name);
  const value = typeof raw === "string" ? raw.trim() : "";

  if (field.required && value === "") {
    return { error: field.requiredMessage };
  }

  if (field.input === "number") {
    if (value === "") {
      return { value: null };
    }
    const invalidMessage = field.invalidMessage ?? field.requiredMessage;
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      return { error: invalidMessage };
    }
    if (field.min !== undefined && parsed < field.min) {
      return { error: invalidMessage };
    }
    if (field.max !== undefined && parsed > field.max) {
      return { error: invalidMessage };
    }
    return { value: parsed };
  }

  return { value };
}
