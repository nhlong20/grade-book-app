import { ReactNode } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Header from './Header'
import { useSession } from 'next-auth/client'

const RequireLogin = dynamic(() => import('./RequireLogin'), { ssr: false })

interface Props {
  title?: string
  children: ReactNode
  requireLogin?: boolean
  header?: boolean
  classTitle?: string
}

function Layout({ children, title, requireLogin, header, classTitle }: Props) {
  const [session] = useSession()
  return (
    <>
      <Head>
        <title>{title || 'Classroom'}</title>
      </Head>

      {requireLogin && <RequireLogin />}
      {(!requireLogin || session) && (
        <>
          {header && <Header title={classTitle} />}
          <main>{children}</main>{' '}
        </>
      )}
    </>
  )
}

Layout.defaultProps = {
  header: true,
}

export default Layout
