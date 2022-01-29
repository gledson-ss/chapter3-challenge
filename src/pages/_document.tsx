import Document, {
  Head,
  Html,
  DocumentContext,
  DocumentInitialProps,
  Main,
  NextScript,
} from 'next/document';
import { repoName } from '../services/prismic';

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        // useful for wrapping the whole react tree
        enhanceApp: App => App,
        // useful for wrapping in a per-page basis
        enhanceComponent: Component => Component,
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
          <meta charSet="utf-8" />
          <link
            href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900"
            rel="stylesheet"
          />
          <link rel="icon" href="/favicon.png" type="image/png" />
          <script
            async
            defer
            src="https://static.cdn.prismic.io/prismic.js?new=true&repo=ignite-projeto-do-zero"
          />
        </Head>
        <Main />
        <NextScript />
      </Html>
    );
  }
}
