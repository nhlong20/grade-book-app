import Head from 'next/head'
import { useRouter } from 'next/router'

export default function NotFound() {
  const { push } = useRouter()

  return (
    <div className="min-h-screen grid place-content-center">
      <Head>
        <title>Not Found | Gradebooks</title>
      </Head>

      <div className="flex flex-col items-center">
        <img src="/illustrations/404.svg" alt="Not Found" />
        <div className="mt-4 font-medium text-gray-600 text-lg">
          Oops! It looks like you have followed a bad link!!
        </div>
        <button onClick={() => push('/')} className="hcmus-button w-40 mt-2">
          <span className="fa fa-home mr-2" />
          Back To Home
        </button>
      </div>
    </div>
  )
}