-- AlterTable
ALTER TABLE "User" ADD COLUMN     "json_settings" JSONB;

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "main_font" TEXT NOT NULL,
    "font_size" TEXT NOT NULL,
    "created_ad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ay" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentToUser_AB_unique" ON "_DocumentToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentToUser_B_index" ON "_DocumentToUser"("B");

-- AddForeignKey
ALTER TABLE "_DocumentToUser" ADD CONSTRAINT "_DocumentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToUser" ADD CONSTRAINT "_DocumentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
