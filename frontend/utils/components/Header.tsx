import { Avatar } from 'antd'
import { useTypedSession } from '@utils/hooks/useTypedSession'
import { signOut } from 'next-auth/client'
import { useModal } from '@utils/hooks/useModal'
import { motion, AnimatePresence } from 'framer-motion'
import { MouseEvent, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Confirm from './Confirm'

type Props = {
  title?: string
}

export const menuItemClass =
  'p-2 px-5 hover:bg-gray-200 hover:text-current w-full cursor-pointer crm-transition font-semibold text-gray-700'

export default function Header({ title }: Props) {
  const [session] = useTypedSession()
  const [seed] = useState(Math.random())
  const [visible, setVisible] = useState(false)
  const [confirm, openConfirm, closeConfirm] = useModal()

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

        <Confirm
          visible={confirm}
          close={closeConfirm}
          message="You are about to sign out"
          onYes={signOut}
        />

        <AnimatePresence exitBeforeEnter>
          {visible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute border top-[120%] right-0 bg-white rounded-md shadow-md py-2 min-w-[150px] whitespace-nowrap flex flex-col h-auto"
            >
              <Link href="/profile">
                <a className={menuItemClass}>
                  <span className="fa fa-user mr-2" />
                  Profile
                </a>
              </Link>

              <div
                onClick={openConfirm}
                tabIndex={0}
                role="button"
                className={menuItemClass}
              >
                <span className="fa fa-sign-out-alt mr-2" />
                Sign Out
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
