-- Backfill: point existing singleton rows at the fixed id before/independent
-- of the default change below (defaults only affect future inserts).
UPDATE "Home"         SET id = 'singleton' WHERE id <> 'singleton';
UPDATE "About"        SET id = 'singleton' WHERE id <> 'singleton';
UPDATE "Contact"      SET id = 'singleton' WHERE id <> 'singleton';
UPDATE "SiteSettings" SET id = 'singleton' WHERE id <> 'singleton';

-- AlterTable
ALTER TABLE "About" ALTER COLUMN "id" SET DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "id" SET DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "Home" ALTER COLUMN "id" SET DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "SiteSettings" ALTER COLUMN "id" SET DEFAULT 'singleton';
