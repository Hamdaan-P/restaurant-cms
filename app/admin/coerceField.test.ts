import { test, expect } from "vitest";
import { getContentType, type ContentField } from "@/lib/contentTypes";
import { coerceField } from "@/lib/coerceField";

const priceField = getContentType("menu-items")!.fields.find(
  (field) => field.name === "price"
)!;

function priceFormData(value: string) {
  const formData = new FormData();
  formData.set("price", value);
  return formData;
}

test("coerceField: empty price returns the requiredMessage", () => {
  expect(coerceField(priceField, priceFormData(""))).toEqual({
    error: priceField.requiredMessage,
  });
});

test("coerceField: non-numeric price returns the invalidMessage, not requiredMessage", () => {
  expect(coerceField(priceField, priceFormData("abc"))).toEqual({
    error: priceField.invalidMessage,
  });
});

test("coerceField: negative price returns the invalidMessage (below min)", () => {
  expect(coerceField(priceField, priceFormData("-5"))).toEqual({
    error: priceField.invalidMessage,
  });
});

test("coerceField: 1e999 (Infinity) returns the invalidMessage", () => {
  expect(coerceField(priceField, priceFormData("1e999"))).toEqual({
    error: priceField.invalidMessage,
  });
});

test("coerceField: zero price is valid (boundary)", () => {
  expect(coerceField(priceField, priceFormData("0"))).toEqual({ value: 0 });
});

test("coerceField: in-range price passes through parsed", () => {
  expect(coerceField(priceField, priceFormData("450"))).toEqual({ value: 450 });
});

// No `max` here on purpose: the price field's max: 100000 would independently
// reject Infinity via the max check, masking a removed isFinite guard. This
// field isolates that guard so a regression here can only be caught by it.
const noMaxField: ContentField = {
  name: "quantity",
  label: "Quantity",
  input: "number",
  required: true,
  requiredMessage: "Please enter a quantity.",
  min: 0,
  invalidMessage: "Please enter a valid quantity.",
};

test("coerceField: Infinity is rejected even with no max defined (isolates the isFinite guard)", () => {
  const formData = new FormData();
  formData.set("quantity", "1e999");
  expect(coerceField(noMaxField, formData)).toEqual({
    error: noMaxField.invalidMessage,
  });
});
