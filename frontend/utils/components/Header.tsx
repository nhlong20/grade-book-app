import { Avatar } from 'antd'
import { useTypedSession } from '@utils/hooks/useTypedSession'
import { signout } from 'next-auth/client'
import { MouseEvent, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { dehydrate, QueryClient, useQuery, useQueryClient } from 'react-query'
import { getSessionToken } from '@utils/libs/getToken'
import { GetServerSideProps } from 'next'
import { getReceivedNotification } from '@utils/service/noti'
import { GlobalState } from '@utils/GlobalStateKey'
import { API } from 'environment'
type Props = {
  title?: string
}

export const menuItemClass =
  'p-2 px-5 hover:bg-gray-200 hover:text-current w-full cursor-pointer crm-transition font-semibold text-gray-700'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getSessionToken(ctx.req.cookies)
  const client = new QueryClient()

  if (token) {
    await Promise.all([
      client.prefetchQuery('user', getReceivedNotification(token)),
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

type FormData = {
  name: string
  phone: string
  mssv: string
}

export default function Header({ title }: Props) {
  const { data: notifications } = useQuery('notifications', getReceivedNotification())
  const [session] = useTypedSession()
  const [seed] = useState(Math.random())
  const [visible, setVisible] = useState(false)
  const [showNotiList, setShowNotiList] = useState(false)
  const receivedNotifications = [...(notifications || [])]
  const client = useQueryClient()

  const toggle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setVisible((v) => !v)
  }, [])

  const toggleNotiList = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowNotiList((v) => !v)
  }, [])

  useEffect(() => {
    const close = () => setVisible(false)
    document.addEventListener('click', close)

    return () => {
      document.removeEventListener('click', close)
    }
  }, [])

  useEffect(() => {
    if (!session) return

    const eventSource = new EventSource(API + '/api/subscribe', {
      withCredentials: true,
    })

    if (!eventSource) return
    eventSource.onmessage = ({ data }: MessageEvent) => {
      client.setQueryData(GlobalState.SUBSCRIPTION, JSON.parse(data))
    }

    return () => {
      eventSource.close()
    }
  }, [session])

  return (
    <header className="cr-container sticky top-0 flex justify-between items-center h-[60px] shadow-md">
      <div className="font-semibold text-xl">{title || 'Classroom'}</div>
      <div className="flex gap-3 items-center relative z-20">
        <span>Hi, {session?.user.name}</span>

        <button onClick={toggle}>
          <Avatar src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`} />
        </button>

        <button onClick={toggleNotiList}>
          <span className="fas fa-bell fa-lg mr-2 mt-2" />
        </button>

        {visible && (
          <div className="absolute border top-[120%] right-0 bg-white rounded-md shadow-md py-2 min-w-[150px] whitespace-nowrap flex flex-col h-auto">
            <Link href="/profile">
              <a className={menuItemClass}>
                <span className="fa fa-user mr-2" />
                Profile
              </a>
            </Link>

            <div
              onClick={() => signout()}
              tabIndex={0}
              role="button"
              className={menuItemClass}
            >
              <span className="fa fa-sign-out-alt mr-2" />
              Sign Out
            </div>
          </div>
        )}

        {showNotiList && (
          <div className="absolute border top-[120%] right-0 bg-white rounded-md shadow-md py-2 min-w-[150px] whitespace-nowrap flex flex-col h-auto">
            {receivedNotifications.length == 0 ? (
              <div>
                <a className={menuItemClass}>
                  <p>Bạn không có thông báo nào</p>
                </a>
              </div>
            ) : (
              <></>
            )}
            {receivedNotifications?.map(({ actor, message }) => (
              <div>
                <a className="py-2">
                  <h4>{message.title}</h4>
                  <p className="">{message.body}</p>
                  <small>{message.createdAt}</small>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
