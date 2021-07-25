import '../styles/globals.css'
import { ProvideAuth } from "../utils/auth";

function MyApp({ Component, pageProps }) {
  return (
    <ProvideAuth>
      <Component {...pageProps} />
    </ProvideAuth>
  );
}

export default MyApp
