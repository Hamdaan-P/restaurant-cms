import Image from "next/image";
import type { GalleryImage } from "@prisma/client";

export function GalleryView({
  galleryImages,
}: {
  galleryImages: Pick<GalleryImage, "id" | "image" | "caption">[];
}) {
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
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.caption}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-zinc-600">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
