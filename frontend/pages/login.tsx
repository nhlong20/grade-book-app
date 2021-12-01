import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { notification } from 'antd'
import Layout from '@utils/components/Layout'

type FormData = {
  email: string
  password: string
}

const errorMapping: Record<string, string> = {
  AccessDenied: 'Your account has not existed in the system yet!',
  CredentialsSignin: 'Your provided credentials are not correct!',
  Callback: 'System failure!',
};

export default function Login() {
  const { query } = useRouter()
  const { register, handleSubmit } = useForm<FormData>()

  useEffect(() => {
    if (!('error' in query)) return
    notification.error({
      message: errorMapping[query.error as string],
    })
  }, [query])

  const login = useCallback(
    (data: Record<string, any>) => {
      signIn('login', {
        callbackUrl: (query.callbackUrl as string) || '/',
        ...data,
      });
    },
    [query]
  );

  const loginWithGoogle = useCallback(() => {
    signIn('google', {
      callbackUrl: (query.callbackUrl as string) || '/',
    });
  }, [query]);

  return (
    <Layout
      header={false}
      requireLogin={false}
      title="Login - Classroom">
      <div className="min-h-screen grid w-full place-content-center">
        <form
          onSubmit={handleSubmit(login)}
          className="w-96 rounded-md bg-white dark:bg-gray-600 inline-block p-8 shadow-md"
          noValidate>
          <h3 className="text-4xl font-bold text-blue-500 py-4 content-conter justify-center">
            Login to <br /> GRADEBOOKS
          </h3>
          <div className="mb-4">
            <label htmlFor="email" className="cr-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="cr-input w-full"
              {...register('email', {
                required: {
                  value: true,
                  message: 'Email is required',
                },
              })}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="pwd" className="cr-label">
              Password
            </label>
            <input
              type="password"
              autoComplete="currentpassword"
              id="pwd"
              className="cr-input w-full"
              {...register('password', {
                required: {
                  value: true,
                  message: 'Password is required',
                },
              })}
            />
          </div>

          <div className="mt-2">
            <button type="submit" className="cr-button w-full py-3 uppercase font-bold">
              Login
            </button>
          </div>
          <div className="mt-2">
            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-red-500 text-white hover:bg-red-600 focus:outline-none my-1 uppercase font-bold"
              onClick={loginWithGoogle}
            >
              {' '}
              <i className="fab fa-google mr-2" />
              Đăng nhập với Google
            </button>

          </div>
          <p className="mt-2 flex justify-center">
            Bạn chưa có tài khoản? {' '}
            <Link href="/signup">
              <span className="underline cursor-pointer">Đăng ký</span>
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  )
}
