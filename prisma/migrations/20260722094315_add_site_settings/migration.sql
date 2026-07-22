-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLISHED',

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
