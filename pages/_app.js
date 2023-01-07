import '../styles/globals.css';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';
import Context from '../context/context';
import Head from 'next/head';

initializeApp(firebaseConfig);

export default function App({ Component, pageProps }) {

  return (
    <>
       <Head>
        <meta charset="UTF-8" />
        <meta name="keywords" content="titla, meta, nextjs" />
        <meta name="author" content="Syamlal CM" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <Context >
        <Component {...pageProps} />
      </Context>
    </>
  )

}
