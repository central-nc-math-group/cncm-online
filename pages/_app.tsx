import 'tailwindcss/tailwind.css'
import { ProvideAuth } from "../utils/firebase/auth";
import Contest2 from './contest/active';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster
  position="bottom-left"
  reverseOrder={false}
/>
      <ProvideAuth>
        <Component {...pageProps} />
      </ProvideAuth>
    </>

  );
}

export default MyApp
