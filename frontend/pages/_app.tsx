import type { AppProps } from 'next/app'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer, toast } from 'react-toastify';
import '../styles/globals.css'
import '../styles/tailwind.css'
import 'react-toastify/dist/ReactToastify.css';
import { Provider as NextAuthProvider } from 'next-auth/client'

export default function MyApp({ Component, pageProps }: AppProps) {

  const [queryClient] = useState(() => new QueryClient())

  return (
    <NextAuthProvider
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
      }}
      session={pageProps.session}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </QueryClientProvider>
    </NextAuthProvider>

  )
}


