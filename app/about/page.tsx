import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { AboutView } from "@/components/views/AboutView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await prisma.about.findFirst({
    where: { status: Status.PUBLISHED },
  });

  const staffMembers = about
    ? await prisma.staffMember.findMany({
        where: { status: Status.PUBLISHED },
        orderBy: { order: "asc" },
      })
    : [];

  return <AboutView about={about} staffMembers={staffMembers} />;
}
