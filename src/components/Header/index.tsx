import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <Link href="/">
        <Image src="/Logo.svg" width="240px" height="25px" alt="logo" />
      </Link>
    </header>
  );
}
