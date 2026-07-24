import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { GalleryView } from "@/components/views/GalleryView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const galleryImages = await prisma.galleryImage.findMany({
    where: { status: Status.PUBLISHED },
    orderBy: { order: "asc" },
  });

  return <GalleryView galleryImages={galleryImages} />;
}
