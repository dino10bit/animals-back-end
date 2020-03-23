import {MigrationInterface, QueryRunner} from "typeorm";

export class addAnimalsData1584891424645 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`INSERT INTO "public"."animal"("name","species","uri","userId")
          VALUES
          (E'Beary McBearFace',E'bear',E'https://placebear.com/600/300',1),
          (E'Chew Barka',E'dog',E'https://placedog.net/600/300',1),
          (E'Schrodinger',E'cat',E'https://placekitten.com/600/300',1),
          (E'Shreddy the Teddy',E'bear',E'https://placebear.com/600/340',1),
          (E'Prince of Barkness',E'dog',E'https://placedog.net/600/340',1),
          (E'Mr. Meowgi',E'cat',E'https://placekitten.com/600/340',1),
          (E'Beary Potter',E'bear',E'https://placebear.com/600/380',1),
          (E'Doc McDoggins',E'dog',E'https://placedog.net/600/380',1),
          (E'Luke Skywhisker',E'cat',E'https://placekitten.com/600/380',1);`);

      await queryRunner.query(`INSERT INTO "public"."species"("id","name")
          VALUES
          (1,E'dog'),
          (2,E'cat'),
          (3,E'bear');`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "animal" DROP CONSTRAINT "FK_305006f0101340847e1da2edb61"`);
        await queryRunner.query(`ALTER TABLE "species" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animal" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "animal" ADD CONSTRAINT "FK_ae1d917992dd0c9d9bbdad06c4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
