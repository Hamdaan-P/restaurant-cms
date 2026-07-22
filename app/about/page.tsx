import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

// Opt this page out of the full route cache so DB edits appear on refresh instead of a stale prerendered page.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await prisma.about.findFirst({
    where: { status: Status.PUBLISHED },
  });

  if (!about) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-lg text-zinc-600">
          Our story has not been published yet.
        </p>
      </main>
    );
  }

  const staffMembers = await prisma.staffMember.findMany({
    where: { status: Status.PUBLISHED },
    orderBy: { order: "asc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-3xl font-semibold text-zinc-900">About</h1>
      <div className="mt-10 overflow-hidden rounded-lg border border-zinc-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={about.photo}
          alt="About us"
          className="h-64 w-full object-cover"
        />
        <div className="p-6">
          <p className="text-lg text-zinc-900">{about.story}</p>
        </div>
      </div>

      {staffMembers.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-zinc-900">Our Team</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {staffMembers.map((member) => (
              <div
                key={member.id}
                className="overflow-hidden rounded-lg border border-zinc-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-zinc-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {member.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
