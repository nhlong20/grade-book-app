import '../styles/globals.css'
import '../styles/tailwind.css'
import type { AppProps } from 'next/app'
import axios from 'axios'


export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}


