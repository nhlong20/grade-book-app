import { Class } from "@utils/models/class"
import { useQuery } from "react-query"
import { useTypedSession } from "./useTypedSession"

export const useTeacher = () => {
  const { data: clas } = useQuery<Class>(['class', ], { enabled: false })
  const [session] = useTypedSession()

  return clas?.teachers.some(t => t.id === session?.user.id)
}