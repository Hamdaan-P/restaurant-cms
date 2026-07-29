import { prisma } from "@/lib/prisma";
import { Prisma, Status } from "@prisma/client";
import { AboutView } from "@/components/views/AboutView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const aboutRow = await prisma.about.findFirst({
    where: { publishedData: { not: Prisma.DbNull } },
  });
  const about = aboutRow?.publishedData as
    | { story: string; photo: string }
    | null
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
