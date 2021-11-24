import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer, toast } from 'react-toastify'
import '../styles/globals.css'
import '../styles/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'
import { Provider as NextAuthProvider } from 'next-auth/client'
import { motion } from 'framer-motion'
import NProgress from 'nprogress'
import Router from 'next/router'
import AOS from 'aos'
import Sidebar from '@components/Sidebar'
import { useGradeBookSession } from '@utils/hooks/useSession'
import Navbar from '@components/Navbar'
Router.events.on('routeChangeStart', () => {
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => {
  NProgress.done()
})
Router.events.on('routeChangeError', () => NProgress.done())

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const [session] = useGradeBookSession()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (session && session.user.email !== '') {
      setIsLoggedIn(true)
    }
  }, [session])

  const [queryClient] = useState(() => new QueryClient())
  useEffect(() => {
    AOS.init({
      offset: 50,
      once: true,
    })
  }, [])
  return (
    <NextAuthProvider
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
      }}
      session={pageProps.session}
    >
      <QueryClientProvider client={queryClient}>
        <motion.div
          key={router.route}
          initial="initial"
          animate="animate"
          variants={{
            initial: {
              opacity: 0,
            },
            animate: {
              opacity: 1,
            },
          }}
        >
          <Navbar isLoggedIn userData={session ? session.user : null} />

          <div className="flex-1 relative">
            {isLoggedIn && <Sidebar />}
            <div className="text-2xl font-bold">
              <Component {...pageProps} />
            </div>
          </div>
        </motion.div>

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
