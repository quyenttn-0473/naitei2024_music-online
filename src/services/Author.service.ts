import { AppDataSource } from '../config/data-source';
import { Author } from '../entities/Author.entity';

const authorRepository = AppDataSource.getRepository(Author);

export const getAuthors = async () => {
  return await authorRepository.find();
};
export const getAuthorById = async (authorId: number) => {
  return await authorRepository.findOne({
    where: { id: authorId },
  });
};
