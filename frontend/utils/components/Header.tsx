import { Avatar } from 'antd'
import { useTypedSession } from '@utils/hooks/useTypedSession'
import { signout } from 'next-auth/client'
import { MouseEvent, useCallback, useState } from 'react'

type Props = {
  title?: string
}

export const menuItemClass =
  'p-2 px-5 hover:bg-gray-200 hover:text-current w-full cursor-pointer crm-transition font-semibold text-gray-700'

export default function Header({ title }: Props) {
  const [session] = useTypedSession()
  const [seed] = useState(Math.random())
  const [visible, setVisible] = useState(false)

  const toggle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setVisible((v) => !v)
  }, [])

  return (
    <header className="cr-container sticky top-0 flex justify-between items-center h-[60px] shadow-md">
      <div className="font-semibold text-xl">{title || 'Classroom'}</div>
      <div className="flex gap-3 items-center relative z-20">
        <span>Hi, {session?.user.name}</span>

        <button onClick={toggle}>
          <Avatar src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`} />
        </button>

        {visible && (
          <div className="absolute border top-[120%] right-0 bg-white rounded-md shadow-md py-2 min-w-[150px] whitespace-nowrap flex flex-col h-auto">
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
      </div>
    </header>
  )
}
