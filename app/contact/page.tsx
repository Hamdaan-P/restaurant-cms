import { prisma } from "@/lib/prisma";
import { ContactView } from "@/components/views/ContactView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contactRow = await prisma.contact.findUnique({ where: { id: "singleton" } });
  const contact = (contactRow?.publishedData ?? undefined) as
    | { address: string; phone: string; email: string; hours: string }
    | undefined;

  return <ContactView contact={contact ?? null} />;
}
