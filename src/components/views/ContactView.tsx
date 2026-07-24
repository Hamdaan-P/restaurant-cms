import type { Contact } from "@prisma/client";

export function ContactView({ contact }: { contact: Contact | null }) {
  if (!contact) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-lg text-zinc-600">
          Contact details have not been published yet.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-3xl font-semibold text-zinc-900">Contact</h1>
      <dl className="mt-10 space-y-8">
        <div>
          <dt className="text-sm font-medium text-zinc-500">Address</dt>
          <dd className="mt-1 text-lg text-zinc-900">{contact.address}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500">Phone</dt>
          <dd className="mt-1 text-lg text-zinc-900">{contact.phone}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500">Email</dt>
          <dd className="mt-1 text-lg text-zinc-900">{contact.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500">Hours</dt>
          <dd className="mt-1 text-lg text-zinc-900">{contact.hours}</dd>
        </div>
      </dl>
    </main>
  );
}
