import Layout from '@utils/components/Layout'
import { notification } from 'antd'
import axios from 'axios'
import { API } from 'environment'
import { signin, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Invite() {
  const { query, push } = useRouter()
  const [session] = useSession()

  const token = query.token as string
  const classId = query.accessId as string

  useEffect(() => {
    if (!session) {
      signin('login', {
        callbackUrl: (query.callbackUrl as string) || '/',
      })

      return
    }

    axios
      .put(API + '/class/' + classId + '/join', { token })
      .then(() => push(`class/${classId}`))
      .catch(() => {
        notification.error({ message: 'Join class failed' })
        push('/')
      })
  }, [])

  return (
    <Layout requireLogin>
      <div className="grid place-content-center">Joining class</div>
    </Layout>
  )
}
