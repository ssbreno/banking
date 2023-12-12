import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1702331579590 implements MigrationInterface {
  name = 'Migrations1702331579590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP COLUMN "is_active"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "description"`,
    );
  }
}
