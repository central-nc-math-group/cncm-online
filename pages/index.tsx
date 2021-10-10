import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { Component, useEffect } from 'react';
import Navbar from '../components/Navbar/navbar';
import ContestTile from '../components/ContestTile/contestTile';
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
    <>
      <Navbar/>
      <h1>UPCOMING</h1>
      <ContestTile title="CNCM Online Fall 2021" date="August 23rd, 2021" time="2:00 - 3:00 PM ET"/>
      <h1>FINISHED</h1>
      <ContestTile title="CNCM Online Spring 2021" date="March 31st, 2021" time="2:00 - 3:00 PM ET"/>
      <ContestTile title="CNCM Online Round 3" date="November 7, 2020" time="2:00 - 3:00 PM ET"/>
      <div>
        {!!auth.uid ? (
          <button onClick={auth.logout}>Log Out</button>
        ) : (
          <>
            <button onClick={() => router.push("/login")}>Log In</button>
            <button onClick={() => router.push("/signup")}>Sign Up</button>
          </>
        )}
      </div>


    </>
  );
}
