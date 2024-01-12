import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        crossOrigin="anonymous">
        </link>
      </Head>
      <body id="background-color">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
