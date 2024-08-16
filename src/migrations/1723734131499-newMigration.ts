import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1723734131499 implements MigrationInterface {
  name = 'NewMigration1723734131499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`imageUrl\``);
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD \`imageUrl\` varchar(6000) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`url\``);
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD \`url\` varchar(6000) NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`url\``);
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD \`url\` varchar(255) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`imageUrl\``);
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD \`imageUrl\` varchar(255) NOT NULL`
    );
  }
}
