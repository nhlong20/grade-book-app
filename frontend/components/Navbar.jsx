import Link from 'next/link'
import UserDropDown from './UserDropDown'

export default function Navbar({ isLoggedIn, userData }) {
  return (
    <div className="shadow-md py-2">
      <div className="flex justify-around items-center">
        <Link href="/">
          <h1 className="text-2xl cursor-pointer font-bold text-green-500 uppercase">
            Gradebooks
          </h1>
        </Link>
        {isLoggedIn && userData ? (
          <UserDropDown userData={userData} />
        ) : (
          <ul className="flex">
            <li>
              <Link href="/login">
                <button className="py-2 px-4 font-semibold shadow-md text-black hover:text-green-700 mx-1">
                  Đăng nhập
                </button>
              </Link>
            </li>
            <li>
              <Link href="/signup">
                <button className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700 mx-1">
                  Đăng ký
                </button>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}

Navbar.defaultProps = {
  isLoggedIn: false,
  userData: null,
}
