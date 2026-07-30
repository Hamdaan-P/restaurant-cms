import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getContentType, type PrismaModelKey } from "@/lib/contentTypes";
import { FormMaker } from "@/components/FormMaker";
import { ListRowControls } from "@/components/ListRowControls";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

// Field names and the resulting arg shapes differ per model, so dynamic
// dispatch by registry key has to go through a loosely-typed delegate lookup.
const delegates = prisma as unknown as Record<
  PrismaModelKey,
  {
    findMany: (args?: unknown) => Promise<Row[]>;
    findUnique: (args: { where: { id: string } }) => Promise<Row | null>;
  }
>;

export default async function ContentTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const contentType = getContentType(type);

  if (!contentType) {
    notFound();
  }

  const delegate = delegates[contentType.prismaModel];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/admin"
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Dashboard
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-zinc-900">
          {contentType.label}
        </h1>
        {contentType.kind === "list" && (
          <Link
            href={`/admin/${type}/new`}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Add new
          </Link>
        )}
      </div>

      {contentType.kind === "list" ? (
        <ListView
          contentType={contentType}
          typeKey={type}
          rows={await delegate.findMany({ orderBy: { order: "asc" } })}
        />
      ) : (
        <SingleForm
          contentType={contentType}
          typeKey={type}
          record={await delegate.findUnique({ where: { id: "singleton" } })}
        />
      )}
    </main>
  );
}

function ListView({
  contentType,
  typeKey,
  rows,
}: {
  contentType: NonNullable<ReturnType<typeof getContentType>>;
  typeKey: string;
  rows: Row[];
}) {
  if (rows.length === 0) {
    return (
      <p className="mt-10 text-zinc-600">
        No {contentType.label.toLowerCase()} yet.
      </p>
    );
  }

  const displayLabel =
    contentType.fields.find((field) => field.name === contentType.listDisplayField)
      ?.label ?? contentType.listDisplayField;

  return (
    <table className="mt-10 w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-zinc-200 text-zinc-500">
          <th className="py-2 pr-4 font-medium">{displayLabel}</th>
          <th className="py-2 pr-4 font-medium">Status</th>
          <th className="py-2 pr-4 font-medium">Order</th>
          <th className="py-2 pl-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const itemLabel = String(row[contentType.listDisplayField] ?? "");
          return (
            <tr key={String(row.id)} className="border-b border-zinc-100">
              <td className="py-2 pr-4 text-zinc-900">
                <Link
                  href={`/admin/${typeKey}/${row.id}`}
                  className="hover:underline"
                >
                  {itemLabel}
                </Link>
              </td>
              <td className="py-2 pr-4 text-zinc-600">{String(row.status)}</td>
              <td className="py-2 pr-4 text-zinc-600">{String(row.order)}</td>
              <td className="py-2 pl-4">
                <ListRowControls
                  typeKey={typeKey}
                  recordId={String(row.id)}
                  itemLabel={itemLabel}
                  isFirst={index === 0}
                  isLast={index === rows.length - 1}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SingleForm({
  contentType,
  typeKey,
  record,
}: {
  contentType: NonNullable<ReturnType<typeof getContentType>>;
  typeKey: string;
  record: Row | null;
}) {
  return (
    <FormMaker
      typeKey={typeKey}
      fields={contentType.fields}
      recordId={record ? String(record.id) : undefined}
      initialValues={record ?? undefined}
    />
  );
}
