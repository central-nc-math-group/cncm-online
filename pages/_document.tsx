import NextDocument, { Html, Head, Main, NextScript } from "next/document";

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="bg-gray-800 text-gray-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
