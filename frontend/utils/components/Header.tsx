import { useTypedSession } from '@utils/hooks/useTypedSession'

type Props = {
  title?: string
}

export default function Header({ title }: Props) {
  const [session] = useTypedSession()

  return (
    <header className="cr-container sticky top-0 flex justify-between items-center h-[60px] shadow-md">
      <div className="font-semibold text-xl">{title || 'Classroom'}</div>
      <div>Hi, {session?.user.name}</div>
    </header>
  )
}
