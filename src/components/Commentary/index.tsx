import { useEffect } from 'react';
import styles from './commentay.module.scss';

const Commentary: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    const div = document.getElementById('inject-comments-for-uterances');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('repo', 'gledson-ss/utterances-commentary');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-light');

    div.appendChild(script);
  }, []);

  return (
    <div
      id="inject-comments-for-uterances"
      className={styles.injectCommentsForUterances}
    />
  );
};

export default Commentary;
