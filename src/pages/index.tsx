import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <div className={commonStyles.generalContainer}>
      <Header />
      <main className={styles.container}>
        <ul className={styles.list}>
          <li className={styles.itemList}>
            <p className={styles.title}>Como utilizar Hooks</p>
            <p className={styles.subtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>
            <div className={styles.infoContainer}>
              <div className={styles.infoContent}>
                <FiCalendar className={styles.icon} />
                <p className={styles.text}>15 Mar 2021</p>
              </div>
              <div className={styles.infoContent}>
                <FiUser className={styles.icon} />
                <p className={styles.text}>Joseph Oliveira</p>
              </div>
            </div>
          </li>
          <li className={styles.itemList}>
            <p className={styles.title}>Como utilizar Hooks</p>
            <p className={styles.subtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>
            <div className={styles.infoContainer}>
              <div className={styles.infoContent}>
                <FiCalendar className={styles.icon} />
                <p className={styles.text}>15 Mar 2021</p>
              </div>
              <div className={styles.infoContent}>
                <FiUser className={styles.icon} />
                <p className={styles.text}>Joseph Oliveira</p>
              </div>
            </div>
          </li>
        </ul>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      pageSize: 100,
    }
  );
  // console.log(postsResponse.results);
  const posts: Post[] = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: post.data,
    };
  });
  console.log(posts);
  return {
    props: {
      postsPagination: posts,
      next_page: postsResponse.next_page,
    },
  };
};
