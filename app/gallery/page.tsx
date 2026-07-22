import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const galleryImages = await prisma.galleryImage.findMany({
    where: { status: Status.PUBLISHED },
    orderBy: { order: "asc" },
  });

  if (galleryImages.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-lg text-zinc-600">
          No photos have been published yet.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-3xl font-semibold text-zinc-900">Gallery</h1>
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg border border-zinc-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.caption}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-zinc-600">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
