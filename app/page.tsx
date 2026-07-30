import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { HomeView } from "@/components/views/HomeView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function Home() {
  const homeRow = await prisma.home.findUnique({ where: { id: "singleton" } });
  const home = (homeRow?.publishedData ?? undefined) as
    | { headline: string; subtext: string; buttonText: string }
    | undefined;

  // Relational read: featured dishes are pulled live rather than from a snapshot.
  const featuredDishes = home
    ? await prisma.menuItem.findMany({
        where: { status: Status.PUBLISHED, featured: true },
        orderBy: { order: "asc" },
      })
    : [];

  return <HomeView home={home ?? null} featuredDishes={featuredDishes} />;
}
