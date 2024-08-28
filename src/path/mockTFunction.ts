import { TFunction } from 'i18next';

const mockTFunction = ((key: string) => key) as TFunction<'translation', undefined>;

export { mockTFunction };
