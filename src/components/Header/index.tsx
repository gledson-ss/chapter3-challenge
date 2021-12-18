import Image from 'next/image';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <Image src="/Logo.svg" width="240px" height="25px" />
    </header>
  );
}
