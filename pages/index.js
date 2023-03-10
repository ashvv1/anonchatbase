import Head from 'next/head'
import styles from '../styles/Home.module.css';
import { getAuth, signInAnonymously } from "firebase/auth";
import { useRouter } from 'next/router';
import { Auth } from "../context/context";
import { useContext } from "react";


export default function Home() {

const authContext = useContext(Auth);

const router = useRouter();

const logIn = () => {
  signInAnonymously(authContext.auth)
  .then((res) => {
    router.push("/chats")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`errorCode: ${errorCode} errorMessage: ${error.message}`)
  });
}

  return (
    <>
      <Head>
        <title>Anonymous Chat App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.loginContainer}>
          <h2>Start Session</h2>
          <button onClick={() => logIn()}>ENTER</button>
        </div> 
      </main>
    </>
  )
}
