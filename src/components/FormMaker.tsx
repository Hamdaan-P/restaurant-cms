"use client";

import { useActionState } from "react";
import type { ContentField } from "@/lib/contentTypes";
import { saveContentItem, type ActionState } from "../../app/admin/actions";
import { ImageUploader } from "./ImageUploader";

const initialState: ActionState = { errors: {} };

const inputClasses =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none";

export function FormMaker({
  typeKey,
  fields,
  recordId,
  initialValues,
}: {
  typeKey: string;
  fields: ContentField[];
  recordId?: string;
  initialValues?: Record<string, unknown>;
}) {
  const saveWithContext = saveContentItem.bind(
    null,
    typeKey,
    recordId ?? null
  );
  const [state, formAction, pending] = useActionState(
    saveWithContext,
    initialState
  );

  return (
    <form action={formAction} className="mt-10 space-y-6">
      {state.formError && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.formError}
        </p>
      )}

      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          defaultValue={initialValues?.[field.name]}
          error={state.errors[field.name]}
        />
      ))}

      <div className="flex items-center gap-x-3 pt-4">
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          Publish
        </button>
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={pending}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Save as draft
        </button>
      </div>
    </form>
  );
}

function FieldInput({
  field,
  defaultValue,
  error,
}: {
  field: ContentField;
  defaultValue: unknown;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-zinc-900"
      >
        {field.label}
      </label>
      {field.helpText && (
        <p className="mt-1 text-sm text-zinc-500">{field.helpText}</p>
      )}
      <div className="mt-2">{renderInput(field, defaultValue)}</div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function renderInput(field: ContentField, defaultValue: unknown) {
  switch (field.input) {
    case "textarea":
      return (
        <textarea
          id={field.name}
          name={field.name}
          rows={4}
          defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
          className={inputClasses}
        />
      );
    case "number":
      return (
        <input
          id={field.name}
          name={field.name}
          type="number"
          defaultValue={
            typeof defaultValue === "number" || typeof defaultValue === "string"
              ? defaultValue
              : ""
          }
          className={inputClasses}
        />
      );
    case "boolean":
      return (
        <input
          id={field.name}
          name={field.name}
          type="checkbox"
          defaultChecked={Boolean(defaultValue)}
          className="h-4 w-4 rounded border-zinc-300"
        />
      );
    case "image":
      return (
        <ImageUploader
          name={field.name}
          label={field.label}
          value={typeof defaultValue === "string" ? defaultValue : ""}
        />
      );
    case "text":
    default:
      return (
        <input
          id={field.name}
          name={field.name}
          type="text"
          defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
          className={inputClasses}
        />
      );
  }
}
