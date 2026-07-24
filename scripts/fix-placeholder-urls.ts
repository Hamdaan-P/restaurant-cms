// Standalone, non-destructive script to fix placehold.co image URLs that
// return SVG (which next/image rejects) by inserting ".png" before the
// query string. Safe to run more than once: URLs that already contain
// ".png", or that aren't hosted on placehold.co, are left untouched.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

function toPngUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.hostname !== "placehold.co") return null;
  if (url.pathname.includes(".png")) return null;

  url.pathname = `${url.pathname}.png`;
  return url.toString();
}

async function fixMenuItems(): Promise<number> {
  const rows = await prisma.menuItem.findMany();
  let changed = 0;
  for (const row of rows) {
    const next = toPngUrl(row.image);
    if (!next) continue;
    await prisma.menuItem.update({ where: { id: row.id }, data: { image: next } });
    changed++;
  }
  return changed;
}

async function fixGalleryImages(): Promise<number> {
  const rows = await prisma.galleryImage.findMany();
  let changed = 0;
  for (const row of rows) {
    const next = toPngUrl(row.image);
    if (!next) continue;
    await prisma.galleryImage.update({ where: { id: row.id }, data: { image: next } });
    changed++;
  }
  return changed;
}

async function fixStaffMembers(): Promise<number> {
  const rows = await prisma.staffMember.findMany();
  let changed = 0;
  for (const row of rows) {
    const next = toPngUrl(row.photo);
    if (!next) continue;
    await prisma.staffMember.update({ where: { id: row.id }, data: { photo: next } });
    changed++;
  }
  return changed;
}

async function fixAbout(): Promise<number> {
  const rows = await prisma.about.findMany();
  let changed = 0;
  for (const row of rows) {
    const next = toPngUrl(row.photo);
    if (!next) continue;
    await prisma.about.update({ where: { id: row.id }, data: { photo: next } });
    changed++;
  }
  return changed;
}

async function main() {
  console.log(`MenuItem: ${await fixMenuItems()} row(s) updated`);
  console.log(`GalleryImage: ${await fixGalleryImages()} row(s) updated`);
  console.log(`StaffMember: ${await fixStaffMembers()} row(s) updated`);
  console.log(`About: ${await fixAbout()} row(s) updated`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
