import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HomeView } from "@/components/views/HomeView";
import { AboutView } from "@/components/views/AboutView";
import { GalleryView } from "@/components/views/GalleryView";
import { MenuView } from "@/components/views/MenuView";
import { ContactView } from "@/components/views/ContactView";

// Opt this page out of the full route cache so draft edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

const PREVIEW_PAGE_SLUGS = ["home", "about", "gallery", "menu", "contact"] as const;
type PreviewPageSlug = (typeof PREVIEW_PAGE_SLUGS)[number];

function isPreviewPageSlug(value: string): value is PreviewPageSlug {
  return (PREVIEW_PAGE_SLUGS as readonly string[]).includes(value);
}

export default async function AdminPreviewPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  if (!isPreviewPageSlug(page)) {
    notFound();
  }

  switch (page) {
    case "home": {
      const home = await prisma.home.findFirst();
      const featuredDishes = home
        ? await prisma.menuItem.findMany({
            where: { featured: true },
            orderBy: { order: "asc" },
          })
        : [];
      return <HomeView home={home} featuredDishes={featuredDishes} />;
    }
    case "about": {
      const about = await prisma.about.findFirst();
      const staffMembers = about
        ? await prisma.staffMember.findMany({ orderBy: { order: "asc" } })
        : [];
      return <AboutView about={about} staffMembers={staffMembers} />;
    }
    case "gallery": {
      const galleryImages = await prisma.galleryImage.findMany({
        orderBy: { order: "asc" },
      });
      return <GalleryView galleryImages={galleryImages} />;
    }
    case "menu": {
      const menuItems = await prisma.menuItem.findMany({
        orderBy: { order: "asc" },
      });
      return <MenuView menuItems={menuItems} />;
    }
    case "contact": {
      const contact = await prisma.contact.findFirst();
      return <ContactView contact={contact} />;
    }
    default:
      notFound();
  }
}
