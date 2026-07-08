import { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext, DocumentInitialProps } from "next/document";
import Document from "next/document";
import { DEFAULT_LOCALE, getLocaleMeta, isLocale } from "@/lib/i18n-config";

type DocumentProps = DocumentInitialProps & {
  locale: string;
};

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const localeParam = ctx.query?.locale;
    const locale = typeof localeParam === "string" && isLocale(localeParam)
      ? localeParam
      : DEFAULT_LOCALE;

    return {
      ...initialProps,
      locale,
    };
  }

  render() {
    const meta = getLocaleMeta(this.props.locale);

    return (
      <Html dir={meta.dir} lang={meta.code}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
