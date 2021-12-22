import { Class } from '@utils/models/class'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { useTypedSession } from './useTypedSession'

export const useAuth = () => {
  const [session] = useTypedSession()
  const { query } = useRouter()

  const { data: clas } = useQuery<Class>(['class', query.id], {
    enabled: false,
  })

  return {
    isTeacher: !!clas?.teachers.some((t) => t.id === session?.user.id),
    isStudent: !!clas?.students.some((t) => t.id === session?.user.id),
  }
}
