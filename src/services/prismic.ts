import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';

export function getPrismicClient(req?: unknown): DefaultClient {
  const prismic = Prismic.client(
    'https://ignite-projeto-do-zero.prismic.io/api/v2',
    {
      req,
      accessToken: process.env.PRISMIC_API_ENDPOINT,
    }
  );

  return prismic;
}
// alguemfala623
