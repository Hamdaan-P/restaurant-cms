import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getContentType, type PrismaModelKey } from "@/lib/contentTypes";
import { FormMaker } from "@/components/FormMaker";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

const delegates = prisma as unknown as Record<
  PrismaModelKey,
  { findUnique: (args: { where: { id: string } }) => Promise<Row | null> }
>;

export default async function EditContentItemPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const contentType = getContentType(type);

  if (!contentType || contentType.kind !== "list") {
    notFound();
  }

  const delegate = delegates[contentType.prismaModel];
  const record = await delegate.findUnique({ where: { id } });

  if (!record) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href={`/admin/${type}`}
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← {contentType.label}
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-900">
        Edit {contentType.singularLabel}
      </h1>
      <FormMaker
        typeKey={type}
        fields={contentType.fields}
        recordId={id}
        initialValues={record}
      />
    </main>
  );
}
