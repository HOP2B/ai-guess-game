-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteThemeId" INTEGER,
ADD COLUMN     "winRate" DOUBLE PRECISION DEFAULT 0;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteThemeId_fkey" FOREIGN KEY ("favoriteThemeId") REFERENCES "Theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
