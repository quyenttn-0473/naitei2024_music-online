import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1724605596468 implements MigrationInterface {
  name = 'NewMigration1724605596468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` ADD \`songId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` ADD UNIQUE INDEX \`IDX_4760a39490c064d566eb706131\` (\`songId\`)`
    );
    await queryRunner.query(
      `ALTER TABLE \`album\` DROP FOREIGN KEY \`FK_8260e1386a0fa66b057d520b97f\``
    );
    await queryRunner.query(
      `ALTER TABLE \`album\` CHANGE \`authorId\` \`authorId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_4215338f68b4313c6d796ce825c\``
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`songId\` \`songId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`userId\` \`userId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` DROP FOREIGN KEY \`FK_43dd9ca7183997ec0f9802e3050\``
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` CHANGE \`rejection_reason\` \`rejection_reason\` text NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` CHANGE \`userId\` \`userId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_c529927ae410af49faaf2e239a5\``
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_2347b7912d4e51efb37d74f52e3\``
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` CHANGE \`deleteReason\` \`deleteReason\` text NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` CHANGE \`albumId\` \`albumId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` CHANGE \`authorId\` \`authorId\` int NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_4760a39490c064d566eb706131\` ON \`suggested_song\` (\`songId\`)`
    );
    await queryRunner.query(
      `ALTER TABLE \`album\` ADD CONSTRAINT \`FK_8260e1386a0fa66b057d520b97f\` FOREIGN KEY (\`authorId\`) REFERENCES \`author\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_4215338f68b4313c6d796ce825c\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` ADD CONSTRAINT \`FK_43dd9ca7183997ec0f9802e3050\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` ADD CONSTRAINT \`FK_4760a39490c064d566eb7061314\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD CONSTRAINT \`FK_c529927ae410af49faaf2e239a5\` FOREIGN KEY (\`albumId\`) REFERENCES \`album\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD CONSTRAINT \`FK_2347b7912d4e51efb37d74f52e3\` FOREIGN KEY (\`authorId\`) REFERENCES \`author\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_2347b7912d4e51efb37d74f52e3\``
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_c529927ae410af49faaf2e239a5\``
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` DROP FOREIGN KEY \`FK_4760a39490c064d566eb7061314\``
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` DROP FOREIGN KEY \`FK_43dd9ca7183997ec0f9802e3050\``
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_4215338f68b4313c6d796ce825c\``
    );
    await queryRunner.query(
      `ALTER TABLE \`album\` DROP FOREIGN KEY \`FK_8260e1386a0fa66b057d520b97f\``
    );
    await queryRunner.query(
      `DROP INDEX \`REL_4760a39490c064d566eb706131\` ON \`suggested_song\``
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` CHANGE \`albumId\` \`albumId\` int NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` CHANGE \`deleteReason\` \`deleteReason\` text NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD CONSTRAINT \`FK_2347b7912d4e51efb37d74f52e3\` FOREIGN KEY (\`authorId\`) REFERENCES \`author\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD CONSTRAINT \`FK_c529927ae410af49faaf2e239a5\` FOREIGN KEY (\`albumId\`) REFERENCES \`album\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` CHANGE \`rejection_reason\` \`rejection_reason\` text NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` ADD CONSTRAINT \`FK_43dd9ca7183997ec0f9802e3050\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`songId\` \`songId\` int NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_4215338f68b4313c6d796ce825c\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`album\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`album\` ADD CONSTRAINT \`FK_8260e1386a0fa66b057d520b97f\` FOREIGN KEY (\`authorId\`) REFERENCES \`author\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` DROP INDEX \`IDX_4760a39490c064d566eb706131\``
    );
    await queryRunner.query(
      `ALTER TABLE \`suggested_song\` DROP COLUMN \`songId\``
    );
  }
}
