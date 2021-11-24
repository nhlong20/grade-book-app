/** @format */
import Link from 'next/link'
export default function Sidebar() {
  return (
    <div className="bg-green-500 text-blue-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <Link href="/">
        <div className="text-white flex items-center space-x-2 px-4">
          <span className="text-2xl font-extrabold">Grade Book</span>
        </div>
      </Link>

      <nav>
        <Link href="/class">
          <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 hover:text-white">
            Lớp học của tôi
          </div>
        </Link>
        <Link href="/profile">
          <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 hover:text-white">
            Cài Đặt
          </div>
        </Link>
      </nav>
    </div>
  )
}
