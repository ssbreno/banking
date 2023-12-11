import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1702327182931 implements MigrationInterface {
  name = 'Migrations1702327182931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updated_a" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_7acbae8c628ce8a11e882cac50f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9"`,
    );
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "bank_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "bank_account_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP CONSTRAINT "FK_c8d57e8df596573a617476fdff2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP CONSTRAINT "PK_f3246deb6b79123482c6adb9745"`,
    );
    await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD CONSTRAINT "PK_f3246deb6b79123482c6adb9745" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "bank_account" ADD "user_id" uuid`);
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
    await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "bank_account" ADD "user_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP CONSTRAINT "PK_f3246deb6b79123482c6adb9745"`,
    );
    await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD CONSTRAINT "PK_f3246deb6b79123482c6adb9745" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD CONSTRAINT "FK_c8d57e8df596573a617476fdff2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "bank_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "bank_account_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9"`,
    );
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_7acbae8c628ce8a11e882cac50f" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_a"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
