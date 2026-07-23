"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function PublicNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="border-b border-zinc-200">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-6 py-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
