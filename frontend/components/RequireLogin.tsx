import { useGradeBookSession } from '@utils/hooks/useSession'
import { signIn } from 'next-auth/client'
import Loading from './Loading'

export default function RequireLogin() {
  const [session, loading] = useGradeBookSession()

  if (typeof window !== undefined && loading) {
    return (
      <div className="min-h-screen bg-gray-50 grid place-content-center">
        <Loading size={45} />
      </div>
    )
  }
  if (!session) {
    signIn()
  }

  return <></>
}
