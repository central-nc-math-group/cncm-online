import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css'
import { useAuth } from '../utils/auth'
import { Auth } from '../utils/types';

export default function Home() {
  const auth: Auth = useAuth() as Auth;
  const router = useRouter();

  useEffect(() => {
    fetch(`api/spam`).then(res => res.json()).then(json => console.log(json.val));
  }, []);
  
  return (
    <div>
      EEEEEEEEEEEEEEEEEEEEEEEE
      {!!auth.uid ? (
        <button onClick={auth.logout}>Log Out</button>
      ) : (
        <>
          <button onClick={() => router.push("/login")}>Log In</button>
          <button onClick={() => router.push("/signup")}>Sign Up</button>
        </>
      )}
    </div>
  );
}
