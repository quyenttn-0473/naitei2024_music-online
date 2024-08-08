import { AppDataSource } from '../config/data-source';
import { Author } from '../entities/Author.entity';
import { TFunction } from 'i18next';

const authorRepository = AppDataSource.getRepository(Author);

export const getAuthors = async () => {
  return authorRepository.find();
};

export const getAuthorById = async (authorId: number, t: TFunction) => {
  try {
    return await authorRepository.findOne({
      where: { id: authorId },
      relations: ['songs', 'albums'],
    });
  } catch (error) {
    throw new Error(t('error.failedToFetchAuthor'));
  }
};

export const checkAuthorExistsByName = async (fullname: string) => {
  try {
    const author = await authorRepository.findOne({ where: { fullname } });
    return author !== null;
  } catch (error) {
    throw new Error('Error checking author existence');
  }
};

export const createAuthor = async (
  data: Partial<Author>,
  t: TFunction<'translation', undefined>
): Promise<Author> => {
  try {
    const existingAuthor = await authorRepository.findOne({
      where: { fullname: data.fullname },
    });
    if (existingAuthor) {
      throw new Error(t('error.authorAlreadyExists'));
    }

    const author = authorRepository.create(data);
    await authorRepository.save(author);
    return author;
  } catch (error) {
    throw new Error(t('error.failedToCreateAuthor'));
  }
};

export const updateAuthor = async (
  authorId: number,
  data: Partial<Author>,
  t: TFunction
) => {
  try {
    const author = await authorRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new Error(t('error.authorNotFound'));
    }
    Object.assign(author, data);
    await author.save();
    return author;
  } catch (error) {
    throw new Error(t('error.failedToUpdateAuthor'));
  }
};

export const deleteAuthor = async (authorId: number, t: TFunction) => {
  try {
    const author = await authorRepository.findOne({
      where: { id: authorId },
      relations: ['songs'],
    });

    if (!author) {
      throw new Error(t('error.authorNotFound'));
    }

    if (author.songs.length > 0) {
      throw new Error(t('warning.authorHasSongs'));
    }

    await authorRepository.remove(author);
  } catch (error) {
    throw new Error(t('error.failedToDeleteAuthor'));
  }
};
