-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "posisi" VARCHAR(100) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "count_siang" INTEGER,
    "count_sarapan" INTEGER,
    "exp" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "makanan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "order" VARCHAR(100) NOT NULL,
    "price" INTEGER NOT NULL,
    "pay" INTEGER NOT NULL,
    "payback" INTEGER NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "makanan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "makanan" ADD CONSTRAINT "makanan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
