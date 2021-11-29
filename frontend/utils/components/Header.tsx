import { useTypedSession } from '@utils/hooks/useTypedSession'

export default function Header() {
  const [session] = useTypedSession()

  return (
    <header className="cr-container sticky top-0 flex justify-between items-center h-[60px] shadow-md">
      <div className="font-semibold text-xl">Classroom</div>
      <div>Hi, {session?.user.name}</div>
    </header>
  )
}
