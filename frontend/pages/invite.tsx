import Layout from '@utils/components/Layout'
import { notification } from 'antd'
import axios from 'axios'
import { API } from 'environment'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Invite() {
  const { query, push } = useRouter()

  const token = query.token as string
  const classId = query.accessId as string
  console.log(classId)

  useEffect(() => {
    if (!classId) return
    axios
      .put(API + '/class/' + classId + '/join', { token })
      .then(() => push(`class/${classId}`))
      .catch((e) => {
        alert(JSON.stringify(e, null, 2))

        notification.error({ message: 'Join class failed' })
        push('/')
      })
  }, [classId])

  return (
    <Layout requireLogin>
      <div className="grid place-content-center py-4 min-h-[300px]">
        Joining class
      </div>
    </Layout>
  )
}
