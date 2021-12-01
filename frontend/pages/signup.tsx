import { API } from 'environment'
import Link from 'next/link'
import { notification } from 'antd'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import Layout from '@utils/components/Layout'
import { useRouter } from 'next/router'

type FormData = { name: string; email: string; password: string }

const errorMapping: Record<string, string> = {
  EmailExisted: 'That email has existed in the system!',
}

export default function SignUp() {
  const { register, handleSubmit } = useForm<FormData>()
  const { query } = useRouter()
  const [success, setSuccess] = useState(false)

  const { mutateAsync } = useMutation(
    ['signup'],
    (data: FormData) => axios.post(`${API}/auth/signup`, data),
    {
      onSuccess() {
        setSuccess(true)
      },
      onError() {
        notification.error({ message: 'System failure!' })
      },
    },
  )

  useEffect(() => {
    if (!('error' in query)) return
    notification.error({
      message: errorMapping[query.error as string],
    })
  }, [query])

  const signUp = useCallback((data: FormData) => {
    mutateAsync(data)
  }, [])


  return (
    <Layout
      header={false}
      requireLogin={false}
      title="Sign Up - Classroom"
    >
      <div className="min-h-screen m-[-16px] grid place-content-center w-full">
        <form
          onSubmit={handleSubmit(signUp)}
          noValidate
          className="w-96 rounded-md bg-white dark:bg-gray-600 inline-block p-8 shadow-md"
        >
          <div className="mb-4 text-center font-semibold text-2xl text-blue-600 dark:text-white">
            Sign up to Gradebook
          </div>

          {success ? (
            <div className="h-56 grid place-content-center text-center text-gray-400">
              Register succescfully, login to continue
              <br />
              <Link href="/login">Return to Login</Link>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-400">Bạn đã có tài khoản?{" "}
                <Link href="/login">
                  <span className="underline cursor-pointer">Đăng nhập</span>
                </Link>
              </p>

              <div className="mb-4">
                <label htmlFor="email" className="cr-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="cr-input w-full"
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'Name is required',
                    },
                  })}
                />
              </div>

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
                  Signup
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </Layout>
  )
}