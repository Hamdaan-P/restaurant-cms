import Image from "next/image";
import type { MenuItem } from "@prisma/client";

export function MenuView({
  menuItems,
}: {
  menuItems: Pick<MenuItem, "id" | "name" | "description" | "price" | "image">[];
}) {
  if (menuItems.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-lg text-zinc-600">
          No dishes have been published yet.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-3xl font-semibold text-zinc-900">Menu</h1>
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg border border-zinc-200"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-medium text-zinc-900">
                  {item.name}
                </h2>
                <span className="whitespace-nowrap text-lg font-medium text-zinc-900">
                  ₹{item.price}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
