import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1702312774769 implements MigrationInterface {
  name = 'Migrations1702312774769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_type_enum" AS ENUM('CREDIT', 'DEBIT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "type" "public"."transactions_type_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "bank_account_id" integer, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bank_account_type_enum" AS ENUM('Saving Account', 'Bank Account')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bank_account" ("id" SERIAL NOT NULL, "account_number" character varying NOT NULL, "agency_number" character varying NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', "type" "public"."bank_account_type_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_f3ddf928fd6935ebc819ba11f7c" UNIQUE ("account_number"), CONSTRAINT "PK_f3246deb6b79123482c6adb9745" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_7acbae8c628ce8a11e882cac50f" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD CONSTRAINT "FK_c8d57e8df596573a617476fdff2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP CONSTRAINT "FK_c8d57e8df596573a617476fdff2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_7acbae8c628ce8a11e882cac50f"`,
    );
    await queryRunner.query(`DROP TABLE "bank_account"`);
    await queryRunner.query(`DROP TYPE "public"."bank_account_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
  }
}
