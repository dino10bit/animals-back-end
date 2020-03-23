import { MigrationInterface, QueryRunner } from 'typeorm'

export class animal1564785645730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE SEQUENCE animal_id_seq START WITH 1 INCREMENT BY 1`)

    await queryRunner.query(
      `CREATE TABLE "animal" (
      "id" smallint NOT NULL DEFAULT nextval('animal_id_seq'),
      "name" character varying NOT NULL,
      "species" character varying NOT NULL,
      "uri" character varying NOT NULL,
      "userId" integer,
      CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER SEQUENCE animal_id_seq OWNED BY "animal".id`)

    await queryRunner.query(
      `ALTER TABLE "animal" ADD CONSTRAINT "FK_ae1d917992dd0c9d9bbdad06c4a"
      FOREIGN KEY ("userId")
      REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "animal" DROP CONSTRAINT "FK_ae1d917992dd0c9d9bbdad06c4a"`)
    await queryRunner.query(`DROP TABLE "animal"`)
  }
}
