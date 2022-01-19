import { Avatar, notification } from 'antd'
import { useTypedSession } from '@utils/hooks/useTypedSession'
import { signout } from 'next-auth/client'
import { MouseEvent, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import { getSessionToken } from '@utils/libs/getToken'
import { GetServerSideProps } from 'next'
import { getReceivedNotification } from '@utils/service/noti'
import { API } from 'environment'
import moment from 'moment'

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

export default function Header({ title }: Props) {
  const [isRead, setIsRead] = useState(false)

  const { data: notifications, refetch } = useQuery(
    'notifications',
    getReceivedNotification(),
    {
      enabled: false,
      onSuccess() {
        setIsRead(false)
      },
    },
  )

  console.log({ notifications })

  const [session] = useTypedSession()
  const [seed] = useState(Math.random())
  const [visible, setVisible] = useState(false)
  const [showNotiList, setShowNotiList] = useState(false)

  useEffect(() => {
    if (showNotiList) {
      setIsRead(true)
    }
  }, [showNotiList])

  const toggle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setVisible((v) => !v)
  }, [])

  const toggleNotiList = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowNotiList((v) => !v)
  }, [])

  useEffect(() => {
    const close = () => {
      setVisible(false)
      setShowNotiList(false)
    }

    document.addEventListener('click', close)

    return () => {
      document.removeEventListener('click', close)
    }
  }, [])

  useEffect(() => {
    if (!session) return

    const eventSource = new EventSource(API + '/subscribe', {
      withCredentials: true,
    })

    if (!eventSource) return

    eventSource.onmessage = ({ data }: MessageEvent) => {
      refetch()
    }

    return () => {
      eventSource.close()
    }
  }, [session])

  return (
    <header className="cr-container z-10 sticky top-0 flex justify-between items-center h-[60px] shadow-md">
      <Link href="/">
        <a className="font-semibold text-xl">{title || 'Classroom'}</a>
      </Link>

      <div className="flex gap-3 items-center relative z-20">
        <span>Hi, {session?.user.name}</span>

        <button onClick={toggle}>
          <Avatar src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`} />
        </button>

        <button className="relative" onClick={toggleNotiList}>
          <span className="fas fa-bell fa-lg mr-2 mt-2" />
          {!isRead && (
            <span className="absolute bg-green-600 top-0 right-0 w-3 h-3 rounded-full" />
          )}
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
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute border top-[120%] z-10 right-0 bg-white rounded-md shadow-md p-2 py-4 max-h-[600px] overflow-auto min-w-[350px] flex flex-col gap-2"
          >
            {!notifications?.length && (
              <div>
                <a className={menuItemClass}>
                  <p>Bạn không có thông báo nào</p>
                </a>
              </div>
            )}

            {notifications?.map(({ message }) => (
              <div className="py-2">
                <div className="font-semibold text-blue-600">
                  {message.title}
                </div>
                <div className="">{message.body}</div>
                <small>
                  {moment(message.createdAt)
                    .add(7, 'hours')
                    .format('DD/MM/YYYY HH:mm A')}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
