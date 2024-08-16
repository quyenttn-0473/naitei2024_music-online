import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1723742001343 implements MigrationInterface {
  name = 'NewMigration1723742001343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`song_genres_genre\` DROP FOREIGN KEY \`FK_01b24c0f3bc40b1246f1d853f82\``
    );
    await queryRunner.query(
      `ALTER TABLE \`song_genres_genre\` DROP FOREIGN KEY \`FK_ef75919535dd2416feab8a270f5\``
    );
    await queryRunner.query(
      `ALTER TABLE \`playlist_songs_song\` DROP FOREIGN KEY \`FK_3e66846398a681262e56574fc9f\``
    );
    await queryRunner.query(
      `ALTER TABLE \`playlist_songs_song\` DROP FOREIGN KEY \`FK_efc8204ff6cdd9f17e83f8d001b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`user_playlists_playlist\` DROP FOREIGN KEY \`FK_a15d6a6bcd37b4ea765fe980641\``
    );
    await queryRunner.query(
      `ALTER TABLE \`user_playlists_playlist\` DROP FOREIGN KEY \`FK_d374b3f7f7148b196a31d572539\``
    );
    await queryRunner.query(
      `ALTER TABLE \`user_favorite_songs_song\` DROP FOREIGN KEY \`FK_c717cf594798f1e77d891e549b0\``
    );
    await queryRunner.query(
      `ALTER TABLE \`user_favorite_songs_song\` DROP FOREIGN KEY \`FK_e782a10b07ed354029b0738ea56\``
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`status\` enum ('Active', 'Deactive') NOT NULL DEFAULT 'Active'`
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
    await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`url\``);
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD \`url\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` CHANGE \`albumId\` \`albumId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` CHANGE \`authorId\` \`authorId\` int NULL`
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
      `ALTER TABLE \`song\` ADD CONSTRAINT \`FK_c529927ae410af49faaf2e239a5\` FOREIGN KEY (\`albumId\`) REFERENCES \`album\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD CONSTRAINT \`FK_2347b7912d4e51efb37d74f52e3\` FOREIGN KEY (\`authorId\`) REFERENCES \`author\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`song_genres_genre\` ADD CONSTRAINT \`FK_ef75919535dd2416feab8a270f7\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`song_genres_genre\` ADD CONSTRAINT \`FK_01b24c0f3bc40b1246f1d853f8b\` FOREIGN KEY (\`genreId\`) REFERENCES \`genre\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`playlist_songs_song\` ADD CONSTRAINT \`FK_3e66846398a681262e56574fc99\` FOREIGN KEY (\`playlistId\`) REFERENCES \`playlist\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`playlist_songs_song\` ADD CONSTRAINT \`FK_efc8204ff6cdd9f17e83f8d001e\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_playlists_playlist\` ADD CONSTRAINT \`FK_a15d6a6bcd37b4ea765fe980642\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_playlists_playlist\` ADD CONSTRAINT \`FK_d374b3f7f7148b196a31d57253a\` FOREIGN KEY (\`playlistId\`) REFERENCES \`playlist\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_favorite_songs_song\` ADD CONSTRAINT \`FK_c717cf594798f1e77d891e549b5\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_favorite_songs_song\` ADD CONSTRAINT \`FK_e782a10b07ed354029b0738ea5c\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_favorite_songs_song\` DROP FOREIGN KEY \`FK_e782a10b07ed354029b0738ea5c\``
    );
    await queryRunner.query(
      `ALTER TABLE \`user_favorite_songs_song\` DROP FOREIGN KEY \`FK_c717cf594798f1e77d891e549b5\``
    );
    await queryRunner.query(
      `ALTER TABLE \`user_playlists_playlist\` DROP FOREIGN KEY \`FK_d374b3f7f7148b196a31d57253a\``
    );
    await queryRunner.query(
      `ALTER TABLE \`user_playlists_playlist\` DROP FOREIGN KEY \`FK_a15d6a6bcd37b4ea765fe980642\``
    );
    await queryRunner.query(
      `ALTER TABLE \`playlist_songs_song\` DROP FOREIGN KEY \`FK_efc8204ff6cdd9f17e83f8d001e\``
    );
    await queryRunner.query(
      `ALTER TABLE \`playlist_songs_song\` DROP FOREIGN KEY \`FK_3e66846398a681262e56574fc99\``
    );
    await queryRunner.query(
      `ALTER TABLE \`song_genres_genre\` DROP FOREIGN KEY \`FK_01b24c0f3bc40b1246f1d853f8b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`song_genres_genre\` DROP FOREIGN KEY \`FK_ef75919535dd2416feab8a270f7\``
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_2347b7912d4e51efb37d74f52e3\``
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_c529927ae410af49faaf2e239a5\``
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
      `ALTER TABLE \`song\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`song\` CHANGE \`albumId\` \`albumId\` int NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`url\``);
    await queryRunner.query(
      `ALTER TABLE \`song\` ADD \`url\` varchar(6000) NOT NULL`
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
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`user_favorite_songs_song\` ADD CONSTRAINT \`FK_e782a10b07ed354029b0738ea56\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_favorite_songs_song\` ADD CONSTRAINT \`FK_c717cf594798f1e77d891e549b0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_playlists_playlist\` ADD CONSTRAINT \`FK_d374b3f7f7148b196a31d572539\` FOREIGN KEY (\`playlistId\`) REFERENCES \`playlist\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_playlists_playlist\` ADD CONSTRAINT \`FK_a15d6a6bcd37b4ea765fe980641\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`playlist_songs_song\` ADD CONSTRAINT \`FK_efc8204ff6cdd9f17e83f8d001b\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`playlist_songs_song\` ADD CONSTRAINT \`FK_3e66846398a681262e56574fc9f\` FOREIGN KEY (\`playlistId\`) REFERENCES \`playlist\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`song_genres_genre\` ADD CONSTRAINT \`FK_ef75919535dd2416feab8a270f5\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`song_genres_genre\` ADD CONSTRAINT \`FK_01b24c0f3bc40b1246f1d853f82\` FOREIGN KEY (\`genreId\`) REFERENCES \`genre\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
