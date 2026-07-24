import Link from "next/link";

const PREVIEW_PAGES = [
  { slug: "home", label: "Home" },
  { slug: "about", label: "About" },
  { slug: "gallery", label: "Gallery" },
  { slug: "menu", label: "Menu" },
  { slug: "contact", label: "Contact" },
] as const;

export default function PreviewIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-zinc-900">Preview</h1>
      <p className="mt-2 text-zinc-600">
        Choose a page to preview, including drafts that haven&apos;t been
        published yet.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PREVIEW_PAGES.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/preview/${page.slug}`}
            className="rounded-lg border border-zinc-200 px-5 py-4 hover:border-zinc-400"
          >
            <h2 className="font-medium text-zinc-900">{page.label}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
