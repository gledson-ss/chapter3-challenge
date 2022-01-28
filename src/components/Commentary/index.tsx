import { useEffect } from 'react';
import styles from './commentay.module.scss';

const Commentary: React.FC = () => {
  useEffect(() => {
    const anchor = document.getElementById('script-comments');
    anchor.setAttribute('src', 'https://utteranc.es/client.js');
    anchor.setAttribute('crossorigin', 'anonymous');
    anchor.setAttribute('repo', 'gledson-ss/utterances-commentary');
    anchor.setAttribute('issue-term', 'pathname');
    anchor.setAttribute('theme', 'github-light');
  }, []);

  return (
    <div
      id="inject-comments-for-uterances"
      className={styles.injectCommentsForUterances}
    >
      <script id="script-comments" async />
    </div>
  );
};

export default Commentary;
