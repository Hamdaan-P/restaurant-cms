import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { MenuView } from "@/components/views/MenuView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const menuItems = await prisma.menuItem.findMany({
    where: { status: Status.PUBLISHED },
    orderBy: { order: "asc" },
  });

  return <MenuView menuItems={menuItems} />;
}
