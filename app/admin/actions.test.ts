import { test, expect, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { saveContentItem } from "./actions";

// The action gates on an authenticated session and calls Next.js request-scoped
// APIs (redirect/revalidatePath) that only work inside a real request. Those are
// stubbed here; the database writes below hit the real configured DATABASE_URL.
vi.mock("../../auth", () => ({
  auth: vi.fn(async () => ({ user: { id: "test-admin" } })),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

function contactFormData(fields: {
  address: string;
  phone: string;
  email: string;
  hours: string;
  intent: "publish" | "draft";
}) {
  const formData = new FormData();
  formData.set("address", fields.address);
  formData.set("phone", fields.phone);
  formData.set("email", fields.email);
  formData.set("hours", fields.hours);
  formData.set("intent", fields.intent);
  return formData;
}

test("publish/draft snapshot behaviour for Contact (single-kind)", async () => {
  const v1 = {
    address: "42 Curry Lane",
    phone: "111-111",
    email: "v1@example.com",
    hours: "9am-5pm",
  };
  const v2 = {
    address: "99 Spice Ave",
    phone: "222-222",
    email: "v2@example.com",
    hours: "10am-6pm",
  };

  const record = await prisma.contact.create({
    data: { ...v1, status: "DRAFT" },
  });

  try {
    // 1. Publish v1 -> publishedData is set to a snapshot of the registry fields.
    await saveContentItem(
      "contact",
      record.id,
      { errors: {} },
      contactFormData({ ...v1, intent: "publish" })
    );
    const afterPublish = await prisma.contact.findUniqueOrThrow({
      where: { id: record.id },
    });
    expect(afterPublish.publishedData).not.toBeNull();
    expect(afterPublish.publishedData).toEqual(v1);

    // 2. Edit working fields and save as draft -> publishedData is untouched.
    await saveContentItem(
      "contact",
      record.id,
      { errors: {} },
      contactFormData({ ...v2, intent: "draft" })
    );
    const afterDraft = await prisma.contact.findUniqueOrThrow({
      where: { id: record.id },
    });
    expect(afterDraft.publishedData).toEqual(v1);

    // 3. Publish again -> publishedData now reflects the new values.
    await saveContentItem(
      "contact",
      record.id,
      { errors: {} },
      contactFormData({ ...v2, intent: "publish" })
    );
    const afterRepublish = await prisma.contact.findUniqueOrThrow({
      where: { id: record.id },
    });
    expect(afterRepublish.publishedData).toEqual(v2);
  } finally {
    await prisma.contact.delete({ where: { id: record.id } });
  }
});
