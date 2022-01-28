import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  last_publication_date: Date;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

type LastDate = {
  mounth: {
    year: string;
    mounth: string;
    day: string;
  };
  hour: string;
};

export default function Post({ post }: PostProps): JSX.Element {
  function handleLastDate(date: string): LastDate {
    const MounthHour = date.split(' ');
    const Mounth = MounthHour[0].split('-');
    const Hour = MounthHour[1];
    const MounthHourSeparated = {
      mounth: {
        year: Mounth[0],
        mounth: Mounth[1],
        day: Mounth[2],
      },
      hour: Hour,
    };
    return MounthHourSeparated;
  }
  const [firstPublicationData] = useState(
    format(new Date(post.first_publication_date), 'dd MMM yyyy', {
      locale: ptBR,
    })
  );
  const [lastDateEdited] = useState(
    handleLastDate(
      format(new Date(post.last_publication_date), 'yyyy-MMM-dd HH:mm')
    )
  );

  const router = useRouter();
  return (
    <div className={commonStyles.generalContainer}>
      <Header />
      <main>
        {router.isFallback && <div>Carregando...</div>}
        <img
          src={post.data.banner.url}
          alt={post.data.banner.alt}
          className={styles.image}
        />
        <div className={styles.textBody}>
          <h1 className={styles.title}>{post.data.title}</h1>
          <div className={styles.infoContainer}>
            <div className={styles.infoContent}>
              <FiCalendar className={styles.icon} />
              <p className={styles.text}>{firstPublicationData}</p>
            </div>
            <div className={styles.infoContent}>
              <FiUser className={styles.icon} />
              <p className={styles.text}>{post.data.author}</p>
            </div>
            <div className={styles.infoContent}>
              <FiClock className={styles.icon} />
              <p className={styles.text}>4 min</p>
            </div>
          </div>
          <p
            className={styles.lastPublicationDate}
          >{`* editado em ${lastDateEdited.mounth.day} ${lastDateEdited.mounth.mounth} ${lastDateEdited.mounth.year}, às ${lastDateEdited.hour}`}</p>
          <div>
            {post.data.content.map(field => {
              return (
                <div className={styles.content} key={field.heading}>
                  <p className={styles.titleContent}>{field.heading}</p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(field.body),
                    }}
                    className={styles.bodyContent}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'posts')
  );
  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });
  return {
    fallback: true,
    paths,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;
  const post = await prismic.getByUID('posts', slug as string, {});
  return {
    props: {
      post,
    },
  };
};
