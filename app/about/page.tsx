import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { AboutView } from "@/components/views/AboutView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const aboutRow = await prisma.about.findUnique({ where: { id: "singleton" } });
  const about = (aboutRow?.publishedData ?? undefined) as
    | { story: string; photo: string }
    | undefined;

  // Relational read: staff list is pulled live rather than from a snapshot.
  const staffMembers = about
    ? await prisma.staffMember.findMany({
        where: { status: Status.PUBLISHED },
        orderBy: { order: "asc" },
      })
    : [];

  return <AboutView about={about ?? null} staffMembers={staffMembers} />;
}
