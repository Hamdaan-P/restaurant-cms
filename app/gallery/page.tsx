import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { GalleryView } from "@/components/views/GalleryView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

type PublishedGalleryImage = {
  image: string;
  caption: string;
};

export default async function GalleryPage() {
  const rows = await prisma.galleryImage.findMany({
    where: { publishedData: { not: Prisma.DbNull } },
    orderBy: { order: "asc" },
  });

  const galleryImages = rows.map((row) => ({
    id: row.id,
    ...(row.publishedData as PublishedGalleryImage),
  }));

  return <GalleryView galleryImages={galleryImages} />;
}
