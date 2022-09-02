import { Html, Head, Main, NextScript } from "next/document";

export default function Document(): JSX.Element {
    return (
        <Html>
            <Head>
                <link rel="manifest" href="/manifest.webmanifest" />
                <link rel="apple-touch-icon" sizes="150x150" href="/icon-150x150.png"></link>
                <meta name="theme-color" content="#288BC0" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
