import Link from "next/link";
import { contentTypes } from "@/lib/contentTypes";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-zinc-900">Dashboard</h1>
      <p className="mt-2 text-zinc-600">
        Choose a content type to view its entries.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {contentTypes.map((contentType) => (
          <Link
            key={contentType.key}
            href={`/admin/${contentType.key}`}
            className="rounded-lg border border-zinc-200 px-5 py-4 hover:border-zinc-400"
          >
            <h2 className="font-medium text-zinc-900">{contentType.label}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {contentType.kind === "list" ? "List" : "Single record"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
