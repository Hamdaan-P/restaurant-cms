import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { MenuView } from "@/components/views/MenuView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

type PublishedMenuItem = {
  name: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
};

export default async function MenuPage() {
  const rows = await prisma.menuItem.findMany({
    where: { publishedData: { not: Prisma.DbNull } },
    orderBy: { order: "asc" },
  });

  const menuItems = rows.map((row) => ({
    id: row.id,
    ...(row.publishedData as PublishedMenuItem),
  }));

  return <MenuView menuItems={menuItems} />;
}
