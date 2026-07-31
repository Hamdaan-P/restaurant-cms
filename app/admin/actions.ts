"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { getContentType, type PrismaModelKey } from "@/lib/contentTypes";
import { coerceField } from "@/lib/coerceField";

export type ActionState = {
  errors: Record<string, string>;
  formError?: string;
};

type Row = Record<string, unknown>;

type Delegate = {
  create: (args: { data: Record<string, unknown> }) => Promise<Row>;
  update: (args: {
    where: { id: string };
    data: Record<string, unknown>;
  }) => Promise<Row>;
  delete: (args: { where: { id: string } }) => Promise<Row>;
  findUnique: (args: { where: { id: string } }) => Promise<Row | null>;
  findMany: (args?: {
    orderBy?: { order: "asc" | "desc" };
  }) => Promise<Row[]>;
  aggregate: (args: {
    _max: { order: true };
  }) => Promise<{ _max: { order: number | null } }>;
};

function getDelegate(
  client: typeof prisma | Prisma.TransactionClient,
  modelKey: PrismaModelKey
): Delegate {
  return (client as unknown as Record<PrismaModelKey, Delegate>)[modelKey];
}

const delegates = prisma as unknown as Record<PrismaModelKey, Delegate>;

export async function saveContentItem(
  typeKey: string,
  recordId: string | null,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const contentType = getContentType(typeKey);
  if (!contentType) {
    return { errors: {}, formError: "Unknown content type." };
  }

  const session = await auth();
  if (!session) {
    return { errors: {}, formError: "You must be signed in to do that." };
  }

  const errors: Record<string, string> = {};
  const data: Record<string, unknown> = {};

  for (const field of contentType.fields) {
    const result = coerceField(field, formData);
    if (result.error) {
      errors[field.name] = result.error;
    } else {
      data[field.name] = result.value;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const isPublish = formData.get("intent") === "publish";
  data.status = isPublish ? "PUBLISHED" : "DRAFT";

  if (isPublish) {
    const snapshot: Record<string, unknown> = {};
    for (const field of contentType.fields) {
      snapshot[field.name] = data[field.name];
    }
    data.publishedData = snapshot;
  }

  const delegate = delegates[contentType.prismaModel];

  try {
    if (recordId) {
      await delegate.update({ where: { id: recordId }, data });
    } else {
      if (contentType.hasOrder) {
        const aggregate = await delegate.aggregate({ _max: { order: true } });
        data.order = (aggregate._max.order ?? 0) + 1;
      }
      await delegate.create({ data });
    }
  } catch {
    return {
      errors: {},
      formError: "Something went wrong saving this. Please try again.",
    };
  }

  revalidatePath(`/admin/${typeKey}`);
  revalidatePath("/", "layout");

  redirect(`/admin/${typeKey}`);
}

export async function deleteContentItem(
  typeKey: string,
  recordId: string
): Promise<void> {
  const contentType = getContentType(typeKey);
  if (!contentType || contentType.kind !== "list") {
    throw new Error("This content type does not support deletion.");
  }

  const session = await auth();
  if (!session) {
    throw new Error("You must be signed in to do that.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const delegate = getDelegate(tx, contentType.prismaModel);

      const existing = await delegate.findUnique({ where: { id: recordId } });
      if (!existing) {
        throw new Error("Item not found.");
      }

      await delegate.delete({ where: { id: recordId } });

      const remaining = await delegate.findMany({ orderBy: { order: "asc" } });
      for (const [index, row] of remaining.entries()) {
        if (row.order !== index) {
          await delegate.update({ where: { id: String(row.id) }, data: { order: index } });
        }
      }
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Item not found.") {
      throw err;
    }
    throw new Error("Something went wrong deleting this. Please try again.");
  }

  revalidatePath(`/admin/${typeKey}`);
  revalidatePath("/", "layout");
}

export async function signUpload() {
  const session = await auth();
  if (!session) {
    throw new Error("You must be signed in to do that.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "restaurant-cms";
  const allowed_formats = "jpg,png,webp";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, allowed_formats },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
    allowed_formats,
  };
}

export async function moveContentItem(
  typeKey: string,
  recordId: string,
  direction: "up" | "down"
): Promise<void> {
  const contentType = getContentType(typeKey);
  if (!contentType || contentType.kind !== "list") {
    throw new Error("This content type does not support reordering.");
  }

  const session = await auth();
  if (!session) {
    throw new Error("You must be signed in to do that.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const delegate = getDelegate(tx, contentType.prismaModel);
      const rows = await delegate.findMany({ orderBy: { order: "asc" } });
      const index = rows.findIndex((row) => String(row.id) === recordId);
      if (index === -1) {
        throw new Error("Item not found.");
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= rows.length) {
        return;
      }

      const current = rows[index];
      const target = rows[targetIndex];

      await delegate.update({
        where: { id: String(current.id) },
        data: { order: target.order },
      });
      await delegate.update({
        where: { id: String(target.id) },
        data: { order: current.order },
      });
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Item not found.") {
      throw err;
    }
    throw new Error("Something went wrong reordering this. Please try again.");
  }

  revalidatePath(`/admin/${typeKey}`);
  revalidatePath("/", "layout");
}
