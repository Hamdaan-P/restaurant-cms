import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ContactView } from "@/components/views/ContactView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contactRow = await prisma.contact.findFirst({
    where: { publishedData: { not: Prisma.DbNull } },
  });
  const contact = contactRow?.publishedData as
    | { address: string; phone: string; email: string; hours: string }
    | null
    | undefined;

  return <ContactView contact={contact ?? null} />;
}
