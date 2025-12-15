/*
  Warnings:

  - You are about to drop the column `characterId` on the `Game` table. All the data in the column will be lost.
  - Added the required column `themeId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `themeId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_characterId_fkey";

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "themeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "characterId",
ADD COLUMN     "themeId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameCharacter" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,
    "guessed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GameCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForbiddenWord" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "ForbiddenWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GameCharacter_gameId_characterId_key" ON "GameCharacter"("gameId", "characterId");

-- CreateIndex
CREATE UNIQUE INDEX "ForbiddenWord_word_characterId_key" ON "ForbiddenWord"("word", "characterId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCharacter" ADD CONSTRAINT "GameCharacter_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCharacter" ADD CONSTRAINT "GameCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForbiddenWord" ADD CONSTRAINT "ForbiddenWord_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
