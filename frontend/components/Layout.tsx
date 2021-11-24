import { ReactNode, useEffect } from 'react'
import { useGradeBookSession } from '@utils/hooks/useSession'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

const RequireLogin = dynamic(() => import('./RequireLogin'), { ssr: false })

interface Props {
  children?: ReactNode
  requireLogin?: boolean
  title?: string
}

function Layout({
  children,
  requireLogin,
  title,
}: Props) {
  const [session] = useGradeBookSession()
  const { replace } = useRouter()
  useEffect(() => {
    if (session && !session.user) replace('/403')
  }, [session])

  return (
    <div>
      <Head>
        <title>{title || 'HCMUSMods'}</title>
      </Head>
      {requireLogin && <RequireLogin />}
      {(!requireLogin || session) && (
        <>
          {children}
        </>
      )}
    </div>
  )
}


export default Layout