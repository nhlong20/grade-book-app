import type { NextPage } from 'next'
import Head from 'next/head'
import SignUp from './signup'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Gradebooks</title>
      </Head>
      <div className="shadow-md py-2 fixed min-w-full">
        <div className="flex justify-around items-center">
          <h1 className="text-2xl cursor-pointer font-bold text-green-500 uppercase">Gradebooks</h1>
          <div>
            <Link href="/login">
              <button className="py-2 px-4 font-semibold shadow-md text-black hover:text-green-700 mx-1">
                Đăng nhập
              </button>
            </Link>
            <SignUp />
          </div>
        </div>
      </div>

      <div className="container h-screen min-h-full min-w-full">
        <main className="flex flex-col text-center min-h-full justify-center">

          <h1 className="text-4xl sm:text-4xl lg:text-6xl text-green-500 font-bold uppercase">Gradebooks</h1>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-center pt-8">
            Where teaching and learning come together
          </h1>

          <p className="text-xl p-8">
            Grade Books is your all-in-one place for teaching and learning. Our easy-to-use and secure tool helps educators manage, measure, and enrich learning experiences.
          </p>

          <div className="flex justify-center">
            <div className="mx-4 text-center">
              <p className="text-2xl font-semibold pb-2">Bạn là giáo viên?</p>
              <button className="py-3 px-8 text-lg md:text-xl font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700">
                Tạo lớp học ngay
              </button>
            </div>
            <div className="mx-4 text-center">
              <p className="text-2xl font-semibold pb-2">Bạn là học viên?</p>
              <button className="py-3 px-8 text-lg md:text-xl font-semibold rounded-lg shadow-md text-green-500 bg-white-500 hover:bg-gray-300">
                Tham gia lớp học
              </button>
            </div>

          </div>

        </main>

      </div>


    </div>
  )
}

export default Home
