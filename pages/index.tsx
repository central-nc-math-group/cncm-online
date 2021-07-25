import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import { useAuth } from '../utils/auth'

export default function Home() {
  const auth: any = useAuth();
  const router = useRouter();
  
  return (
    <div>
      EEEEEEEEEEEEEEEEEEEEEEEE
      {!!auth.uid ? (
        <button onClick={auth.signout}>Sign Out</button>
      ) : (
        <>
          <button onClick={() => router.push("/signin")}>Sign In</button>
          <button onClick={() => router.push("/signup")}>Sign Up</button>
        </>
      )}
    </div>
  );
}
