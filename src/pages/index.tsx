import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import Link from 'next/link';
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
  const postInitial = postsPagination.results.map(post => {
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

  const [postList, setPostList] = useState<Post[]>(postInitial);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleLoadMorePost(): Promise<void> {
    const PostResponse: PostPagination = await (
      await fetch(postsPagination.next_page)
    ).json();
    const newPost = PostResponse.results.map(post => {
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
    setPostList([...postList, ...newPost]);
    setNextPage(PostResponse.next_page);
  }

  return (
    <div className={commonStyles.generalContainer}>
      <Header />
      <main className={styles.container}>
        <ul className={styles.list}>
          {postList.map(post => {
            return (
              <Link href={`/post/${post.uid}`} key={post.uid}>
                <li className={styles.itemList} aria-hidden="true">
                  <p className={styles.title}>{post.data.title}</p>
                  <p className={styles.subtitle}>{post.data.subtitle}</p>
                  <div className={styles.infoContainer}>
                    <div className={styles.infoContent}>
                      <FiCalendar className={styles.icon} />
                      <p className={styles.text}>
                        {post.first_publication_date}
                      </p>
                    </div>
                    <div className={styles.infoContent}>
                      <FiUser className={styles.icon} />
                      <p className={styles.text}>{post.data.author}</p>
                    </div>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
        {nextPage && (
          <button
            type="button"
            className={styles.buttonLoadMore}
            onClick={handleLoadMorePost}
          >
            <span className={styles.buttonText}>Carregar mais posts</span>
          </button>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      pageSize: 1,
      page: 0,
    }
  );

  const posts: Post[] = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        author: post.data.author,
        subtitle: post.data.subtitle,
        title: post.data.title,
      },
    };
  });
  const postsPagination = {
    results: posts,
    next_page: postsResponse.next_page,
  };
  return {
    props: {
      postsPagination,
    },
  };
};
