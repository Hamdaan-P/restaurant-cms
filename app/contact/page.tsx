import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { ContactView } from "@/components/views/ContactView";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contact = await prisma.contact.findFirst({
    where: { status: Status.PUBLISHED },
  });

  return <ContactView contact={contact} />;
}
