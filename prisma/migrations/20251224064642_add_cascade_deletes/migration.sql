-- DropForeignKey
ALTER TABLE "ForbiddenWord" DROP CONSTRAINT "ForbiddenWord_characterId_fkey";

-- DropForeignKey
ALTER TABLE "GameCharacter" DROP CONSTRAINT "GameCharacter_characterId_fkey";

-- AddForeignKey
ALTER TABLE "GameCharacter" ADD CONSTRAINT "GameCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForbiddenWord" ADD CONSTRAINT "ForbiddenWord_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
