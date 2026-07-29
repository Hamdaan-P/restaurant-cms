-- AlterTable
ALTER TABLE "About" ADD COLUMN     "publishedData" JSONB;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "publishedData" JSONB;

-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "publishedData" JSONB;

-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "publishedData" JSONB;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "publishedData" JSONB;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "publishedData" JSONB;

-- AlterTable
ALTER TABLE "StaffMember" ADD COLUMN     "publishedData" JSONB;

-- Backfill: give every already-published row a publishedData snapshot of its
-- registry fields (src/lib/contentTypes.ts) so live content doesn't vanish
-- once the public pages start reading from publishedData instead of the
-- working fields.
UPDATE "MenuItem"
SET "publishedData" = jsonb_build_object(
  'name', "name",
  'description', "description",
  'price', "price",
  'image', "image",
  'featured', "featured"
)
WHERE "status" = 'PUBLISHED';

UPDATE "GalleryImage"
SET "publishedData" = jsonb_build_object(
  'image', "image",
  'caption', "caption"
)
WHERE "status" = 'PUBLISHED';

UPDATE "StaffMember"
SET "publishedData" = jsonb_build_object(
  'name', "name",
  'designation', "designation",
  'photo', "photo"
)
WHERE "status" = 'PUBLISHED';

UPDATE "Home"
SET "publishedData" = jsonb_build_object(
  'headline', "headline",
  'subtext', "subtext",
  'buttonText', "buttonText"
)
WHERE "status" = 'PUBLISHED';

UPDATE "About"
SET "publishedData" = jsonb_build_object(
  'story', "story",
  'photo', "photo"
)
WHERE "status" = 'PUBLISHED';

UPDATE "Contact"
SET "publishedData" = jsonb_build_object(
  'address', "address",
  'phone', "phone",
  'email', "email",
  'hours', "hours"
)
WHERE "status" = 'PUBLISHED';

UPDATE "SiteSettings"
SET "publishedData" = jsonb_build_object(
  'restaurantName', "restaurantName",
  'tagline', "tagline"
)
WHERE "status" = 'PUBLISHED';
