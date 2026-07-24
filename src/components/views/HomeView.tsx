import Image from "next/image";
import type { Home, MenuItem } from "@prisma/client";

export function HomeView({
  home,
  featuredDishes,
}: {
  home: Home | null;
  featuredDishes: MenuItem[];
}) {
  if (!home) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-lg text-zinc-600">
          Home page content has not been published yet.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-zinc-900">
          {home.headline}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
          {home.subtext}
        </p>
        <button className="mt-8 rounded-full bg-zinc-900 px-6 py-3 text-base font-medium text-white">
          {home.buttonText}
        </button>
      </div>

      {featuredDishes.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Featured Dishes
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDishes.map((item) => (
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
                    <h3 className="text-lg font-medium text-zinc-900">
                      {item.name}
                    </h3>
                    <span className="whitespace-nowrap text-lg font-medium text-zinc-900">
                      ₹{item.price}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">
                    {item.description}
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
