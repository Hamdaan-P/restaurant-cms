import Link from "next/link";
import { auth, signOut } from "../../auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, siteSettings] = await Promise.all([
    auth(),
    prisma.siteSettings.findFirst(),
  ]);

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-x-6 px-6 py-4">
          <span className="text-sm font-semibold text-zinc-900">
            {siteSettings?.restaurantName ?? "Admin"}
          </span>
          <div className="flex items-center gap-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              View public site
            </Link>
            {session && (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button
                  type="submit"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
